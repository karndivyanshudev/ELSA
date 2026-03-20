// ===== ELSA Pomodoro Timer =====
class PomodoroTimer {
  constructor() {
    this.studyDuration = CONFIG.DEFAULT_STUDY_DURATION;
    this.breakDuration = CONFIG.DEFAULT_BREAK_DURATION;
    this.timeRemaining = this.studyDuration * 60;
    this.totalSeconds = this.studyDuration * 60;
    this.isActive = false;
    this.isBreak = false;
    this.sessionCount = 0;
    this.intervalId = null;
    this.startTime = null;
    this.studyStartTime = null;
    this.elapsedStudyMinutes = 0;

    // DOM references
    this.els = {};
    this._init();
  }

  _init() {
    this.els = {
      display: document.getElementById('timer-display'),
      mode: document.getElementById('timer-mode'),
      start: document.getElementById('timer-start'),
      pause: document.getElementById('timer-pause'),
      reset: document.getElementById('timer-reset'),
      studyInput: document.getElementById('study-duration'),
      breakInput: document.getElementById('break-duration'),
      counter: document.getElementById('session-counter'),
      dots: document.querySelectorAll('.session-dot'),
      ring: document.querySelector('.timer-ring')
    };

    if (!this.els.display) return; // Not on dashboard

    this._loadSettings();
    this._bindEvents();
    this._restoreState();
    this._updateDisplay();
  }

  _loadSettings() {
    const settings = storage.loadJSON('settings');
    this.studyDuration = settings.studyDuration || CONFIG.DEFAULT_STUDY_DURATION;
    this.breakDuration = settings.breakDuration || CONFIG.DEFAULT_BREAK_DURATION;
    this.timeRemaining = this.studyDuration * 60;
    this.totalSeconds = this.studyDuration * 60;

    if (this.els.studyInput) this.els.studyInput.value = this.studyDuration;
    if (this.els.breakInput) this.els.breakInput.value = this.breakDuration;
  }

  _bindEvents() {
    if (this.els.start) this.els.start.addEventListener('click', () => this.start());
    if (this.els.pause) this.els.pause.addEventListener('click', () => this.pause());
    if (this.els.reset) this.els.reset.addEventListener('click', () => this.reset());

    if (this.els.studyInput) {
      this.els.studyInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (val > 0 && val <= 180 && !this.isActive) {
          this.studyDuration = val;
          if (!this.isBreak) {
            this.timeRemaining = this.studyDuration * 60;
            this.totalSeconds = this.studyDuration * 60;
            this._updateDisplay();
          }
          this._saveSettings();
        }
      });
    }

    if (this.els.breakInput) {
      this.els.breakInput.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (val > 0 && val <= 60) {
          this.breakDuration = val;
          this._saveSettings();
        }
      });
    }
  }

  _saveSettings() {
    const settings = storage.loadJSON('settings');
    settings.studyDuration = this.studyDuration;
    settings.breakDuration = this.breakDuration;
    storage.saveJSON('settings', settings);
  }

  _restoreState() {
    const raw = sessionStorage.getItem('elsa_timerState');
    if (!raw) return;
    const state = JSON.parse(raw);
    if (state.date !== utils.getCurrentDate()) {
      sessionStorage.removeItem('elsa_timerState');
      return;
    }

    this.timeRemaining = state.timeRemaining;
    this.totalSeconds = state.totalSeconds;
    this.isActive = state.isActive;
    this.isBreak = state.isBreak;
    this.sessionCount = state.sessionCount;
    this.startTime = state.startTime;
    this.studyStartTime = state.studyStartTime;

    this._updateDisplay();
    this._updateUI();

    if (this.isActive) {
      this._startInterval();
    }
  }

  _saveState() {
    sessionStorage.setItem('elsa_timerState', JSON.stringify({
      timeRemaining: this.timeRemaining,
      totalSeconds: this.totalSeconds,
      isActive: this.isActive,
      isBreak: this.isBreak,
      sessionCount: this.sessionCount,
      startTime: this.startTime,
      studyStartTime: this.studyStartTime,
      date: utils.getCurrentDate()
    }));
  }

  start() {
    const studying = sessionStorage.getItem('elsa_currentlyStudying');
    if (!studying || !JSON.parse(studying).goal) {
      utils.showToast('Select what to study first (click "Start Studying")', 'warning');
      return;
    }

    this.isActive = true;
    if (!this.startTime) this.startTime = new Date().toISOString();
    if (!this.isBreak && !this.studyStartTime) this.studyStartTime = new Date().toISOString();

    this._startInterval();
    this._saveState();
    this._updateUI();
  }

  pause() {
    this.isActive = false;
    this._stopInterval();

    // Save elapsed study time
    if (!this.isBreak && this.studyStartTime) {
      const elapsed = Math.floor((Date.now() - new Date(this.studyStartTime).getTime()) / 60000);
      this.elapsedStudyMinutes += elapsed;
      this.studyStartTime = null;
    }

    this._saveState();
    storage.saveCurrentSession();
    this._updateUI();
  }

  reset() {
    const wasStudying = !this.isBreak;
    this.pause();
    this.isBreak = false;
    this.timeRemaining = this.studyDuration * 60;
    this.totalSeconds = this.studyDuration * 60;
    this.startTime = null;
    this.studyStartTime = null;
    this.elapsedStudyMinutes = 0;
    sessionStorage.removeItem('elsa_timerState');
    this._updateDisplay();
    this._updateUI();
  }

  _startInterval() {
    this._stopInterval();
    this.intervalId = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
        this._updateDisplay();
        this._saveState();
      } else {
        this._onComplete();
      }
    }, 1000);
  }

  _stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  _onComplete() {
    this._stopInterval();

    const settings = storage.loadJSON('settings');
    if (settings.preferences?.soundEnabled !== false) {
      audio.playChime();
    }

    if (!this.isBreak) {
      // Study session done
      this.sessionCount++;
      const studiedMinutes = this.studyDuration + Math.round((this.elapsedStudyMinutes));
      storage.completeSession(this.studyDuration);
      this.elapsedStudyMinutes = 0;

      // Notify
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('ELSA — Study Complete! 🎉', {
          body: `You studied for ${this.studyDuration} minutes. Time for a break!`
        });
      }
      utils.showToast(`Study session complete! Take a ${this.breakDuration}m break. 🎉`, 'success', 5000);

      // Update dashboard chart
      if (typeof dashboard !== 'undefined') {
        dashboard.loadDailyChart();
        dashboard.loadTodoWidget();
      }

      // Switch to break
      this.isBreak = true;
      this.timeRemaining = this.breakDuration * 60;
      this.totalSeconds = this.breakDuration * 60;
      this.studyStartTime = null;
    } else {
      // Break done
      this.isBreak = false;
      this.timeRemaining = this.studyDuration * 60;
      this.totalSeconds = this.studyDuration * 60;
      utils.showToast('Break over! Ready for another session?', 'info', 4000);
    }

    this.isActive = false;
    this.startTime = null;
    this._saveState();
    this._updateDisplay();
    this._updateUI();

    // Update session dots
    this._updateDots();
  }

  _updateDisplay() {
    if (!this.els.display) return;
    const m = Math.floor(this.timeRemaining / 60);
    const s = this.timeRemaining % 60;
    const display = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    this.els.display.textContent = display;

    if (this.els.mode) {
      this.els.mode.textContent = this.isBreak ? 'BREAK TIME' : 'STUDY SESSION';
    }

    // Update title
    document.title = this.isActive ? `${display} — ELSA` : 'Dashboard — ELSA';

    // Update ring
    this._updateRing();
  }

  _updateRing() {
    if (!this.els.ring) return;
    const circumference = 2 * Math.PI * 110; // r=110
    const progress = 1 - (this.timeRemaining / this.totalSeconds);
    const offset = circumference - (progress * circumference);
    this.els.ring.style.strokeDasharray = circumference;
    this.els.ring.style.strokeDashoffset = offset;

    if (this.isBreak) {
      this.els.ring.classList.add('break-mode');
    } else {
      this.els.ring.classList.remove('break-mode');
    }
  }

  _updateUI() {
    if (this.els.start) this.els.start.style.display = this.isActive ? 'none' : 'flex';
    if (this.els.pause) this.els.pause.style.display = this.isActive ? 'flex' : 'none';
  }

  _updateDots() {
    if (!this.els.dots.length) return;
    this.els.dots.forEach((dot, i) => {
      dot.classList.toggle('done', i < (this.sessionCount % 4));
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('timer-display')) {
    window.timer = new PomodoroTimer();
  }
});

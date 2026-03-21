// ===== ELSA Storage Manager =====
class StorageManager {
  constructor() {
    this.prefix = CONFIG.STORAGE_PREFIX;
    this.currentUser = null;
    this._autoSaveTimer = null;
  }

  init(username) {
    this.currentUser = username;
    this._startAutoSave();
  }

  // ===== USER MANIFEST =====
  getAllUsers() {
    const raw = localStorage.getItem(`${this.prefix}users-manifest`);
    return raw ? JSON.parse(raw) : [];
  }

  userExists(username) {
    return this.getAllUsers().some(u => u.username.toLowerCase() === username.toLowerCase());
  }

  addUserToManifest(userData) {
    const users = this.getAllUsers();
    if (!this.userExists(userData.username)) {
      users.push(userData);
      localStorage.setItem(`${this.prefix}users-manifest`, JSON.stringify(users));
    }
  }

  updateUserInManifest(username, updates) {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem(`${this.prefix}users-manifest`, JSON.stringify(users));
    }
  }

  removeUserFromManifest(username) {
    const users = this.getAllUsers().filter(u => u.username !== username);
    localStorage.setItem(`${this.prefix}users-manifest`, JSON.stringify(users));
  }

  // ===== DATA ACCESS (current user) =====
  _key(filename) {
    return `${this.prefix}${this.currentUser}_${filename}`;
  }

  saveJSON(filename, data) {
    if (!this.currentUser) return;
    const withMeta = { ...data, _lastModified: new Date().toISOString(), _version: CONFIG.APP_VERSION };
    localStorage.setItem(this._key(filename), JSON.stringify(withMeta));
  }

  loadJSON(filename) {
    if (!this.currentUser) return this._getDefault(filename);
    const raw = localStorage.getItem(this._key(filename));
    return raw ? JSON.parse(raw) : this._getDefault(filename);
  }

  // Load for ANY user (used in profile checks)
  loadJSONForUser(username, filename) {
    const key = `${this.prefix}${username}_${filename}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : this._getDefault(filename);
  }

  saveJSONForUser(username, filename, data) {
    const key = `${this.prefix}${username}_${filename}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  deleteAllUserData(username) {
    const keysToDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${this.prefix}${username}_`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(k => localStorage.removeItem(k));
    this.removeUserFromManifest(username);
  }

  // ===== DEFAULT DATA STRUCTURES =====
  _getDefault(filename) {
    const defaults = {
      'profile': {
        username: this.currentUser || '',
        created: new Date().toISOString(),
        lastLogin: null,
        hasPassword: false,
        passwordHash: null,
        totalStudyMinutes: 0,
        totalSessions: 0,
        avatar: null
      },
      'settings': {
        targets: { dailyMin: 5, dailyMax: 10 },
        preferences: { soundEnabled: true, timerSound: 'beep', notifications: false },
        appearance: { theme: 'default', font: 'default' },
        studyDuration: CONFIG.DEFAULT_STUDY_DURATION,
        breakDuration: CONFIG.DEFAULT_BREAK_DURATION,
        updatedAt: new Date().toISOString()
      },
      'goals': { goals: [], updatedAt: new Date().toISOString() },
      'subjects': { subjects: [], updatedAt: new Date().toISOString() },
      'topics': { topics: [], updatedAt: new Date().toISOString() },
      'study-data': { sessions: [], lastUpdated: new Date().toISOString() },
      'study-flow': { flows: [], updatedAt: new Date().toISOString() },
      'todo': { todos: [], lastCleanup: new Date().toISOString() }
    };
    return defaults[filename] || {};
  }

  // ===== SESSION MANAGEMENT =====
  saveCurrentSession() {
    const timerStateRaw = sessionStorage.getItem('elsa_timerState');
    const studyingRaw = sessionStorage.getItem('elsa_currentlyStudying');
    if (!timerStateRaw || !studyingRaw) return;

    const timerState = JSON.parse(timerStateRaw);
    const studying = JSON.parse(studyingRaw);
    if (!timerState.isActive || !studying.goal) return;

    const studyData = this.loadJSON('study-data');
    const sessionId = sessionStorage.getItem('elsa_currentSessionId');

    let session = sessionId ? studyData.sessions.find(s => s.id === sessionId) : null;
    const elapsed = Math.floor((Date.now() - new Date(timerState.startTime).getTime()) / 60000);

    if (!session) {
      session = {
        id: utils.generateUUID(),
        date: utils.getCurrentDate(),
        startTime: timerState.startTime || new Date().toISOString(),
        endTime: null,
        duration: elapsed,
        goal: studying.goal,
        subject: studying.subject,
        topic: studying.topic || null,
        completed: false
      };
      studyData.sessions.push(session);
      sessionStorage.setItem('elsa_currentSessionId', session.id);
    } else {
      session.duration = elapsed;
      session.lastUpdated = new Date().toISOString();
    }

    this.saveJSON('study-data', studyData);
  }

  completeSession(duration) {
    const studyingRaw = sessionStorage.getItem('elsa_currentlyStudying');
    const timerStateRaw = sessionStorage.getItem('elsa_timerState');
    if (!studyingRaw || !timerStateRaw) return;

    const studying = JSON.parse(studyingRaw);
    const timerState = JSON.parse(timerStateRaw);
    if (!studying.goal) return;

    const studyData = this.loadJSON('study-data');
    const sessionId = sessionStorage.getItem('elsa_currentSessionId');
    const session = sessionId ? studyData.sessions.find(s => s.id === sessionId) : null;

    if (session) {
      session.duration = duration || session.duration;
      session.completed = true;
      session.endTime = new Date().toISOString();
    } else {
      studyData.sessions.push({
        id: utils.generateUUID(),
        date: utils.getCurrentDate(),
        startTime: timerState.startTime || new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: duration || 0,
        goal: studying.goal,
        subject: studying.subject,
        topic: studying.topic || null,
        completed: true
      });
    }

    // Update profile stats
    const profile = this.loadJSON('profile');
    profile.totalStudyMinutes = (profile.totalStudyMinutes || 0) + (duration || 0);
    profile.totalSessions = (profile.totalSessions || 0) + 1;
    this.saveJSON('profile', profile);
    this.saveJSON('study-data', studyData);

    sessionStorage.removeItem('elsa_currentSessionId');
  }

  // ===== EXPORT / IMPORT =====
  exportAllData() {
    const files = ['profile', 'settings', 'goals', 'subjects', 'topics', 'study-data', 'study-flow', 'todo'];
    const exportData = {
      username: this.currentUser,
      exportDate: new Date().toISOString(),
      version: CONFIG.APP_VERSION,
      data: {}
    };
    files.forEach(f => { exportData.data[f] = this.loadJSON(f); });
    return exportData;
  }

  importAllData(exportData) {
    if (!exportData || !exportData.data) throw new Error('Invalid backup file');
    Object.entries(exportData.data).forEach(([filename, data]) => {
      this.saveJSON(filename, data);
    });
  }

  // ===== AUTO SAVE =====
  _startAutoSave() {
    this._autoSaveTimer = setInterval(() => {
      const timerState = sessionStorage.getItem('elsa_timerState');
      if (timerState && JSON.parse(timerState).isActive) {
        this.saveCurrentSession();
      }
    }, CONFIG.AUTO_SAVE_INTERVAL);
  }

  stopAutoSave() {
    if (this._autoSaveTimer) {
      clearInterval(this._autoSaveTimer);
      this._autoSaveTimer = null;
    }
  }
}

window.storage = new StorageManager();

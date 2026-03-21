// ===== ELSA Utility Functions =====
class Utils {
  // Generate UUID
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Get current date YYYY-MM-DD
  getCurrentDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  }

  // Get current time HH:MM:SS
  getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
  }

  // Get day of year 1-366
  getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / (1000*60*60*24));
  }

  // Format minutes to "Xh Ym"
  formatDuration(minutes) {
    const m = Math.round(minutes);
    const hrs = Math.floor(m / 60);
    const mins = m % 60;
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  }

  // Format minutes to decimal hours
  formatDurationDecimal(minutes) {
    return (minutes / 60).toFixed(2);
  }

  // Format date for display
  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  // Format datetime
  formatDateTime(isoStr) {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  // Get greeting based on time
  getGreeting(name) {
    const h = new Date().getHours();
    let g = h >= 5 && h < 12 ? 'Good Morning' :
            h >= 12 && h < 17 ? 'Good Afternoon' :
            h >= 17 && h < 21 ? 'Good Evening' : 'Good Night';
    return name ? `${g}, ${name}! 👋` : g;
  }

  // Get day name from date string
  getDayName(dateStr) {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return days[new Date(dateStr + 'T00:00:00').getDay()];
  }

  // Get dates for last N days
  getLastNDays(n) {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
    }
    return dates;
  }

  // Validate username
  validateUsername(username) {
    if (!username || username.trim().length < CONFIG.MIN_USERNAME_LENGTH) return `Min ${CONFIG.MIN_USERNAME_LENGTH} characters`;
    if (username.trim().length > CONFIG.MAX_USERNAME_LENGTH) return `Max ${CONFIG.MAX_USERNAME_LENGTH} characters`;
    if (!/^[a-zA-Z0-9 ]+$/.test(username)) return 'Letters and numbers only';
    return null;
  }

  // Validate password
  validatePassword(password) {
    if (!password || password.length < CONFIG.MIN_PASSWORD_LENGTH) return `Min ${CONFIG.MIN_PASSWORD_LENGTH} characters`;
    return null;
  }

  // Debounce
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Download file
  downloadFile(filename, content, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Show toast notification
  showToast(message, type = 'success', duration = 3000) {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || '✓'}</span> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutToast 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Confirm dialog (returns promise)
  confirm(message) {
    return new Promise(resolve => {
      resolve(window.confirm(message));
    });
  }

  // Generate gradient from string (consistent)
  generateGradient(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % CONFIG.COLORS.length;
    return `linear-gradient(135deg, ${CONFIG.COLORS[colorIndex][0]}, ${CONFIG.COLORS[colorIndex][1]})`;
  }

  // Capitalize first letter
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Truncate text
  truncate(str, max = 40) {
    if (!str || str.length <= max) return str;
    return str.slice(0, max) + '...';
  }

  // Check if date is today
  isToday(dateStr) {
    return dateStr === this.getCurrentDate();
  }

  // Check if date is past
  isPast(dateStr) {
    return dateStr < this.getCurrentDate();
  }

  // Get week number
  getWeekNumber(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const onejan = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  }

  // Get month name
  getMonthName(monthNum) {
    return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][monthNum];
  }

  // Parse CSV-safe string
  csvEscape(str) {
    if (!str) return '';
    if (str.toString().includes(',') || str.toString().includes('"') || str.toString().includes('\n')) {
      return `"${str.toString().replace(/"/g, '""')}"`;
    }
    return str.toString();
  }

  // HTML-escape a string
  htmlEscape(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Validate password strength
  validatePassword(pw) {
    if (!pw) return 'Password cannot be empty';
    if (pw.length < 4) return 'Password must be at least 4 characters';
    return null; // valid
  }

  // Debounce helper
  debounce(fn, delay) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }
}

window.utils = new Utils();

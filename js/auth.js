// ===== ELSA Authentication =====
class Auth {
  // Simple hash (FNV-1a inspired, good enough for offline app)
  hashPassword(password) {
    let hash = 2166136261;
    const salt = 'ELSA_SALT_2024';
    const str = password + salt;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * 16777619) >>> 0;
    }
    return hash.toString(16).padStart(8, '0') + str.length.toString(16);
  }

  // Verify password
  verifyPassword(password, storedHash) {
    if (!storedHash) return true; // No password set
    return this.hashPassword(password) === storedHash;
  }

  // Get current logged-in user
  getCurrentUser() {
    return sessionStorage.getItem('elsa_currentUser') || null;
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getCurrentUser();
  }

  // Login
  login(username) {
    sessionStorage.setItem('elsa_currentUser', username);
    sessionStorage.setItem('elsa_loginTime', Date.now().toString());
  }

  // Logout
  logout() {
    const keys = ['elsa_currentUser', 'elsa_loginTime', 'elsa_timerState', 'elsa_currentlyStudying'];
    keys.forEach(k => sessionStorage.removeItem(k));
    window.location.href = CONFIG.PAGES.LOGIN;
  }

  // Guard: redirect to login if not authenticated
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = CONFIG.PAGES.LOGIN;
      return false;
    }
    return true;
  }
}

window.auth = new Auth();

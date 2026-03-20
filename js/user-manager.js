// ===== ELSA User Manager =====
class UserManager {
  createUser(username) {
    const trimmed = username.trim();
    const error = utils.validateUsername(trimmed);
    if (error) throw new Error(error);
    if (storage.userExists(trimmed)) throw new Error('User already exists');

    // Initialize all data files
    const tempUser = this.currentUser;
    storage.currentUser = trimmed;

    const profile = {
      username: trimmed,
      created: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      hasPassword: false,
      passwordHash: null,
      totalStudyMinutes: 0,
      totalSessions: 0
    };
    storage.saveJSON('profile', profile);
    storage.saveJSON('settings', storage._getDefault('settings'));
    storage.saveJSON('goals', storage._getDefault('goals'));
    storage.saveJSON('subjects', storage._getDefault('subjects'));
    storage.saveJSON('topics', storage._getDefault('topics'));
    storage.saveJSON('study-data', storage._getDefault('study-data'));
    storage.saveJSON('study-flow', storage._getDefault('study-flow'));
    storage.saveJSON('todo', storage._getDefault('todo'));

    storage.currentUser = tempUser;

    // Add to manifest
    storage.addUserToManifest({
      username: trimmed,
      created: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      hasPassword: false
    });

    return trimmed;
  }

  deleteUser(username) {
    storage.deleteAllUserData(username);
  }

  renameUser(oldName, newName) {
    const trimmed = newName.trim();
    const error = utils.validateUsername(trimmed);
    if (error) throw new Error(error);
    if (storage.userExists(trimmed)) throw new Error('Username already taken');

    // Copy all data to new key
    const files = ['profile','settings','goals','subjects','topics','study-data','study-flow','todo'];
    files.forEach(f => {
      const data = storage.loadJSONForUser(oldName, f);
      storage.saveJSONForUser(trimmed, f, data);
    });

    // Update profile username
    const profile = storage.loadJSONForUser(trimmed, 'profile');
    profile.username = trimmed;
    storage.saveJSONForUser(trimmed, 'profile', profile);

    // Delete old keys
    storage.deleteAllUserData(oldName);

    // Re-add manifest with new name
    storage.addUserToManifest({
      username: trimmed,
      created: profile.created,
      lastLogin: new Date().toISOString(),
      hasPassword: profile.hasPassword || false
    });
  }

  setPassword(username, password) {
    const profile = storage.loadJSONForUser(username, 'profile');
    profile.hasPassword = true;
    profile.passwordHash = auth.hashPassword(password);
    storage.saveJSONForUser(username, 'profile', profile);
    storage.updateUserInManifest(username, { hasPassword: true });
  }

  removePassword(username) {
    const profile = storage.loadJSONForUser(username, 'profile');
    profile.hasPassword = false;
    profile.passwordHash = null;
    storage.saveJSONForUser(username, 'profile', profile);
    storage.updateUserInManifest(username, { hasPassword: false });
  }

  updateLastLogin(username) {
    const profile = storage.loadJSONForUser(username, 'profile');
    profile.lastLogin = new Date().toISOString();
    storage.saveJSONForUser(username, 'profile', profile);
    storage.updateUserInManifest(username, { lastLogin: new Date().toISOString() });
  }
}

window.userManager = new UserManager();

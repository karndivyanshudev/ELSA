// ===== ELSA Configuration =====
const CONFIG = {
  APP_NAME: 'ELSA',
  APP_VERSION: '1.0.0',
  APP_FULL_NAME: 'Elite Learning & Study Agent',
  STORAGE_PREFIX: 'elsa_',
  SESSION_KEY: 'elsa_session',
  DEFAULT_STUDY_DURATION: 25,
  DEFAULT_BREAK_DURATION: 5,
  POMODORO_CYCLES: 4,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  MAX_USERNAME_LENGTH: 20,
  MIN_USERNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 4,
  PAGES: {
    LOGIN: 'index.html',
    DASHBOARD: 'dashboard.html',
    SUBJECTS: 'subjects.html',
    STUDY_FLOW: 'study-flow.html',
    ANALYTICS: 'analytics.html',
    TODO: 'todo.html',
    SETTINGS: 'settings.html'
  },
  PRESET_GOALS: ['JEE', 'NEET', 'UPSC', 'CAT', 'Board Exams', 'Custom'],
  COLORS: [
    ['#2563EB', '#3B82F6'],
    ['#7C3AED', '#8B5CF6'],
    ['#10B981', '#34D399'],
    ['#F59E0B', '#FBBF24'],
    ['#EF4444', '#F87171'],
    ['#06B6D4', '#22D3EE'],
    ['#EC4899', '#F472B6'],
    ['#6366F1', '#818CF8'],
  ]
};

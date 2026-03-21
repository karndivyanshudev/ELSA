© 2025 Divyanshu Karn — All Rights Reserved
Licensed under CC BY-NC-ND 4.0
https://creativecommons.org/licenses/by-nc-nd/4.0/

This project may NOT be modified, redistributed, republished, 
or claimed as your own work. Personal use only.
╔══════════════════════════════════════════════════════════════╗
║          ELSA — Elite Learning & Study Agent v1.0            ║
║              Offline Study Management Application             ║
╚══════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 QUICK START
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open index.html in your browser (Chrome / Firefox / Edge / Safari)
2. Watch the 3.5-second intro animation
3. Click "Add User" (+) to create your profile
4. Start studying!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Multi-user support (each user has private data)
• Password protection per user (optional)
• Pomodoro timer with auto study/break switching
• Currently Studying tracker (Goal → Subject → Topic)
• Subjects page: organize Goals → Subjects → Topics
• Study Flow table: log problems & solutions
• Analytics: daily/weekly/monthly charts + session log
• To-Do List with calendar (future dates only)
• Focus noise generator (Brown / Pink / White noise)
• Daily motivational quote
• CSV & JSON export/import
• Fully offline — no internet needed after first load

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 HOW TO USE — STEP BY STEP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Create your profile
   → Click the + circle on the login screen
   → Type your name (letters/numbers, 3-20 chars)
   → You're in!

Step 2: Set up your Goals & Subjects
   → Go to Subjects page
   → Add a goal (JEE, NEET, etc.)
   → Add subjects under each goal (Physics, Chemistry…)
   → Expand subjects to add topics (Kinematics, Thermodynamics…)

Step 3: Study with the timer
   → On Dashboard, click "Start Studying"
   → Select Goal → Subject → Topic
   → Click "Begin Session"
   → Start the Pomodoro timer
   → Timer auto-switches study/break and logs your time

Step 4: Track your progress
   → Analytics page: view daily/weekly/monthly charts
   → Study Flow page: log difficult problems & solutions
   → To-Do List: plan tasks for each day

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 LOGIN SCREEN TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Left-click a user circle to log in
• Right-click a user circle to:
  - Set / Change Password
  - Remove Password
  - Change Name
  - Delete User

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ANALYTICS COLOR CODING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  RED bar   = Below your minimum daily target
  GREEN bar = Within your target range (min to max)
  BLUE bar  = Exceeded your maximum target

Set your targets in Settings → Study Targets

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 DATA & BACKUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All data is stored in your browser's localStorage.
Keys are prefixed: elsa_[username]_[filename]

To back up your data:
  → Settings → Backup & Restore → Download Backup
  → Saves a JSON file to your computer

To restore:
  → Settings → Backup & Restore → Restore Backup
  → Upload your saved JSON file

To export study log:
  → Settings → Export CSV (for Excel/Google Sheets)
  → Analytics page → Export CSV

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ADDING CUSTOM QUOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Edit assets/quotes.txt
Format: NUMBER|QUOTE TEXT|AUTHOR NAME
Example: 121|Work hard in silence, let success make the noise.|Frank Ocean

One quote per line. The daily quote rotates based on day of year.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BROWSER COMPATIBILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recommended: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
Requires JavaScript enabled
No internet required (Google Fonts loads on first visit only)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sounds don't play?
  → Click anywhere on the page first (browser policy requires
    user interaction before playing audio)

Charts look blank?
  → Open browser Developer Tools (F12) → check Console for errors
  → Make sure all .js files loaded correctly

Login doesn't redirect?
  → Make sure all files are in the same folder
  → Open via file:// or a local server (not copy-paste URL)

Data disappeared?
  → Check if browser cleared localStorage
  → Always keep a JSON backup via Settings → Download Backup

Timer not working?
  → Select "Start Studying" first before pressing Start
  → Timer only records data when a session is active

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FILE STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ELSA-Project/
├── index.html          Login screen + intro animation
├── dashboard.html      Main study hub + timer
├── subjects.html       Goals/Subjects/Topics manager
├── study-flow.html     Problem-solution journal
├── analytics.html      Charts and session history
├── todo.html           Daily task planner with calendar
├── settings.html       Profile, targets, backup
├── css/                Stylesheets
├── js/                 JavaScript modules
├── assets/
│   └── quotes.txt      Motivational quotes database
└── README.txt          This file

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 VERSION HISTORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

v1.0.0 — Initial release
  • Full offline study management
  • Multi-user with password protection
  • Pomodoro timer + session logging
  • Analytics with bar/pie/line charts
  • Study Flow journal
  • Calendar-based To-Do list
  • JSON backup/restore + CSV export

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Happy Studying! 📚
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/* ════════════════════════════════════════════════════════
   ELSA — THEME & FONT MANAGER
   Handles persistence + application of themes and fonts.
   Include this after storage.js on every page.
════════════════════════════════════════════════════════ */

const ELSA_FONT_MAP = {
  'default':   { family: "'DM Sans', sans-serif",              heading: "'Space Grotesk', sans-serif",          mono: "'JetBrains Mono', monospace" },
  'modern':    { family: "'Outfit', sans-serif",               heading: "'Outfit', sans-serif",                 mono: "'JetBrains Mono', monospace" },
  'grotesque': { family: "'Bricolage Grotesque', sans-serif",  heading: "'Bricolage Grotesque', sans-serif",    mono: "'JetBrains Mono', monospace" },
  'techy':     { family: "'Space Grotesk', sans-serif",        heading: "'Space Grotesk', sans-serif",          mono: "'JetBrains Mono', monospace" },
  'editorial': { family: "'Lora', serif",                      heading: "'Playfair Display', serif",            mono: "'JetBrains Mono', monospace" },
  'literary':  { family: "'Libre Baskerville', serif",         heading: "'Fraunces', serif",                   mono: "'JetBrains Mono', monospace" },
  'classic':   { family: "'Lora', serif",                      heading: "'Libre Baskerville', serif",          mono: "'JetBrains Mono', monospace" },
  'terminal':  { family: "'JetBrains Mono', monospace",        heading: "'JetBrains Mono', monospace",         mono: "'JetBrains Mono', monospace" },
};

const ELSA_THEMES = [
  // Dark themes
  { id: 'cosmos',    label: 'Cosmos',              swatch: '#6366f1' },
  { id: 'ocean',     label: 'Ocean',               swatch: '#06b6d4' },
  { id: 'aurora',    label: 'Aurora',              swatch: '#22d3ee' },
  { id: 'sunset',    label: 'Sunset',              swatch: '#f97316' },
  { id: 'crimson',   label: 'Crimson',             swatch: '#e11d48' },
  { id: 'gold',      label: 'Gold Luxe',           swatch: '#d4a017' },
  { id: 'forest',    label: 'Forest',              swatch: '#4ade80' },
  { id: 'supernova', label: 'Supernova',           swatch: 'linear-gradient(135deg,#ff2de0,#ff6b1a)' },
  { id: 'wukong',    label: 'Black Myth Wukong',   swatch: 'linear-gradient(135deg,#c8942a,#3a9e60)' },
  { id: 'greenhell', label: 'Green Hell',          swatch: '#6bc424' },
  // Light themes
  { id: 'arctic',    label: 'Arctic',              swatch: '#0ea5e9' },
  { id: 'bio',       label: 'Bio Garden',          swatch: '#f59e0b' },
  { id: 'sakura',    label: 'Sakura',              swatch: '#f43f5e' },
  { id: 'mint',      label: 'Mint',                swatch: '#059669' },
  { id: 'lavender',  label: 'Lavender',            swatch: '#7c3aed' },
  { id: 'peach',     label: 'Peach',               swatch: '#ea580c' },
  { id: 'candy',     label: 'Candy',               swatch: '#d946ef' },
  { id: 'slate',     label: 'Slate',               swatch: '#475569' },
  { id: 'lab',       label: 'Lab',                 swatch: '#ffff00' },
  // OS / Game
  { id: 'win11light',label: 'Win11 Light',         swatch: 'linear-gradient(135deg,#0078d4,#e9f3fb)' },
  { id: 'win11dark', label: 'Win11 Dark',          swatch: 'linear-gradient(135deg,#202020,#60cdff)' },
  { id: 'cyberpunk', label: 'Cyberpunk 2077',      swatch: 'linear-gradient(135deg,#0a0a0f,#f9e400)' },
  { id: 'codmw',     label: 'CoD Modern Warfare',  swatch: 'linear-gradient(135deg,#080a06,#8db840)' },
  { id: 'blackops',  label: 'CoD Black Ops 4',     swatch: 'linear-gradient(135deg,#040608,#00b4d8)' },
  { id: 'redsec',    label: 'Battlefield RedSec',  swatch: 'linear-gradient(135deg,#060404,#cc1a1a)' },
  { id: 'gta6',      label: 'GTA 6',               swatch: 'linear-gradient(135deg,#07050f,#ff1e8c,#00e5cc)' },
  { id: 'archlinux', label: 'Arch Linux',          swatch: 'linear-gradient(135deg,#000000,#1793d1)' },
];

const themeManager = {
  // Apply a theme name to the <html> element
  apply(themeName) {
    document.documentElement.setAttribute('data-elsa-theme', themeName || 'default');
    // Win11 themes get system fonts overriding any font choice
    if (themeName === 'win11light' || themeName === 'win11dark') {
      document.documentElement.style.setProperty('--font-family', "'Segoe UI Variable','Segoe UI',sans-serif");
      document.documentElement.style.setProperty('--font-heading', "'Segoe UI Variable','Segoe UI',sans-serif");
      document.documentElement.style.setProperty('--font-mono', "'Cascadia Code','Consolas',monospace");
    }
  },

  // Apply a font name
  applyFont(fontName) {
    const f = ELSA_FONT_MAP[fontName] || ELSA_FONT_MAP['default'];
    const root = document.documentElement;
    root.style.setProperty('--font-family', f.family);
    root.style.setProperty('--font-heading', f.heading);
    root.style.setProperty('--font-mono', f.mono);
  },

  // Load & apply saved theme+font from storage
  loadAndApply() {
    const username = auth.getCurrentUser();
    if (!username) return;
    const settings = storage.loadJSON('settings');
    const theme = settings.appearance?.theme || 'default';
    const font = settings.appearance?.font || 'default';
    this.apply(theme);
    this.applyFont(font);
  },

  // Save theme to settings
  saveTheme(themeName) {
    const settings = storage.loadJSON('settings');
    if (!settings.appearance) settings.appearance = {};
    settings.appearance.theme = themeName;
    storage.saveJSON('settings', settings);
    this.apply(themeName);
  },

  // Save font to settings
  saveFont(fontName) {
    const settings = storage.loadJSON('settings');
    if (!settings.appearance) settings.appearance = {};
    settings.appearance.font = fontName;
    storage.saveJSON('settings', settings);
    this.applyFont(fontName);
  },

  // Build the theme picker HTML
  buildThemePicker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const settings = storage.loadJSON('settings');
    const currentTheme = settings.appearance?.theme || 'default';
    container.innerHTML = ELSA_THEMES.map(t => {
      const swatchStyle = t.swatch.startsWith('linear-gradient') || t.swatch.startsWith('#')
        ? `background:${t.swatch};` : `background:${t.swatch};`;
      return `<button class="theme-pill ${t.id === currentTheme ? 'active' : ''}" onclick="themeManager._setTheme('${t.id}', this)">
        <span class="theme-swatch" style="${swatchStyle}"></span>${t.label}
      </button>`;
    }).join('');
  },

  _setTheme(id, el) {
    this.saveTheme(id);
    document.querySelectorAll('.theme-pill').forEach(p => p.classList.remove('active'));
    if (el) el.classList.add('active');
    utils.showToast(`Theme: ${id} ✓`, 'success');
  },

  // Build the font picker HTML
  buildFontPicker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const settings = storage.loadJSON('settings');
    const currentFont = settings.appearance?.font || 'default';
    const fonts = [
      { id: 'default',   label: 'Space Grotesk + DM Sans',        preview: 'Space Grotesk',         tag: 'Default',    ff: "'Space Grotesk', sans-serif" },
      { id: 'modern',    label: 'Outfit',                          preview: 'Outfit',                 tag: 'Modern',     ff: "'Outfit', sans-serif" },
      { id: 'grotesque', label: 'Bricolage Grotesque',             preview: 'Bricolage Grotesque',    tag: 'Expressive', ff: "'Bricolage Grotesque', sans-serif" },
      { id: 'techy',     label: 'Space Grotesk (all)',             preview: 'Space Grotesk',          tag: 'Techy',      ff: "'Space Grotesk', sans-serif" },
      { id: 'editorial', label: 'Playfair Display + Lora',         preview: 'Playfair Display',       tag: 'Editorial',  ff: "'Playfair Display', serif" },
      { id: 'literary',  label: 'Fraunces + Libre Baskerville',    preview: 'Fraunces',               tag: 'Literary',   ff: "'Fraunces', serif" },
      { id: 'classic',   label: 'Libre Baskerville + Lora',        preview: 'Libre Baskerville',      tag: 'Classic',    ff: "'Libre Baskerville', serif" },
      { id: 'terminal',  label: 'JetBrains Mono',                  preview: 'JetBrains Mono',         tag: 'Terminal',   ff: "'JetBrains Mono', monospace" },
    ];
    container.innerHTML = fonts.map(f => `
      <div class="font-option ${f.id === currentFont ? 'active' : ''}" onclick="themeManager._setFont('${f.id}', this)">
        <div class="font-option-preview" style="font-family:${f.ff};">${f.label}</div>
        <div class="font-option-tag">${f.tag}</div>
      </div>
    `).join('');
  },

  _setFont(id, el) {
    this.saveFont(id);
    document.querySelectorAll('.font-option').forEach(o => o.classList.remove('active'));
    if (el) el.classList.add('active');
    utils.showToast('Font updated ✓', 'success');
  }
};

// NOTE: Pages call themeManager.loadAndApply() themselves after storage.init().
// This stub is intentionally left empty — no auto-apply on DOMContentLoaded.

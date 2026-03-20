// ===== ELSA Quote Loader =====
class QuoteLoader {
  constructor() {
    this.fallbackQuotes = [
      { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "It does not matter how slowly you go, as long as you do not stop.", author: "Confucius" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
      { text: "You are never too old to set another goal or dream a new dream.", author: "C.S. Lewis" },
      { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
      { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
      { text: "What you get by achieving your goals is not as important as what you become.", author: "Henry David Thoreau" },
      { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    ];
  }

  async loadQuote() {
    try {
      const response = await fetch('assets/quotes.txt');
      if (!response.ok) throw new Error('Not found');
      const text = await response.text();
      const lines = text.trim().split('\n').filter(l => l.trim());
      if (!lines.length) throw new Error('Empty');

      const dayOfYear = utils.getDayOfYear();
      const index = dayOfYear % lines.length;
      const parts = lines[index].split('|');
      if (parts.length >= 3) {
        return { text: parts[1].trim(), author: parts[2].trim() };
      }
    } catch (e) {
      // Fallback
    }
    const dayOfYear = utils.getDayOfYear();
    return this.fallbackQuotes[dayOfYear % this.fallbackQuotes.length];
  }
}

window.quoteLoader = new QuoteLoader();

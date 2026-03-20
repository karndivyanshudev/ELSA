// ===== ELSA Analytics Engine =====
class AnalyticsEngine {
  // Get total minutes for a date range
  getStudyMinutesByDate(sessions, startDate, endDate) {
    return sessions
      .filter(s => s.completed && s.date >= startDate && s.date <= endDate)
      .reduce((sum, s) => sum + (s.duration || 0), 0);
  }

  // Get minutes per day for last N days
  getDailyData(sessions, days = 7) {
    const dates = utils.getLastNDays(days);
    return dates.map(date => {
      const dayMinutes = sessions
        .filter(s => s.completed && s.date === date)
        .reduce((sum, s) => sum + (s.duration || 0), 0);
      return {
        date,
        label: utils.getDayName(date),
        hours: parseFloat((dayMinutes / 60).toFixed(2)),
        minutes: dayMinutes
      };
    });
  }

  // Get minutes per subject for a date range
  getSubjectBreakdown(sessions, startDate, endDate) {
    const map = {};
    sessions
      .filter(s => s.completed && s.date >= startDate && s.date <= endDate)
      .forEach(s => {
        const key = s.subject || 'Unknown';
        map[key] = (map[key] || 0) + (s.duration || 0);
      });
    return Object.entries(map)
      .map(([subject, minutes]) => ({ subject, minutes, hours: parseFloat((minutes/60).toFixed(2)) }))
      .sort((a, b) => b.minutes - a.minutes);
  }

  // Get minutes per goal for a date range
  getGoalBreakdown(sessions, startDate, endDate) {
    const map = {};
    sessions
      .filter(s => s.completed && s.date >= startDate && s.date <= endDate)
      .forEach(s => {
        const key = s.goal || 'Unknown';
        map[key] = (map[key] || 0) + (s.duration || 0);
      });
    return Object.entries(map)
      .map(([goal, minutes]) => ({ goal, minutes, hours: parseFloat((minutes/60).toFixed(2)) }))
      .sort((a, b) => b.minutes - a.minutes);
  }

  // Get weekly aggregate data (last N weeks)
  getWeeklyData(sessions, weeks = 8) {
    const result = [];
    for (let w = weeks - 1; w >= 0; w--) {
      const endD = new Date();
      endD.setDate(endD.getDate() - w * 7);
      const startD = new Date(endD);
      startD.setDate(startD.getDate() - 6);

      const start = utils.getCurrentDate.call({ getCurrentDate: () => {
        return `${startD.getFullYear()}-${String(startD.getMonth()+1).padStart(2,'0')}-${String(startD.getDate()).padStart(2,'0')}`;
      }});
      const end = utils.getCurrentDate.call({ getCurrentDate: () => {
        return `${endD.getFullYear()}-${String(endD.getMonth()+1).padStart(2,'0')}-${String(endD.getDate()).padStart(2,'0')}`;
      }});

      const startStr = `${startD.getFullYear()}-${String(startD.getMonth()+1).padStart(2,'0')}-${String(startD.getDate()).padStart(2,'0')}`;
      const endStr = `${endD.getFullYear()}-${String(endD.getMonth()+1).padStart(2,'0')}-${String(endD.getDate()).padStart(2,'0')}`;

      const minutes = this.getStudyMinutesByDate(sessions, startStr, endStr);
      result.push({
        label: `W${utils.getWeekNumber(startStr)}`,
        hours: parseFloat((minutes / 60).toFixed(2)),
        minutes
      });
    }
    return result;
  }

  // Get monthly data (last N months)
  getMonthlyData(sessions, months = 6) {
    const result = [];
    const now = new Date();
    for (let m = months - 1; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const startStr = `${year}-${String(month+1).padStart(2,'0')}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      const endStr = `${year}-${String(month+1).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`;

      const minutes = this.getStudyMinutesByDate(sessions, startStr, endStr);
      result.push({
        label: utils.getMonthName(month),
        hours: parseFloat((minutes / 60).toFixed(2)),
        minutes,
        startStr,
        endStr
      });
    }
    return result;
  }

  // Get streak (consecutive days studied)
  getCurrentStreak(sessions) {
    const studiedDates = new Set(
      sessions.filter(s => s.completed && s.duration >= 5).map(s => s.date)
    );

    let streak = 0;
    let d = new Date();
    while (true) {
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (studiedDates.has(dateStr)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  // Get best day (most study minutes)
  getBestDay(sessions) {
    const map = {};
    sessions.filter(s => s.completed).forEach(s => {
      map[s.date] = (map[s.date] || 0) + (s.duration || 0);
    });
    let best = { date: null, minutes: 0 };
    Object.entries(map).forEach(([date, minutes]) => {
      if (minutes > best.minutes) best = { date, minutes };
    });
    return best;
  }

  // Get average daily hours (last 30 days)
  getAverageDailyHours(sessions) {
    const dates = utils.getLastNDays(30);
    const total = dates.reduce((sum, date) => {
      return sum + sessions.filter(s => s.completed && s.date === date).reduce((s2, s) => s2 + (s.duration||0), 0);
    }, 0);
    return parseFloat((total / 60 / 30).toFixed(2));
  }

  // Export sessions to CSV
  exportToCSV(sessions, username) {
    const header = 'Date,Day,Goal,Subject,Topic,Duration (min),Duration (hrs),Start Time,End Time\n';
    const rows = sessions
      .filter(s => s.completed)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(s => [
        utils.csvEscape(s.date),
        utils.csvEscape(utils.getDayName(s.date)),
        utils.csvEscape(s.goal || ''),
        utils.csvEscape(s.subject || ''),
        utils.csvEscape(s.topic || ''),
        utils.csvEscape(s.duration || 0),
        utils.csvEscape(((s.duration || 0)/60).toFixed(2)),
        utils.csvEscape(s.startTime ? utils.formatDateTime(s.startTime) : ''),
        utils.csvEscape(s.endTime ? utils.formatDateTime(s.endTime) : '')
      ].join(','))
      .join('\n');

    return header + rows;
  }
}

window.analyticsEngine = new AnalyticsEngine();

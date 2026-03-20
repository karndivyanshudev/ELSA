// ===== ELSA Chart Manager =====
class ChartManager {
  constructor() {
    this._COLORS = [
      '#2563EB','#7C3AED','#10B981','#F59E0B','#EF4444',
      '#06B6D4','#EC4899','#6366F1','#84CC16','#F97316'
    ];
  }

  _getCtx(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    return { ctx: canvas.getContext('2d'), canvas };
  }

  // ===== DONUT / PIE CHART =====
  renderPieChart(canvasId, data, labels, colors) {
    const result = this._getCtx(canvasId);
    if (!result) return;
    const { ctx, canvas } = result;

    const total = data.reduce((s, v) => s + v, 0);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerR = Math.min(cx, cy) - 20;
    const innerR = outerR * 0.55;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (total === 0) {
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No data', cx, cy + 5);
      return;
    }

    let startAngle = -Math.PI / 2;
    data.forEach((value, i) => {
      if (value === 0) return;
      const slice = (value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = colors?.[i] || this._COLORS[i % this._COLORS.length];
      ctx.fill();
      startAngle += slice;
    });

    // Inner circle (donut hole)
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Center text
    const studyVal = data[0] || 0;
    const h = (studyVal / 60).toFixed(1);
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 22px Space Grotesk, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${h}h`, cx, cy - 4);
    ctx.fillStyle = '#64748B';
    ctx.font = '12px DM Sans, sans-serif';
    ctx.fillText('studied', cx, cy + 16);
  }

  // ===== BAR CHART =====
  renderBarChart(canvasId, dailyData, targetMin, targetMax) {
    // dailyData: [{date, label, hours}]
    const result = this._getCtx(canvasId);
    if (!result) return;
    const { ctx, canvas } = result;

    const padL = 50, padR = 20, padT = 20, padB = 50;
    const w = canvas.width - padL - padR;
    const h = canvas.height - padT - padB;
    const maxH = Math.max(targetMax + 4, ...(dailyData.map(d => d.hours)), 12);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const n = dailyData.length;
    const barW = Math.max(8, (w / n) * 0.55);
    const gap = w / n;

    // Grid lines
    const gridLines = [0, 2, 4, 6, 8, 10, 12, 14, 16];
    gridLines.forEach(val => {
      if (val > maxH) return;
      const y = padT + h - (val / maxH) * h;
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + w, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${val}h`, padL - 8, y + 3);
    });

    // Target band
    const yMax = padT + h - (targetMax / maxH) * h;
    const yMin = padT + h - (targetMin / maxH) * h;
    ctx.fillStyle = 'rgba(16,185,129,0.08)';
    ctx.fillRect(padL, yMax, w, yMin - yMax);

    // Target lines
    [targetMin, targetMax].forEach(v => {
      const y = padT + h - (v / maxH) * h;
      ctx.strokeStyle = 'rgba(16,185,129,0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + w, y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Bars
    dailyData.forEach((d, i) => {
      const x = padL + i * gap + (gap - barW) / 2;
      const barH = (d.hours / maxH) * h;
      const y = padT + h - barH;

      // Color coding
      let color;
      if (d.hours < targetMin) color = '#EF4444';
      else if (d.hours <= targetMax) color = '#10B981';
      else color = '#1D4ED8';

      // Bar with rounded top
      const r = Math.min(4, barW / 2);
      if (barH > 0) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barW - r, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
        ctx.lineTo(x + barW, padT + h);
        ctx.lineTo(x, padT + h);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.fillStyle = color;
        ctx.fill();
      }

      // Label
      ctx.fillStyle = '#64748B';
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label || d.date, x + barW / 2, padT + h + 18);

      // Value on top
      if (d.hours > 0) {
        ctx.fillStyle = color;
        ctx.font = 'bold 9px DM Sans, sans-serif';
        ctx.fillText(`${d.hours.toFixed(1)}h`, x + barW / 2, Math.max(y - 4, padT + 12));
      }
    });

    // Axes
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + h);
    ctx.lineTo(padL + w, padT + h);
    ctx.stroke();
  }

  // ===== LINE CHART =====
  renderLineChart(canvasId, datasets, labels) {
    // datasets: [{label, data: [numbers], color}]
    const result = this._getCtx(canvasId);
    if (!result) return;
    const { ctx, canvas } = result;

    const padL = 50, padR = 20, padT = 20, padB = 40;
    const w = canvas.width - padL - padR;
    const h = canvas.height - padT - padB;
    const allValues = datasets.flatMap(d => d.data);
    const maxVal = Math.max(...allValues, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    for (let i = 0; i <= 5; i++) {
      const val = (maxVal / 5) * i;
      const y = padT + h - (val / maxVal) * h;
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + w, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(1), padL - 6, y + 3);
    }

    const n = labels.length;
    const step = w / Math.max(n - 1, 1);

    datasets.forEach((dataset, di) => {
      const color = dataset.color || this._COLORS[di % this._COLORS.length];
      const pts = dataset.data.map((val, i) => ({
        x: padL + i * step,
        y: padT + h - (val / maxVal) * h
      }));

      // Area fill
      ctx.beginPath();
      ctx.moveTo(pts[0].x, padT + h);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length-1].x, padT + h);
      ctx.closePath();
      ctx.fillStyle = color + '18';
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Dots
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    // X labels
    labels.forEach((label, i) => {
      ctx.fillStyle = '#64748B';
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, padL + i * step, padT + h + 20);
    });

    // Axes
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + h);
    ctx.lineTo(padL + w, padT + h);
    ctx.stroke();
  }

  // ===== STACKED BAR (subject breakdown) =====
  renderStackedBar(canvasId, data, labels, subjectColors) {
    const result = this._getCtx(canvasId);
    if (!result) return;
    const { ctx, canvas } = result;

    const padL = 50, padR = 20, padT = 20, padB = 60;
    const w = canvas.width - padL - padR;
    const h = canvas.height - padT - padB;
    const maxVal = Math.max(...data.map(d => d.total), 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const n = labels.length;
    const barW = Math.max(10, (w / n) * 0.6);
    const gap = w / n;

    data.forEach((d, i) => {
      const x = padL + i * gap + (gap - barW) / 2;
      let currentY = padT + h;

      d.segments.forEach((seg, si) => {
        if (seg.value === 0) return;
        const segH = (seg.value / maxVal) * h;
        ctx.fillStyle = subjectColors[seg.subject] || this._COLORS[si % this._COLORS.length];
        ctx.fillRect(x, currentY - segH, barW, segH);
        currentY -= segH;
      });

      ctx.fillStyle = '#64748B';
      ctx.font = '10px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barW / 2, padT + h + 20);
    });

    // Axes
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + h);
    ctx.lineTo(padL + w, padT + h);
    ctx.stroke();
  }
}

window.charts = new ChartManager();

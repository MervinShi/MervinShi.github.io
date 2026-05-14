import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';

const ORB_COUNT = 5;
const ORB_MIN_R = 45;
const ORB_MAX_R = 120;
const MOUSE_REPEL_RADIUS = 200;
const MOUSE_REPEL_FORCE = 0.5;
const SPEED_BASE = 0.12;

const TAGLINES = [
  '用代码构建逻辑，用镜头记录世界',
  'Building logic with code, capturing world through lens',
];

const ORB_COLORS = [
  'rgba(100, 160, 255, 0.25)',
  'rgba(130, 100, 255, 0.22)',
  'rgba(255, 130, 100, 0.2)',
  'rgba(80, 200, 180, 0.22)',
  'rgba(255, 180, 80, 0.2)',
];

const ORB_GLOW = [
  'rgba(100, 160, 255, 0.12)',
  'rgba(130, 100, 255, 0.1)',
  'rgba(255, 130, 100, 0.09)',
  'rgba(80, 200, 180, 0.1)',
  'rgba(255, 180, 80, 0.09)',
];

function resizeCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.parentElement.clientWidth;
  const h = canvas.parentElement.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  return { w, h, dpr };
}

class Orb {
  constructor(w, h) {
    this.x = 80 + Math.random() * (w - 160);
    this.y = h * 0.2 + Math.random() * h * 0.6;
    this.targetR = ORB_MIN_R + Math.random() * (ORB_MAX_R - ORB_MIN_R);
    this.r = this.targetR;
    this.vx = (Math.random() - 0.5) * SPEED_BASE;
    this.vy = (Math.random() - 0.5) * SPEED_BASE;
    this.colorIdx = Math.floor(Math.random() * ORB_COLORS.length);
    this.phase = Math.random() * Math.PI * 2;
  }

  update(w, h, mouse, dt) {
    // Gentle drift
    this.phase += 0.002 * dt;
    this.vx += Math.sin(this.phase) * 0.002 * dt;
    this.vy += Math.cos(this.phase * 1.3) * 0.002 * dt;

    // Mouse repulsion
    if (mouse.x > 0 && mouse.y > 0) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_REPEL_RADIUS && dist > 0.1) {
        const force = (1 - dist / MOUSE_REPEL_RADIUS) * MOUSE_REPEL_FORCE * dt;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }

    // Damping
    this.vx *= 0.998;
    this.vy *= 0.998;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Boundaries
    const m = this.r;
    if (this.x < m) { this.x = m; this.vx *= -0.6; }
    if (this.x > w - m) { this.x = w - m; this.vx *= -0.6; }
    if (this.y < m) { this.y = m; this.vy *= -0.6; }
    if (this.y > h - m) { this.y = h - m; this.vy *= -0.6; }

    // Smooth radius transition
    this.r += (this.targetR - this.r) * 0.015 * dt;
  }

  draw(ctx, dpr) {
    const x = this.x * dpr;
    const y = this.y * dpr;
    const r = this.r * dpr;

    // Outer glow
    const glow = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 2.5);
    glow.addColorStop(0, ORB_GLOW[this.colorIdx]);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(x - r * 2.5, y - r * 2.5, r * 5, r * 5);

    // Main orb
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, ORB_COLORS[this.colorIdx].replace(/0\.\d+/, '0.45'));
    grad.addColorStop(0.7, ORB_COLORS[this.colorIdx]);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function orbBlockAtY(orb, lineY, lineH) {
  const cx = orb.x;
  const cy = orb.y;
  const r = orb.r + 28;
  if (lineY + lineH < cy - r || lineY > cy + r) return null;
  const halfChord = Math.sqrt(Math.max(0, r * r - Math.pow(cy - (lineY + lineH / 2), 2)));
  if (Number.isNaN(halfChord) || halfChord < 2) return null;
  return { left: cx - halfChord, right: cx + halfChord };
}

function getAvailableSlots(lineY, lineH, orbs, w, margin) {
  const blocks = [];
  for (const orb of orbs) {
    const b = orbBlockAtY(orb, lineY, lineH);
    if (b) blocks.push(b);
  }
  blocks.sort((a, b) => a.left - b.left);

  const slots = [];
  let cur = margin;
  for (const b of blocks) {
    if (b.left > cur + 16) slots.push({ left: cur, right: b.left });
    cur = Math.max(cur, b.right);
  }
  if (cur < w - margin) slots.push({ left: cur, right: w - margin });
  return slots;
}

function prepareTextData(text, containerW) {
  const fontSize = containerW < 480 ? 22 : containerW < 768 ? 32 : containerW < 1024 ? 44 : 56;
  const font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Hiragino Sans GB", sans-serif`;
  return {
    prepared: prepareWithSegments(text, font),
    font,
    fontSize,
    lineHeight: fontSize * 1.3,
  };
}

export function initPretextHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const existingCanvas = document.getElementById('hero-canvas');
  if (existingCanvas) existingCanvas.remove();

  const canvas = document.createElement('canvas');
  canvas.id = 'hero-canvas';
  canvas.style.cssText =
    'position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.85;';
  hero.insertBefore(canvas, hero.firstChild);

  let { w, h, dpr } = resizeCanvas(canvas);
  const ctx = canvas.getContext('2d');

  const orbs = Array.from({ length: ORB_COUNT }, () => new Orb(w, h));
  const mouse = { x: -1000, y: -1000 };
  let taglineIdx = 0;
  let prep = prepareTextData(TAGLINES[taglineIdx], w);
  let lastTime = performance.now();
  let animating = true;

  function getMargin() {
    if (w < 480) return 24;
    if (w < 768) return 40;
    return 60;
  }

  function getTextTop() {
    if (w < 480) return h * 0.18;
    if (w < 768) return h * 0.15;
    if (w < 1024) return h * 0.12;
    return h * 0.08;
  }

  function render(now) {
    if (!animating) return;
    const dt = Math.min((now - lastTime) / 16.667, 5);
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw orbs
    for (const orb of orbs) {
      orb.update(w, h, mouse, dt);
      orb.draw(ctx, dpr);
    }

    // Layout text with Pretext — one line at a time, variable width per row
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let textY = getTextTop();
    const margin = getMargin();
    const { prepared, font, lineHeight } = prep;

    ctx.textBaseline = 'top';
    ctx.font = font;

    while (textY < h - margin) {
      const slots = getAvailableSlots(textY, lineHeight, orbs, w, margin);
      if (slots.length === 0) {
        textY += lineHeight;
        continue;
      }

      // Pick widest slot
      let best = slots[0];
      for (let i = 1; i < slots.length; i++) {
        if (slots[i].right - slots[i].left > best.right - best.left) best = slots[i];
      }
      const maxWidth = best.right - best.left;
      if (maxWidth < 40) { textY += lineHeight; continue; }

      const line = layoutNextLine(prepared, cursor, maxWidth);
      if (line === null) break;

      // Center text within the slot
      const x = best.left + Math.max(0, (maxWidth - line.width) / 2);
      const alpha = 0.55 + 0.35 * (1 - textY / h);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.9, alpha)})`;
      ctx.fillText(line.text, x * dpr, textY * dpr);

      cursor = line.end;
      textY += lineHeight;
    }

    requestAnimationFrame(render);
  }

  // Mouse tracking
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

  // Touch
  hero.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  }, { passive: true });
  hero.addEventListener('touchend', () => { mouse.x = -1000; mouse.y = -1000; });

  // Resize
  let resizeId;
  window.addEventListener('resize', () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(() => {
      const dims = resizeCanvas(canvas);
      w = dims.w; h = dims.h; dpr = dims.dpr;
      for (const orb of orbs) {
        orb.x = Math.min(Math.max(orb.x, orb.r), w - orb.r);
        orb.y = Math.min(Math.max(orb.y, orb.r), h - orb.r);
      }
      prep = prepareTextData(TAGLINES[taglineIdx], w);
    }, 250);
  });

  // Reduced motion
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    animating = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const orb of orbs) orb.draw(ctx, dpr);
  }
  motionQuery.addEventListener('change', (e) => {
    animating = !e.matches;
    if (animating) requestAnimationFrame(render);
  });

  // Language change
  window.addEventListener('languagechanged', (e) => {
    taglineIdx = e.detail === 'zh' ? 0 : 1;
    prep = prepareTextData(TAGLINES[taglineIdx], w);
  });

  requestAnimationFrame(render);
}

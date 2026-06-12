// --- 1. DARK MODE FUNCTIONALITY ---
const themeToggleBtn = document.getElementById('theme-toggle');

// Check user configuration preference from localStorage if it exists
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

themeToggleBtn.addEventListener('click', () => {
    // Determine target state
    let theme = document.documentElement.getAttribute('data-theme');
    let targetTheme = "light";
    
    if (theme !== "dark") {
        targetTheme = "dark";
    }
    
    // Apply dataset attribute to root <html> tag
    document.documentElement.setAttribute('data-theme', targetTheme);
    // Persist choice
    localStorage.setItem('theme', targetTheme);
});


// --- 2. INTERACTIVE CONTACT FORM ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page refresh sequence
    
    // Fetch input elements data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Basic structural visual validation feedback loop
    formStatus.textContent = "Sending message...";
    formStatus.className = "form-status"; 

    // Simulate Server-side submission processing delay
    setTimeout(() => {
        if(name && email && message) {
            formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
            formStatus.className = "form-status success";
            
            // Clear input text metrics clear parameters
            contactForm.reset();
        } else {
            formStatus.textContent = "Oops! Please make sure all form elements are filled out correctly.";
            formStatus.className = "form-status error";
        }
    }, 1000);
});
/**
 * background.js
 * Three-phase animated canvas background: Nature → Physics → Electronics
 * Sits at z-index: -1; all site content renders above it unchanged.
 *
 * Usage (add to your HTML, just before </body>):
 *   <canvas id="bg-canvas"></canvas>
 *   <script src="background.js" defer></script>
 */

(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const isDark  = () => document.documentElement.getAttribute('data-theme') === 'dark';
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Resize ──────────────────────────────────────────────────────────────── */
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    buildCircuit();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Phase timing ─────────────────────────────────────────────────────────
     0 = Nature   |   1 = Physics   |   2 = Electronics                       */
  const PHASE_MS = 14000;   // hold time per scene
  const FADE_MS  = 2500;    // crossfade overlap
  let   phase      = 0;
  let   phaseStart = performance.now();

  /* ── Global opacity knob — raise/lower to taste (0.0 – 1.0) ─────────────── */
  const BASE_ALPHA = 0.22;

  /* ══════════════════════════════════════════════════════════════════════════
     PHASE 0 — NATURE
     Floating leaves + swaying grass blades + rolling hills + sun glow
  ══════════════════════════════════════════════════════════════════════════ */
  const LEAF_COUNT = 72;
  const leaves = [];

  function mkLeaf(startY) {
    return {
      x    : Math.random() * innerWidth,
      y    : startY !== undefined ? startY : Math.random() * innerHeight,
      vx   : (Math.random() - 0.5) * 0.55,
      vy   : -(0.35 + Math.random() * 0.75),
      w    : 2.2 + Math.random() * 4.8,
      hue  : 130 + Math.random() * 55,
      sat  : 52 + Math.random() * 22,
      lum  : 46 + Math.random() * 20,
      opa  : 0.38 + Math.random() * 0.52,
      swayOff : Math.random() * Math.PI * 2,
      swayFreq: 0.007 + Math.random() * 0.013,
      swayAmp : 11 + Math.random() * 22,
      life : Math.random() * 400,
      maxLife: 280 + Math.random() * 440
    };
  }
  for (let i = 0; i < LEAF_COUNT; i++) leaves.push(mkLeaf());

  function drawNature(ts, a) {
    const W = canvas.width, H = canvas.height;
    const tSlow = ts * 0.00075;
    ctx.save();

    /* Sun glow */
    ctx.globalAlpha = 0.09 * a;
    const sg = ctx.createRadialGradient(W * 0.74, H * 0.18, 0, W * 0.74, H * 0.18, W * 0.35);
    sg.addColorStop(0, isDark() ? 'rgba(52,211,153,0.55)' : 'rgba(134,239,172,0.55)');
    sg.addColorStop(1, 'transparent');
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);

    /* Rolling hills */
    ctx.globalAlpha = 0.10 * a;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 8) {
      const y = H * 0.79
        + Math.sin(x * 0.006 + tSlow)        * 38
        + Math.sin(x * 0.012 + tSlow * 1.35) * 22
        + Math.sin(x * 0.022 + tSlow * 0.7)  * 12;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    const hg = ctx.createLinearGradient(0, H * 0.72, 0, H);
    hg.addColorStop(0, isDark() ? 'rgba(16,185,129,0.3)'  : 'rgba(16,185,129,0.22)');
    hg.addColorStop(1, isDark() ? 'rgba(5,150,105,0.08)'  : 'rgba(5,150,105,0.06)');
    ctx.fillStyle = hg;
    ctx.fill();

    /* Grass blades */
    const blades = 11;
    ctx.globalAlpha = 0.20 * a;
    for (let i = 0; i < blades; i++) {
      const bx   = (W / (blades + 1)) * (i + 1);
      const hillY = H * 0.79
        + Math.sin(bx * 0.006 + tSlow)        * 38
        + Math.sin(bx * 0.012 + tSlow * 1.35) * 22;
      const sway  = Math.sin(ts * 0.0014 + i * 1.1) * 20;
      ctx.beginPath();
      ctx.moveTo(bx, hillY);
      ctx.bezierCurveTo(
        bx + sway * 0.25, hillY - 55,
        bx + sway * 0.65, hillY - 115,
        bx + sway,        hillY - 175
      );
      ctx.strokeStyle = isDark()
        ? `rgba(52,211,153,${0.55 - i % 3 * 0.06})`
        : `rgba(21,128,61,${0.45 - i % 3 * 0.05})`;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    /* Floating leaves */
    ctx.globalAlpha = BASE_ALPHA * a;
    leaves.forEach(l => {
      l.life++;
      l.x += l.vx + Math.sin(ts * l.swayFreq + l.swayOff) * 0.32;
      l.y += l.vy;
      if (l.y < -20 || l.life > l.maxLife) { Object.assign(l, mkLeaf(canvas.height + 10)); }
      const fade = Math.min(1, l.life / 40) * Math.min(1, (l.maxLife - l.life) / 40);
      ctx.save();
      ctx.globalAlpha = l.opa * fade * BASE_ALPHA * a;
      ctx.translate(l.x, l.y);
      ctx.rotate(l.vx * 0.5 + Math.sin(ts * l.swayFreq + l.swayOff) * 0.38);
      ctx.beginPath();
      ctx.ellipse(0, 0, l.w * 0.5, l.w * 1.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${l.hue},${l.sat}%,${l.lum}%)`;
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();
  }

  /* ══════════════════════════════════════════════════════════════════════════
     PHASE 1 — PHYSICS
     Two-source wave interference + expanding rings + orbiting particles
  ══════════════════════════════════════════════════════════════════════════ */
  function drawPhysics(ts, a) {
    const W = canvas.width, H = canvas.height;
    const cx1 = W * 0.33, cy = H * 0.5, cx2 = W * 0.67;
    const λ = 62;
    const tS = ts * 0.042;

    ctx.save();

    /* Interference dot field */
    ctx.globalAlpha = BASE_ALPHA * a;
    const step = 15;
    for (let x = 0; x < W; x += step) {
      for (let y = 0; y < H; y += step) {
        const d1 = Math.sqrt((x - cx1) ** 2 + (y - cy) ** 2);
        const d2 = Math.sqrt((x - cx2) ** 2 + (y - cy) ** 2);
        const I  = (Math.sin(d1 / λ * Math.PI * 2 - tS)
                  + Math.sin(d2 / λ * Math.PI * 2 - tS)) / 2;
        if (I > 0.3) {
          const b = (I - 0.3) / 0.7;
          ctx.beginPath();
          ctx.arc(x, y, 1.6 + b * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = isDark()
            ? `rgba(56,189,248,${b * 0.55})`
            : `rgba(37,99,235,${b * 0.44})`;
          ctx.fill();
        }
      }
    }

    /* Expanding rings */
    const maxR = Math.max(W, H) * 1.15;
    [[cx1, cy], [cx2, cy]].forEach(([cx, cy]) => {
      for (let r = (tS * λ) % λ; r < maxR; r += λ) {
        ctx.globalAlpha = (1 - r / maxR) * 0.16 * a;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = isDark() ? 'rgba(14,165,233,1)' : 'rgba(37,99,235,1)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      /* Source dot */
      ctx.globalAlpha = 0.75 * a;
      const pg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
      pg.addColorStop(0, isDark() ? 'rgba(56,189,248,0.95)' : 'rgba(37,99,235,0.9)');
      pg.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = pg;
      ctx.fill();
    });

    /* Orbiting particles along elliptical paths */
    ctx.globalAlpha = 0.38 * a;
    for (let i = 0; i < 28; i++) {
      const θ  = ts * 0.011 + (i / 28) * Math.PI * 2;
      const r  = 95 + Math.sin(θ * 2.4) * 58;
      const px = W / 2 + Math.cos(θ) * r * 3.2;
      const py = H / 2 + Math.sin(θ) * r * 0.85;
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isDark() ? 'rgba(99,102,241,0.75)' : 'rgba(99,102,241,0.6)';
      ctx.fill();
    }

    ctx.restore();
  }

  /* ══════════════════════════════════════════════════════════════════════════
     PHASE 2 — ELECTRONICS
     PCB grid of nodes + L-shaped traces + animated glowing signals
  ══════════════════════════════════════════════════════════════════════════ */
  const nodes   = [];
  const edges   = [];
  const signals = [];

  function buildCircuit() {
    nodes.length = 0; edges.length = 0; signals.length = 0;
    const W = canvas.width, H = canvas.height;
    const cols = 9, rows = 6;
    const px = 100, py = 90;
    const sx = (W - px * 2) / (cols - 1);
    const sy = (H - py * 2) / (rows - 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.26) {
          nodes.push({
            x    : px + c * sx + (Math.random() - 0.5) * 26,
            y    : py + r * sy + (Math.random() - 0.5) * 26,
            pulse: Math.random() * Math.PI * 2,
            big  : Math.random() > 0.62
          });
        }
      }
    }

    const maxDist = Math.min(sx, sy) * 2.0;
    nodes.forEach((n, i) => {
      nodes.forEach((m, j) => {
        if (j <= i) return;
        if (Math.hypot(n.x - m.x, n.y - m.y) < maxDist && Math.random() > 0.38) {
          edges.push({ a: i, b: j });
          if (Math.random() > 0.52) {
            signals.push({ ei: edges.length - 1, t: Math.random(), spd: 0.0022 + Math.random() * 0.004 });
          }
        }
      });
    });
  }

  function drawElectronics(ts, a) {
    ctx.save();

    /* PCB traces */
    ctx.globalAlpha = 0.30 * a;
    edges.forEach(e => {
      const A = nodes[e.a], B = nodes[e.b];
      const mx = A.x + (B.x - A.x) * 0.5;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(mx,  A.y);
      ctx.lineTo(mx,  B.y);
      ctx.lineTo(B.x, B.y);
      ctx.strokeStyle = isDark() ? 'rgba(56,189,248,0.48)' : 'rgba(37,99,235,0.36)';
      ctx.lineWidth   = 0.9;
      ctx.stroke();
    });

    /* Glowing signals */
    ctx.globalAlpha = BASE_ALPHA * a;
    signals.forEach(s => {
      s.t = (s.t + s.spd) % 1;
      const e = edges[s.ei]; if (!e) return;
      const A = nodes[e.a], B = nodes[e.b];
      const mx   = A.x + (B.x - A.x) * 0.5;
      const seg1 = Math.abs(mx   - A.x) || 0.01;
      const seg2 = Math.abs(B.y  - A.y) || 0.01;
      const seg3 = Math.abs(B.x  - mx)  || 0.01;
      const tot  = seg1 + seg2 + seg3;
      const d    = s.t * tot;
      let px, py;
      if      (d < seg1)          { px = A.x + (mx  - A.x) * (d           / seg1); py = A.y; }
      else if (d < seg1 + seg2)   { px = mx;                                         py = A.y + (B.y - A.y) * ((d - seg1)         / seg2); }
      else                        { px = mx  + (B.x - mx)  * ((d - seg1 - seg2) / seg3); py = B.y; }

      const g = ctx.createRadialGradient(px, py, 0, px, py, 10);
      g.addColorStop(0, isDark() ? 'rgba(34,211,238,0.95)' : 'rgba(14,165,233,0.9)');
      g.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    });

    /* Nodes */
    nodes.forEach(n => {
      const pulse = (Math.sin(ts * 0.024 + n.pulse) + 1) / 2;
      const r     = (n.big ? 5 : 3) + pulse * 1.8;

      /* Outer glow ring */
      ctx.globalAlpha = 0.14 * pulse * a;
      ctx.beginPath(); ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
      ctx.fillStyle = isDark() ? 'rgba(56,189,248,0.6)' : 'rgba(37,99,235,0.5)';
      ctx.fill();

      /* Node body */
      ctx.globalAlpha = (0.38 + pulse * 0.22) * a;
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle   = isDark() ? 'rgba(99,102,241,0.78)' : 'rgba(99,102,241,0.62)';
      ctx.fill();
      ctx.strokeStyle = isDark() ? 'rgba(56,189,248,0.72)' : 'rgba(37,99,235,0.62)';
      ctx.lineWidth   = 1;
      ctx.stroke();
    });

    ctx.restore();
  }

  /* ── Render loop ─────────────────────────────────────────────────────────── */
  const drawFns = [drawNature, drawPhysics, drawElectronics];

  function render(now) {
    if (reduced()) return; // honour prefers-reduced-motion

    requestAnimationFrame(render);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const elapsed = now - phaseStart;
    const next    = (phase + 1) % 3;
    let   curA = 1, nxtA = 0;

    if (elapsed > PHASE_MS) {
      const p = Math.min(1, (elapsed - PHASE_MS) / FADE_MS);
      curA = 1 - p;
      nxtA = p;
    }
    if (elapsed > PHASE_MS + FADE_MS) { phase = next; phaseStart = now; }

    if (curA > 0.01) drawFns[phase](now, curA);
    if (nxtA > 0.01) drawFns[next](now, nxtA);
  }

  requestAnimationFrame(render);

})();
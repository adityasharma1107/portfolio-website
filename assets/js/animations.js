/* ─── PIPELINE CANVAS ─── */
const canvas = document.getElementById('pipelineCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, nodes, edges, particles;
 
  const SERVICES = ['Function App','Logic App','Service Bus','ADF','Event Grid','Key Vault','APIM','Blob Storage','SQL DB','App Insights','SFTP','Service Bus'];

  function getColors() {
    const dark = html.dataset.theme !== 'light';
    return {
      nodeFill: dark ? '#1E3A5F' : '#C5D9EE',
      nodeBorder: dark ? '#00B4D8' : '#0072A3',
      text: dark ? '#8AAAC8' : '#3A6080',
      particle: dark ? '#00B4D8' : '#0072A3',
      edge: dark ? 'rgba(0,180,216,0.13)' : 'rgba(0,114,163,0.15)',
    };
  }

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    init();
  }

  function init() {
    const cx = W * 0.66, cy = H * 0.5;
    const r = Math.min(W, H) * 0.28;
    nodes = SERVICES.map((name, i) => {
      const angle = (i / SERVICES.length) * Math.PI * 2;
      return {
        x: cx + Math.cos(angle) * r * (.7 + Math.random() * .55),
        y: cy + Math.sin(angle) * r * (.7 + Math.random() * .55),
        name,
        vx: (Math.random() - .5) * .15,
        vy: (Math.random() - .5) * .15,
        r: 5,
      };
    });
    edges = [];
    for (let i = 0; i < nodes.length; i++) {
      const count = 2 + Math.floor(Math.random() * 2);
      for (let k = 0; k < count; k++) {
        const j = (i + 1 + Math.floor(Math.random() * (nodes.length - 2))) % nodes.length;
        if (!edges.find(e => (e.a === i && e.b === j) || (e.a === j && e.b === i))) edges.push({ a: i, b: j });
      }
    }
    particles = edges.map(e => ({ edge: e, t: Math.random(), speed: .003 + Math.random() * .004 }));
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const C = getColors();
    edges.forEach(e => {
      const a = nodes[e.a], b = nodes[e.b];
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = C.edge; ctx.lineWidth = 1; ctx.stroke();
    });
    particles.forEach(p => {
      p.t += p.speed; if (p.t > 1) p.t = 0;
      const a = nodes[p.edge.a], b = nodes[p.edge.b];
      const x = lerp(a.x, b.x, p.t), y = lerp(a.y, b.y, p.t);
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = C.particle;
      ctx.shadowBlur = 10; ctx.shadowColor = C.particle;
      ctx.fill(); ctx.shadowBlur = 0;
    });
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      const m = 80;
      if (n.x < m || n.x > W - m) n.vx *= -1;
      if (n.y < m || n.y > H - m) n.vy *= -1;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 18);
      g.addColorStop(0, 'rgba(0,180,216,0.13)'); g.addColorStop(1, 'rgba(0,180,216,0)');
      ctx.beginPath(); ctx.arc(n.x, n.y, 18, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = C.nodeFill; ctx.strokeStyle = C.nodeBorder; ctx.lineWidth = 1.5;
      ctx.fill(); ctx.stroke();
      ctx.font = '11px Inter, sans-serif'; ctx.fillStyle = C.text; ctx.textAlign = 'center';
      ctx.fillText(n.name, n.x, n.y + 22);
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ─── STORY SLIDER ─── */
const storySlider = document.querySelector('.story-slider');
const storySlides = storySlider ? Array.from(storySlider.querySelectorAll('.story-slide')) : [];
const prevStoryBtn = document.querySelector('.story-nav-btn--prev');
const nextStoryBtn = document.querySelector('.story-nav-btn--next');
let storyIndex = 0;
let storyAnimating = false;

function updateStoryNav() {
  if (prevStoryBtn) {
    prevStoryBtn.classList.toggle('is-visible', storyIndex > 0);
  }
}

function showStorySlide(index) {
  if (!storySlider || storySlides.length === 0 || storyAnimating) return;

  storyAnimating = true;
  const currentSlide = storySlides[storyIndex];
  const nextSlide = storySlides[index];

  if (currentSlide) {
    currentSlide.classList.remove('is-active');
    currentSlide.classList.add('is-exit');
  }
  if (nextSlide) {
    nextSlide.classList.remove('is-active');
    nextSlide.classList.add('is-entering');
  }

  requestAnimationFrame(() => {
    if (nextSlide) {
      nextSlide.classList.add('is-active');
      nextSlide.classList.remove('is-entering');
    }
  });

  setTimeout(() => {
    if (currentSlide) {
      currentSlide.classList.remove('is-exit');
    }
    storyAnimating = false;
  }, 350);

  storyIndex = index;
  updateStoryNav();
}

if (storySlider && storySlides.length) {
  nextStoryBtn?.addEventListener('click', () => {
    const nextIndex = (storyIndex + 1) % storySlides.length;
    showStorySlide(nextIndex);
  });

  prevStoryBtn?.addEventListener('click', () => {
    const prevIndex = (storyIndex - 1 + storySlides.length) % storySlides.length;
    showStorySlide(prevIndex);
  });

  updateStoryNav();
}

const hamburger = document.getElementById('navHamburger');
const drawer    = document.getElementById('navDrawer');
const drawerClose = document.getElementById('navDrawerClose');
 
function openDrawer() {
  drawer.classList.add('is-open');
  hamburger.classList.add('is-open');
}
function closeDrawer() {
  drawer.classList.remove('is-open');
  hamburger.classList.remove('is-open');
}
 
hamburger?.addEventListener('click', () => {
  drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
});
 
drawerClose?.addEventListener('click', closeDrawer);
 
drawer?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', closeDrawer)
);

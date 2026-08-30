/* ─── THEME TOGGLE ─── */
const html = document.documentElement;
const toggle = document.getElementById('themeToggle');
const icon = document.getElementById('themeIcon');

toggle?.addEventListener('click', () => {
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  icon.textContent = next === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', next);
});

const saved = localStorage.getItem('theme');
if (saved) {
  html.dataset.theme = saved;
  icon.textContent = saved === 'dark' ? '🌙' : '☀️';
}

/* ─── SCROLL REVEAL ─── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ─── NAV SHRINK ─── */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  const side = window.innerWidth <= 768 ? '1.25rem' : '3rem';
  nav.style.padding = window.scrollY > 40 ? `.6rem ${side}` : `1rem ${side}`;
});

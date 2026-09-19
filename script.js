/* ============================================================
   Three restrained interactions:
   1. Scroll progress bar in the fixed header strip
   2. A nav underline that glides beneath the active section link
   3. Sections/entries revealing gently as they enter the viewport
   ============================================================ */

document.getElementById('year').textContent = new Date().getFullYear();

/* 1. Scroll progress bar */
const progressBar = document.getElementById('progressBar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* 2. Sliding nav underline that tracks the section in view */
const nav = document.querySelector('.main-nav');
const navUnderline = document.querySelector('.nav-underline');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function moveUnderlineTo(link) {
  if (!link) return;
  const navRect = nav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  navUnderline.style.width = linkRect.width + 'px';
  navUnderline.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
  nav.classList.add('tracked');
  navLinks.forEach((l) => l.classList.toggle('active', l === link));
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        const match = navLinks.find((l) => l.getAttribute('href') === id);
        if (match) moveUnderlineTo(match);
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);
sections.forEach((section) => sectionObserver.observe(section));

navLinks.forEach((link) => {
  link.addEventListener('mouseenter', () => moveUnderlineTo(link));
});
nav.addEventListener('mouseleave', () => {
  const activeLink = navLinks.find((l) => l.classList.contains('active'));
  moveUnderlineTo(activeLink);
});

window.addEventListener('resize', () => {
  const activeLink = navLinks.find((l) => l.classList.contains('active')) || navLinks[0];
  moveUnderlineTo(activeLink);
});

/* 3. Gentle reveal on scroll */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* 4. Hero typing animation — cycles through a few phrases */
(function typewriter() {
  const target = document.getElementById('typedText');
  if (!target) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phrases = [
    'voice & WhatsApp agents.',
    'growth from raw signals.',
    'research into decisions.',
    'AI that keeps your tone.',
  ];

  if (prefersReduced) {
    target.textContent = phrases[0];
    return;
  }

  const TYPE_SPEED = 65;
  const DELETE_SPEED = 35;
  const HOLD_TIME = 1600;
  const BETWEEN_TIME = 350;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      target.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(tick, HOLD_TIME);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      target.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, BETWEEN_TIME);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  setTimeout(tick, 600);
})();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const storyScreen = document.querySelector('.story-screen');
const watchWrap = document.querySelector('.story-watch-wrap');
const storySteps = [...document.querySelectorAll('.story-step')];

function renderScreen(name) {
  const screens = {
    setup: ['assets/simulator-setup.png', 'RallyWrist 双打开赛设置真实模拟器界面'],
    score: ['assets/simulator-singles.png', 'RallyWrist 单打计分真实模拟器界面'],
    rotation: ['assets/simulator-doubles.png', 'RallyWrist 双打站位与计分真实模拟器界面'],
    metrics: ['assets/simulator-metrics.png', 'RallyWrist 运动数据真实模拟器界面']
  };

  const [src, alt] = screens[name];
  storyScreen.className = 'watch-screen story-screen';
  storyScreen.innerHTML = `<img class="simulator-shot" src="${src}" alt="${alt}" decoding="async" />`;
  watchWrap.classList.remove('pulse');
  requestAnimationFrame(() => watchWrap.classList.add('pulse'));
}

let activeStory = 'setup';
function updateStory() {
  const focusLine = innerHeight * 0.5;
  const closest = storySteps.reduce((winner, step) => {
    const box = step.getBoundingClientRect();
    const distance = Math.abs(box.top + box.height / 2 - focusLine);
    return !winner || distance < winner.distance ? { step, distance } : winner;
  }, null)?.step;
  if (!closest || closest.dataset.step === activeStory) return;
  activeStory = closest.dataset.step;
  storySteps.forEach((step) => step.classList.toggle('is-active', step === closest));
  renderScreen(activeStory);
}

addEventListener('scroll', updateStory, { passive: true });
addEventListener('resize', updateStory);
updateStory();

const heroSequence = document.querySelector('[data-score-sequence]');
const heroFrames = [...heroSequence.querySelectorAll('.score-frame')];
let heroSequenceVisible = true;
let heroScoreTimer;

function showHeroFrame(index) {
  heroFrames.forEach((frame, frameIndex) => {
    const active = frameIndex === index;
    frame.classList.toggle('is-active', active);
    frame.setAttribute('aria-hidden', String(!active));
  });
}

function playHeroScore() {
  if (document.hidden || !heroSequenceVisible) return;
  clearTimeout(heroScoreTimer);
  showHeroFrame(0);
  heroSequence.classList.remove('is-scoring');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => heroSequence.classList.add('is-scoring'));
  });
  heroScoreTimer = setTimeout(() => showHeroFrame(1), 1380);
}

new IntersectionObserver(([entry]) => {
  heroSequenceVisible = entry.isIntersecting;
  if (heroSequenceVisible && !prefersReducedMotion) playHeroScore();
}, { threshold: 0.2 }).observe(heroSequence);

if (!prefersReducedMotion) setInterval(playHeroScore, 4200);

const rotationGallery = document.querySelector('.rotation-gallery');
const rotationFigures = [...rotationGallery.querySelectorAll('figure')];
let rotationIndex = 0;
let rotationVisible = false;

new IntersectionObserver(([entry]) => {
  rotationVisible = entry.isIntersecting;
}, { threshold: 0.25 }).observe(rotationGallery);

if (!prefersReducedMotion) setInterval(() => {
  if (document.hidden || !rotationVisible) return;
  rotationFigures[rotationIndex].classList.remove('is-current');
  rotationIndex = (rotationIndex + 1) % rotationFigures.length;
  rotationFigures[rotationIndex].classList.add('is-current');
}, 2000);

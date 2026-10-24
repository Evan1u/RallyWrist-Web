const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

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
  storyScreen.innerHTML = `<img class="simulator-shot" src="${src}" alt="${alt}" />`;
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

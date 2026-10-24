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
    setup: `
      <div class="setup-panel setup-top"><b>开始运动</b><span>🏸</span></div>
      <div class="setup-panel setup-left"><small>目标分</small><b>21 分</b></div>
      <div class="setup-panel setup-right"><small>首局发球</small><b>蓝方</b></div>
      <div class="setup-center"><small>比赛模式</small><b>双打</b><span>›</span></div>`,
    score: `
      <div class="simple-half" style="background:#1e5bff"><span>12</span></div>
      <div class="simple-half" style="background:#e8232a"><span>9</span></div>
      <div class="net-label">第 1 局 · 0:0</div>
      <div class="swipe-cue" style="opacity:1"><span>↑</span> 上滑得分</div>`,
    rotation: `
      <div class="court-half court-blue"><div class="court-lines"></div><span class="player player-left">蓝2<small>搭档</small></span><strong class="score">13</strong><span class="player player-right serving">蓝1<i class="shuttle">◒</i></span></div>
      <div class="net-label">第 2 局 · 1:0</div>
      <div class="court-half court-red"><div class="court-lines"></div><span class="player player-left receiving">红2<i>◎</i></span><strong class="score">11</strong><span class="player player-right">红1<small>搭档</small></span></div>`,
    metrics: `
      <div class="metrics-screen">
        <div class="metric"><small>◷ 时间</small><strong>38:42</strong></div>
        <div class="metric"><small>♥ 心率</small><strong>146</strong><em>BPM</em></div>
        <div class="metric"><small>● 活动能量</small><strong>328</strong><em>千卡</em></div>
      </div>`
  };

  storyScreen.className = `watch-screen story-screen ${name}-mode`;
  storyScreen.innerHTML = screens[name];
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

let heroBlue = 11;
let heroRed = 8;
const blueScore = document.querySelector('[data-blue-score]');
const redScore = document.querySelector('[data-red-score]');
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) setInterval(() => {
  if (document.hidden) return;
  const blueWins = Math.random() > 0.46;
  if (blueWins) {
    heroBlue += 1;
    blueScore.textContent = heroBlue;
    blueScore.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.28)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
  } else {
    heroRed += 1;
    redScore.textContent = heroRed;
    redScore.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.28)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
  if (heroBlue >= 16 || heroRed >= 16) { heroBlue = 11; heroRed = 8; }
}, 3200);

/* ══════════════════════════════
   DATA
══════════════════════════════ */
const DAYS = [
  { l:'M', name:'Monday', focus:'Full Body Strength', type:'s',
    tip:'Start light, focus on form. Add weight slowly each week.',
    ex:[
      { n:'Squat', s:'Barbell or goblet', sets:'3×8–10', rest:'90s', muscles:['Quads','Glutes','Hamstrings'] },
      { n:'Bench Press', s:'Or push-ups', sets:'3×8–10', rest:'90s', muscles:['Chest','Triceps','Shoulders'] },
      { n:'Dumbbell Row', s:'Pull to hip', sets:'3×8–10', rest:'60s', muscles:['Lats','Biceps','Rear Delt'] },
      { n:'Romanian Deadlift', s:'Dumbbell', sets:'3×10', rest:'60s', muscles:['Hamstrings','Glutes','Lower Back'] },
      { n:'Plank', s:'Core hold', sets:'3×30–45s', rest:'30s', muscles:['Core','Abs','Obliques'] }
    ]},
  { l:'T', name:'Tuesday', focus:'Conditioning', type:'c',
    tip:'Sprint intensity matters more than volume. Stay explosive.',
    ex:[
      { n:'Sprint Intervals', s:'30s fast / 60s walk', sets:'8–10 rounds', rest:'', muscles:['Quads','Calves','Cardio'] },
      { n:'Box Jumps', s:'Land softly, use hips', sets:'3×10', rest:'', muscles:['Quads','Glutes','Calves'] },
      { n:'Burpees', s:'2×8 if too intense', sets:'3×10', rest:'', muscles:['Full Body','Core','Chest'] },
      { n:'Light Jog', s:'Cool down', sets:'10–15 min', rest:'', muscles:['Cardio','Calves'] }
    ]},
  { l:'W', name:'Wednesday', focus:'Full Body Strength', type:'s',
    tip:'Optional: add curls or tricep dips for extra arm work.',
    ex:[
      { n:'Hip Thrust', s:'Deadlift alternative', sets:'3×10–12', rest:'90s', muscles:['Glutes','Hamstrings'] },
      { n:'Incline DB Press', s:'Upper chest focus', sets:'3×8–10', rest:'90s', muscles:['Upper Chest','Shoulders','Triceps'] },
      { n:'Pull-ups', s:'Assisted if needed', sets:'3×6–10', rest:'90s', muscles:['Lats','Biceps','Rear Delt'] },
      { n:'Lunges', s:'DB or bodyweight', sets:'3×10 each', rest:'60s', muscles:['Quads','Glutes','Hamstrings'] },
      { n:'Russian Twists', s:'Core finisher', sets:'3×15', rest:'30s', muscles:['Obliques','Core','Abs'] }
    ]},
  { l:'TH', name:'Thursday', focus:'Conditioning', type:'c',
    tip:'Moderate intensity 20–40 min. Movement + explosiveness.',
    ex:[
      { n:'Repeat Tuesday', s:'Or a fun sport', sets:'20–40 min', rest:'', muscles:['Full Body','Cardio'] },
      { n:'Sport Option', s:'Football, basketball, cycling', sets:'Moderate', rest:'', muscles:['Full Body'] }
    ]},
  { l:'F', name:'Friday', focus:'Full Body Strength', type:'s',
    tip:'Feeling strong? Try Overhead Press 3×6–8 as a swap.',
    ex:[
      { n:'Squat', s:'Barbell or goblet', sets:'3×8–10', rest:'90s', muscles:['Quads','Glutes','Hamstrings'] },
      { n:'Bench Press', s:'Or push-ups', sets:'3×8–10', rest:'90s', muscles:['Chest','Triceps','Shoulders'] },
      { n:'Dumbbell Row', s:'Pull to hip', sets:'3×8–10', rest:'60s', muscles:['Lats','Biceps','Rear Delt'] },
      { n:'Romanian Deadlift', s:'Dumbbell', sets:'3×10', rest:'60s', muscles:['Hamstrings','Glutes','Lower Back'] },
      { n:'Plank / Knee Raises', s:'Core finisher', sets:'3×30–45s', rest:'30s', muscles:['Core','Abs','Hip Flexors'] }
    ]},
  { l:'S', name:'Saturday', focus:'Optional Conditioning', type:'o',
    tip:'Keep it fun and low pressure. Skip if needed.',
    ex:[
      { n:'Cycling / Sprints', s:'Light cardio', sets:'20–30 min', rest:'', muscles:['Quads','Cardio','Calves'] },
      { n:'Sport / Activity', s:'Your choice', sets:'Optional', rest:'', muscles:['Full Body'] }
    ]},
  { l:'S', name:'Sunday', focus:'Rest & Recovery', type:'r', tip:'', ex:[] }
];

const BADGES   = { s:'badge-s', c:'badge-c', o:'badge-o', r:'badge-r' };
const B_LABEL  = { s:'Strength', c:'Cardio', o:'Optional', r:'Rest' };
const DOT_COLS = { s:'#7ddc60', c:'#60aaff', o:'#ffb833', r:'rgba(255,255,255,0.15)' };

const todayIdx = (new Date().getDay() + 6) % 7;
let selDay  = todayIdx;
let selEx   = null;
let mainTab = 'workout';
let userName = 'ATHLETE';

/* ══════════════════════════════
   NAVIGATION
══════════════════════════════ */
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('gone'));
  document.getElementById(id).classList.remove('gone');
}

function typeHeroName(name) {
  const el = document.getElementById('heroName');
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const animate = setInterval(() => {
    if (i <= name.length) {
      el.textContent = name.slice(0, i);
      i += 1;
    } else {
      clearInterval(animate);
    }
  }, 80);
}

function typeSplashTitle(text) {
  const el = document.getElementById('splashTitle');
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const animate = setInterval(() => {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i += 1;
    } else {
      clearInterval(animate);
    }
  }, 80);
}

function doLogin() {
  const v = document.getElementById('nameInput').value.trim();
  userName = v ? v.toUpperCase() : 'ATHLETE';
  localStorage.setItem('moveXName', userName);
  typeHeroName(userName);
  goTo('home');
  renderMain();
}

function switchMain(tab, btn) {
  mainTab = tab;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderMain();
}

function selectDay(i) { selDay = i; selEx = null; renderMain(); }
function selectEx(i)  { selEx  = selEx === i ? null : i; renderMain(); }

/* ══════════════════════════════
   BODY MAP SVG
   Replace colours or add more
   muscle groups here as needed
══════════════════════════════ */
function bodyMapSVG(muscles) {
  const t   = muscles.map(m => m.toLowerCase());
  const has = (...ks) => ks.some(k => t.some(x => x.includes(k)));
  const Y   = '#e8ff00';
  const D   = 'rgba(255,255,255,0.08)';
  const B   = 'rgba(255,255,255,0.04)';
  const c   = (...ks) => has(...ks) ? Y : D;

  return `
  <svg width="72" height="150" viewBox="0 0 72 150" xmlns="http://www.w3.org/2000/svg">
    <!-- Head -->
    <circle cx="36" cy="11" r="10" fill="${B}" stroke="${c('full')}" stroke-width="1"/>
    <!-- Torso -->
    <rect x="18" y="23" width="36" height="34" rx="6"
          fill="${B}" stroke="${c('chest','lat','delt','shoulder','back','full')}" stroke-width="1"/>
    <!-- Left arm -->
    <rect x="6"  y="25" width="11" height="28" rx="5"
          fill="${B}" stroke="${c('bicep','tricep','shoulder','delt','full')}" stroke-width="1"/>
    <!-- Right arm -->
    <rect x="55" y="25" width="11" height="28" rx="5"
          fill="${B}" stroke="${c('bicep','tricep','shoulder','delt','full')}" stroke-width="1"/>
    <!-- Left core -->
    <rect x="19" y="59" width="15" height="28" rx="5"
          fill="${B}" stroke="${c('core','abs','oblique','hip','full')}" stroke-width="1"/>
    <!-- Right core / glute -->
    <rect x="38" y="59" width="15" height="28" rx="5"
          fill="${B}" stroke="${c('core','abs','oblique','glute','full')}" stroke-width="1"/>
    <!-- Left thigh -->
    <rect x="18" y="89" width="14" height="36" rx="5"
          fill="${B}" stroke="${c('quad','hamstring','glute','full')}" stroke-width="1"/>
    <!-- Right thigh -->
    <rect x="40" y="89" width="14" height="36" rx="5"
          fill="${B}" stroke="${c('quad','hamstring','glute','full')}" stroke-width="1"/>
    <!-- Left calf -->
    <rect x="19" y="127" width="12" height="22" rx="5"
          fill="${B}" stroke="${c('calf','cardio','full')}" stroke-width="1"/>
    <!-- Right calf -->
    <rect x="41" y="127" width="12" height="22" rx="5"
          fill="${B}" stroke="${c('calf','cardio','full')}" stroke-width="1"/>
  </svg>`;
}

/* ══════════════════════════════
   RENDER — WORKOUT
══════════════════════════════ */
function renderWorkout() {
  const d = DAYS[selDay];

  const stripHTML = DAYS.map((day, i) => `
    <div class="dp${i === selDay ? ' on' : ''}" onclick="selectDay(${i})">
      <span class="dp-l">${day.l}</span>
      <span class="dp-dot" style="background:${selDay === i ? '#000;opacity:0.4' : DOT_COLS[day.type]};"></span>
    </div>`).join('');

  /* REST DAY */
  if (d.type === 'r') {
    return `
    <div class="hm-body">
      <div class="sec-lbl">My Plan</div>
      <div class="week-row">${stripHTML}</div>
      <div class="sec-lbl" style="margin-top:20px;">Today</div>
      <div class="task-card">
        <div class="rest-screen">
          <div class="rest-ring">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4C8.48 4 4 8.48 4 14s4.48 10 10 10 10-4.48 10-10S19.52 4 14 4zm0 3v7l5 3-1.2 1.7L13 15V7h1z" fill="#e8ff00"/>
            </svg>
          </div>
          <div class="rest-t">REST DAY</div>
          <div class="rest-s">Walk · Stretch · Yoga<br>Foam rolling · Sleep well<br><br>Recovery is where the gains happen.</div>
        </div>
      </div>
    </div>`;
  }

  const curEx = selEx !== null ? d.ex[selEx] : null;

  return `
  <div class="hm-body">
    <div class="sec-lbl">My Plan</div>
    <div class="week-row">${stripHTML}</div>
    <div class="sec-lbl" style="margin-top:20px;">Task</div>
    <div class="task-card">
      <div class="task-hd">
        <span class="task-title">${d.focus}</span>
        <span class="task-badge ${BADGES[d.type]}">${B_LABEL[d.type]}</span>
      </div>
      ${d.ex.map((e, i) => `
        <div class="exrow${selEx === i ? ' sel' : ''}" onclick="selectEx(${i})">
          <div class="exnum">${i + 1}</div>
          <div class="exinfo">
            <div class="exname">${e.n}</div>
            <div class="exsub">${e.s}${e.rest ? ' · ' + e.rest : ''}</div>
          </div>
          <span class="exsets">${e.sets}</span>
        </div>`).join('')}
    </div>

    ${curEx ? `
    <div class="sec-lbl">Muscles targeted</div>
    <div class="muscle-panel">
      ${bodyMapSVG(curEx.muscles)}
      <div style="flex:1;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:#fff;letter-spacing:1px;margin-bottom:10px;">${curEx.n}</div>
        <div class="mtags">
          ${curEx.muscles.map((m, i) => `<span class="mtag ${i === 0 ? 'mtag-y' : 'mtag-w'}">${m}</span>`).join('')}
        </div>
        <div style="margin-top:12px;font-size:11px;color:rgba(255,255,255,0.2);letter-spacing:1px;">TAP ANOTHER TO COMPARE</div>
      </div>
    </div>` : `
    <div class="tip-box">
      <div class="tip-lbl">Coach tip</div>
      <div class="tip-txt">${d.tip}<br><br>
        <span style="color:rgba(232,255,0,0.5);font-size:12px;">Tap any exercise to see its muscle map.</span>
      </div>
    </div>`}
  </div>`;
}

/* ══════════════════════════════
   RENDER — DIET
══════════════════════════════ */
function renderDiet() {
  return `
  <div class="diet-body">
    <div class="sec-lbl" style="margin-top:20px;">Daily targets</div>
    <div class="macro-row">
      <div class="mc"><div class="mc-lbl">Cal</div><div class="mc-val">2200</div><div class="mc-unit">kcal/day</div></div>
      <div class="mc"><div class="mc-lbl">Protein</div><div class="mc-val">140g</div><div class="mc-unit">muscle</div></div>
      <div class="mc"><div class="mc-lbl">Carbs</div><div class="mc-val">260g</div><div class="mc-unit">energy</div></div>
    </div>

    <div class="sec-lbl" style="margin-top:20px;">Macro split</div>
    <div class="bar-block">
      <div class="bar-top"><span class="bar-name">Protein</span><span class="bar-pct">26%</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:26%;background:#7ddc60;"></div></div>
    </div>
    <div class="bar-block">
      <div class="bar-top"><span class="bar-name">Carbs</span><span class="bar-pct">47%</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:47%;background:#60aaff;"></div></div>
    </div>
    <div class="bar-block">
      <div class="bar-top"><span class="bar-name">Fats</span><span class="bar-pct">27%</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:27%;background:#e8ff00;"></div></div>
    </div>

    <div class="sec-lbl" style="margin-top:20px;">Meal plan — Nepali</div>

    <div class="meal-card">
      <div class="meal-hd">
        <div class="meal-ic">🌅</div>
        <div><div class="meal-nm">Bihana — Morning</div><div class="meal-tm">7:00 AM · Pre-workout fuel</div></div>
      </div>
      <div class="food-row"><span class="food-nm">Boiled eggs (3 whole)</span><span class="food-mc">21g protein · 230 kcal</span></div>
      <div class="food-row"><span class="food-nm">Banana (1 medium)</span><span class="food-mc">27g carbs · 105 kcal</span></div>
      <div class="food-row"><span class="food-nm">Milk + peanut butter</span><span class="food-mc">18g protein · 280 kcal</span></div>
      <div class="food-row"><span class="food-nm">Bread / roti (2 slices)</span><span class="food-mc">30g carbs · 160 kcal</span></div>
    </div>

    <div class="meal-card">
      <div class="meal-hd">
        <div class="meal-ic">☀️</div>
        <div><div class="meal-nm">Diuso — Lunch</div><div class="meal-tm">12:30 PM · Main meal</div></div>
      </div>
      <div class="food-row"><span class="food-nm">Rice (1.5 cups cooked)</span><span class="food-mc">65g carbs · 300 kcal</span></div>
      <div class="food-row"><span class="food-nm">Dal / rajma / chana</span><span class="food-mc">14g protein · 180 kcal</span></div>
      <div class="food-row"><span class="food-nm">Chicken / meat (150g)</span><span class="food-mc">32g protein · 220 kcal</span></div>
      <div class="food-row"><span class="food-nm">Tarkari (vegetables)</span><span class="food-mc">5g carbs · 40 kcal</span></div>
    </div>

    <div class="meal-card">
      <div class="meal-hd">
        <div class="meal-ic">⚡</div>
        <div><div class="meal-nm">Pre-Workout Snack</div><div class="meal-tm">3:30 PM · Energy boost</div></div>
      </div>
      <div class="food-row"><span class="food-nm">Peanut butter on bread</span><span class="food-mc">10g protein · 250 kcal</span></div>
      <div class="food-row"><span class="food-nm">Banana (1 small)</span><span class="food-mc">22g carbs · 89 kcal</span></div>
    </div>

    <div class="meal-card">
      <div class="meal-hd">
        <div class="meal-ic">🌙</div>
        <div><div class="meal-nm">Rati — Dinner</div><div class="meal-tm">7:30 PM · Recovery meal</div></div>
      </div>
      <div class="food-row"><span class="food-nm">Rice (1 cup) or roti</span><span class="food-mc">45g carbs · 200 kcal</span></div>
      <div class="food-row"><span class="food-nm">Chana / rajma curry</span><span class="food-mc">15g protein · 200 kcal</span></div>
      <div class="food-row"><span class="food-nm">Egg bhurji (2 eggs)</span><span class="food-mc">12g protein · 160 kcal</span></div>
      <div class="food-row"><span class="food-nm">Milk (1 glass)</span><span class="food-mc">8g protein · 150 kcal</span></div>
    </div>

    <div class="diet-tip">
      <div class="tip-lbl">Nepali diet advantage</div>
      <div class="tip-txt">Dal-bhat is a perfect gym diet. Rice = energy, dal = protein, meat = muscle. Add eggs + milk + peanut butter and you already eat like an athlete.</div>
    </div>
  </div>`;
}

/* ══════════════════════════════
   MAIN RENDER SWITCH
══════════════════════════════ */
function renderMain() {
  document.getElementById('mainContent').innerHTML =
    mainTab === 'diet' ? renderDiet() : renderWorkout();
}

function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('moveXTheme', mode);
}

function initTheme() {
  const saved = localStorage.getItem('moveXTheme');
  setTheme(saved === 'light' ? 'light' : 'dark');
}

function initName() {
  const savedName = localStorage.getItem('moveXName') || 'ATHLETE';
  userName = savedName;
  typeHeroName(savedName);

  const nameInput = document.getElementById('nameInput');
  if (nameInput) {
    nameInput.value = savedName;
  }
}

function initSplash() {
  const splashText = 'HELLO ! HYBRID ATHLETE';
  typeSplashTitle(splashText);
}

/* Init */
initTheme();
initSplash();
initName();
renderMain();

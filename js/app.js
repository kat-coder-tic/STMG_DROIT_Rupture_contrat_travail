/* ===== ESCAPE ROOM — RUPTURE CONTRAT DE TRAVAIL ===== */

const GAME_DURATION = 40 * 60; // 40 minutes en secondes

const state = {
  teamName: '',
  levelIndex: 0,
  timerInterval: null,
  timeLeft: GAME_DURATION,
  currentEnigma: 0,
  solved: [],
  scores: [],
  hints: [],
  hintsUsed: 0,
  hintsMax: 3,
  attempts: [],
  dragSrc: null,
  matchSel: { gauche: null, droite: null },
  matchedPairsByEnigma: [],
  validated: [],
  exhausted: [],
  startTime: null,
};

/* ===== DOM helpers ===== */
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};

/* ===== SCREENS ===== */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
}

function getCurrentLevel() {
  return LEVELS[state.levelIndex];
}

function getCurrentEnigmas() {
  return getCurrentLevel().enigmas;
}

function getEnigmaCount() {
  return getCurrentEnigmas().length;
}

function getMaxPoints() {
  return getCurrentEnigmas().reduce((total, enigma) => total + enigma.points, 0);
}

function renderStaticScoreLabels() {
  const maxPts = getMaxPoints();
  const objective = Math.ceil((maxPts * 0.6) / 10) * 10;
  const statMax = $('stat-max-points');
  const progressObjective = $('progress-objective');
  const resultsMax = $('results-score-max');
  if (statMax) statMax.textContent = maxPts;
  if (progressObjective) progressObjective.textContent = `Objectif : ${objective}+ pts`;
  if (resultsMax) resultsMax.textContent = `/ ${maxPts} pts`;
}

function normalizeAnswer(value) {
  return value
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '');
}

function resetLevelState() {
  const count = getEnigmaCount();
  state.timeLeft = GAME_DURATION;
  state.currentEnigma = 0;
  state.solved = Array(count).fill(false);
  state.scores = Array(count).fill(0);
  state.hints = Array(count).fill(false);
  state.hintsUsed = 0;
  state.attempts = Array(count).fill(0);
  state.validated = Array(count).fill(false);
  state.matchSel = { gauche: null, droite: null };
  state.matchedPairsByEnigma = Array(count).fill(null).map(() => []);
  state.exhausted = Array(count).fill(false);
  state.startTime = Date.now();
}

/* ===== WELCOME ===== */
$('btn-start').addEventListener('click', () => {
  const nameInput = $('team-name');
  const name = nameInput.value.trim();
  if (!name) { nameInput.focus(); nameInput.style.borderColor = '#ef4444'; return; }
  nameInput.style.borderColor = '';
  state.teamName = name;
  startGame();
});

$('team-name').addEventListener('keydown', e => { if (e.key === 'Enter') $('btn-start').click(); });

/* ===== START GAME ===== */
function startGame() {
  state.levelIndex = 0;
  resetLevelState();

  showScreen('screen-game');
  $('header-level').textContent = getCurrentLevel().label;
  $('header-team').textContent = state.teamName;
  renderStaticScoreLabels();
  updateScore();
  renderNav();
  loadEnigma(0);
  startTimer();
}

/* ===== TIMER ===== */
function startTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    renderTimer();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      endGame(false);
    }
  }, 1000);
  renderTimer();
}

function renderTimer() {
  const m = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
  const s = (state.timeLeft % 60).toString().padStart(2, '0');
  const display = $('timer-display');
  display.textContent = `⏱ ${m}:${s}`;
  display.className = 'timer-display';
  if (state.timeLeft <= 300) display.classList.add('warning');
  if (state.timeLeft <= 60) display.classList.add('danger');
}

/* ===== SCORE ===== */
function updateScore() {
  const total = state.scores.reduce((a, b) => a + b, 0);
  $('header-score').textContent = `${total} pts`;
}

/* ===== NAVIGATION ===== */
function renderNav() {
  const nav = $('enigma-nav');
  nav.innerHTML = '';
  getCurrentEnigmas().forEach((e, i) => {
    const btn = el('button', 'nav-dossier');
    if (i === state.currentEnigma) btn.classList.add('active');
    if (state.solved[i]) btn.classList.add('solved');
    btn.innerHTML = `<span class="nav-num">Dossier ${i + 1}</span>
      <span class="nav-icon">${e.icon}</span>
      <span class="nav-label">${e.notion}</span>`;
    btn.addEventListener('click', () => { if (!btn.classList.contains('locked')) loadEnigma(i); });
    nav.appendChild(btn);
  });
}

/* ===== PROGRESS BAR ===== */
function renderProgress() {
  const container = $('progress-steps');
  container.innerHTML = '';
  getCurrentEnigmas().forEach((_, i) => {
    const step = el('div', 'progress-step');
    if (state.solved[i]) step.classList.add('done');
    else if (i === state.currentEnigma) step.classList.add('current');
    container.appendChild(step);
  });
  const solved = state.solved.filter(Boolean).length;
  $('progress-label').textContent = `${solved}/${getEnigmaCount()} dossiers résolus`;
}

/* ===== LOAD ENIGMA ===== */
function loadEnigma(idx) {
  state.currentEnigma = idx;
  const eng = getCurrentEnigmas()[idx];
  const content = $('enigma-content');
  state.matchSel = { gauche: null, droite: null };

  // Après épuisement des essais, l'élève peut revenir au dossier et recommencer.
  if (!state.solved[idx] && state.exhausted[idx]) {
    state.attempts[idx] = 0;
    state.validated[idx] = false;
    state.matchedPairsByEnigma[idx] = [];
    state.exhausted[idx] = false;
  }

  renderNav();
  renderProgress();
  updateHintBar();

  content.innerHTML = '';
  const card = el('div', 'dossier-card');

  // Header
  const header = el('div', 'dossier-header');
  header.innerHTML = `
    <div class="dossier-num">Dossier ${eng.id} — ${eng.notion}</div>
    <h2>${eng.icon} ${eng.titre}</h2>
    <span class="dossier-notion">${eng.points} points</span>
  `;
  card.appendChild(header);

  // Document
  const doc = el('div', 'document-zone');
  doc.innerHTML = eng.document;
  card.appendChild(doc);

  // Mission
  const mission = el('div', 'mission-zone');
  mission.innerHTML = `<h4>🎯 Mission</h4><div class="mission-text">${eng.mission}</div>`;
  card.appendChild(mission);

  // Hint box
  const hintBox = el('div', 'hint-box');
  hintBox.id = `hint-box-${idx}`;
  if (state.hints[idx]) {
    hintBox.textContent = `💡 Indice : ${eng.indice}`;
    hintBox.classList.add('show');
  }
  card.appendChild(hintBox);

  // Answer zone
  const answer = el('div', 'answer-zone');
  const attemptsLeft = eng.tentativesMax - state.attempts[idx];
  answer.innerHTML = `<h4>✏️ Votre réponse
    <span class="attempts-info">
      <span class="badge badge-attempts">⚡ ${attemptsLeft} essai(s) restant(s)</span>
      <span class="badge badge-points">🏆 ${eng.points} pts</span>
    </span>
  </h4>`;

  // Render question type
  switch (eng.type) {
    case 'qcm':    renderQCM(eng, idx, answer); break;
    case 'multi':  renderMulti(eng, idx, answer); break;
    case 'ordering': renderOrdering(eng, idx, answer); break;
    case 'fill':   renderFill(eng, idx, answer); break;
    case 'matching': renderMatching(eng, idx, answer); break;
    case 'crossword': renderCrossword(eng, idx, answer); break;
  }
  card.appendChild(answer);

  // Feedback
  const feedback = el('div', 'feedback-box');
  feedback.id = `feedback-${idx}`;
  card.appendChild(feedback);

  // Actions
  const actions = el('div', 'action-row');
  const btnVal = el('button', 'btn-validate', '✓ Valider ma réponse');
  btnVal.id = `btn-validate-${idx}`;
  if (state.validated[idx]) btnVal.disabled = true;
  btnVal.addEventListener('click', () => validateEnigma(idx));

  const isLast = idx >= getEnigmaCount() - 1;
  const btnNext = el('button', 'btn-next', isLast ? '🏁 Terminer' : 'Dossier suivant →');
  btnNext.id = `btn-next-${idx}`;
  if (state.validated[idx]) { btnNext.style.display = 'block'; }
  btnNext.addEventListener('click', () => {
    if (!isLast) loadEnigma(idx + 1);
    else endGame(true);
  });

  actions.appendChild(btnVal);
  actions.appendChild(btnNext);
  card.appendChild(actions);

  content.appendChild(card);

  // Restore validated state visually
  if (state.validated[idx]) {
    restoreValidatedState(idx);
  }
}

/* ===== QCM ===== */
function renderQCM(eng, idx, container) {
  eng.question && container.insertAdjacentHTML('beforeend', `<p style="font-size:14px;color:var(--text-light);margin-bottom:10px;">${eng.question}</p>`);
  const grid = el('div', 'qcm-grid');
  eng.options.forEach((opt, i) => {
    const btn = el('div', 'qcm-option');
    btn.dataset.idx = i;
    btn.innerHTML = `<span class="qcm-letter">${opt.lettre}</span><span class="qcm-text">${opt.texte}</span>`;
    btn.addEventListener('click', () => {
      if (state.validated[idx]) return;
      grid.querySelectorAll('.qcm-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    grid.appendChild(btn);
  });
  container.appendChild(grid);
}

/* ===== MULTI-SELECT ===== */
function renderMulti(eng, idx, container) {
  eng.question && container.insertAdjacentHTML('beforeend', `<p style="font-size:14px;color:var(--text-light);margin-bottom:10px;">${eng.question}</p>`);
  eng.options.forEach((opt, i) => {
    const item = el('div', 'multi-check');
    item.dataset.idx = i;
    item.innerHTML = `<span class="multi-checkbox"></span><span class="multi-text" style="font-size:14px;">${opt.texte}</span>`;
    item.addEventListener('click', () => {
      if (state.validated[idx]) return;
      item.classList.toggle('selected');
      item.querySelector('.multi-checkbox').textContent = item.classList.contains('selected') ? '✓' : '';
    });
    container.appendChild(item);
  });
}

/* ===== ORDERING (drag & drop) ===== */
function renderOrdering(eng, idx, container) {
  container.insertAdjacentHTML('beforeend', `<p style="font-size:13px;color:var(--text-light);margin-bottom:10px;">Glissez-déposez les étapes dans le bon ordre chronologique :</p>`);
  const list = el('div', 'ordering-list');
  list.id = `ordering-${idx}`;

  // Shuffle items for initial display
  const shuffled = eng.items.map((text, i) => ({ text, origIdx: i }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  shuffled.forEach((item, pos) => {
    const div = el('div', 'ordering-item');
    div.draggable = true;
    div.dataset.origIdx = item.origIdx;
    div.innerHTML = `<span class="order-handle">⠿</span>
      <span class="order-num">${pos + 1}</span>
      <span class="order-text">${item.text}</span>`;

    div.addEventListener('dragstart', e => {
      state.dragSrc = div;
      div.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      // Clear correct/wrong colours so the user gets a fresh visual slate
      list.querySelectorAll('.ordering-item').forEach(el => el.classList.remove('correct', 'wrong'));
    });
    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
      list.querySelectorAll('.ordering-item').forEach(el => el.classList.remove('drag-over'));
      renumberOrdering(list);
    });
    div.addEventListener('dragover', e => {
      e.preventDefault();
      if (div !== state.dragSrc) { div.classList.add('drag-over'); }
    });
    div.addEventListener('dragleave', () => div.classList.remove('drag-over'));
    div.addEventListener('drop', e => {
      e.preventDefault();
      if (state.dragSrc && div !== state.dragSrc) {
        const items = [...list.querySelectorAll('.ordering-item')];
        const srcPos = items.indexOf(state.dragSrc);
        const dstPos = items.indexOf(div);
        if (srcPos < dstPos) list.insertBefore(state.dragSrc, div.nextSibling);
        else list.insertBefore(state.dragSrc, div);
      }
    });
    list.appendChild(div);
  });
  container.appendChild(list);
}

function renumberOrdering(list) {
  list.querySelectorAll('.ordering-item').forEach((item, i) => {
    item.querySelector('.order-num').textContent = i + 1;
  });
}

/* ===== FILL IN THE BLANK ===== */
function renderFill(eng, idx, container) {
  const zone = el('div', 'fill-container');
  eng.champs.forEach((champ, i) => {
    const row = el('div', 'fill-row');
    row.innerHTML = `<span class="fill-label">${champ.label}</span>`;
    const input = el('input');
    input.type = 'text';
    input.className = 'fill-input';
    input.id = `fill-${idx}-${i}`;
    input.placeholder = champ.placeholder;
    row.appendChild(input);
    if (champ.unite && champ.unite !== '= ?') {
      row.appendChild(el('span', 'number-unit', champ.unite));
    }
    zone.appendChild(row);
  });
  container.appendChild(zone);
}

/* ===== MATCHING ===== */
function renderMatching(eng, idx, container) {
  container.insertAdjacentHTML('beforeend', `<p style="font-size:13px;color:var(--text-light);margin-bottom:10px;">Cliquez sur un élément de gauche, puis sur l'élément de droite correspondant :</p>`);
  const wrap = el('div', 'matching-container');
  const leftCol = el('div', 'matching-col');
  leftCol.innerHTML = '<h5>Situation</h5>';
  const rightCol = el('div', 'matching-col');
  rightCol.innerHTML = '<h5>Nature juridique</h5>';

  eng.gauche.forEach((text, i) => {
    const item = el('div', 'matching-item');
    item.dataset.side = 'gauche';
    item.dataset.idx = i;
    item.textContent = text;
    item.addEventListener('click', () => handleMatchClick(item, idx, eng));
    leftCol.appendChild(item);
  });

  // Shuffle droite for display
  const droiteOrder = eng.droite.map((t, i) => i);
  for (let i = droiteOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [droiteOrder[i], droiteOrder[j]] = [droiteOrder[j], droiteOrder[i]];
  }

  droiteOrder.forEach(origIdx => {
    const item = el('div', 'matching-item');
    item.dataset.side = 'droite';
    item.dataset.idx = origIdx;
    item.textContent = eng.droite[origIdx];
    item.addEventListener('click', () => handleMatchClick(item, idx, eng));
    rightCol.appendChild(item);
  });

  wrap.appendChild(leftCol);
  wrap.appendChild(rightCol);
  container.appendChild(wrap);
}

/* ===== CROSSWORD ===== */
function buildCrosswordCells(eng) {
  const cells = new Map();
  const starts = new Map();
  eng.words.forEach(word => {
    const dr = word.dir === 'V' ? 1 : 0;
    const dc = word.dir === 'H' ? 1 : 0;
    starts.set(`${word.row}-${word.col}`, word.numero);
    for (let i = 0; i < word.reponse.length; i++) {
      const row = word.row + dr * i;
      const col = word.col + dc * i;
      cells.set(`${row}-${col}`, word.reponse[i]);
    }
  });
  return { cells, starts };
}

function renderCrossword(eng, idx, container) {
  const { cells, starts } = buildCrosswordCells(eng);
  const wrap = el('div', 'crossword-wrap');
  const grid = el('div', 'crossword-grid');
  grid.style.gridTemplateColumns = `repeat(${eng.cols}, minmax(0, 1fr))`;

  for (let row = 0; row < eng.rows; row++) {
    for (let col = 0; col < eng.cols; col++) {
      const key = `${row}-${col}`;
      const cell = el('div', cells.has(key) ? 'crossword-cell' : 'crossword-cell blocked');
      if (cells.has(key)) {
        const number = starts.get(key);
        if (number) cell.appendChild(el('span', 'crossword-num', number));
        const input = el('input');
        input.type = 'text';
        input.maxLength = 1;
        input.autocomplete = 'off';
        input.inputMode = 'text';
        input.id = `cw-${idx}-${row}-${col}`;
        input.dataset.answer = cells.get(key);
        input.addEventListener('input', () => {
          input.value = normalizeAnswer(input.value).slice(0, 1);
          input.classList.remove('correct', 'wrong');
        });
        cell.appendChild(input);
      }
      grid.appendChild(cell);
    }
  }

  const clues = el('div', 'crossword-clues');
  clues.innerHTML = '<h5>Définitions</h5>';
  eng.words.forEach(word => {
    const clue = el('div', 'crossword-clue');
    clue.innerHTML = `<strong>${word.numero} ${word.dir === 'H' ? 'Horizontal' : 'Vertical'}.</strong> ${word.indice}`;
    clues.appendChild(clue);
  });

  wrap.appendChild(grid);
  wrap.appendChild(clues);
  container.appendChild(wrap);
}

function handleMatchClick(item, enigmaIdx, eng) {
  if (state.validated[enigmaIdx]) return;
  const side = item.dataset.side;
  const i = parseInt(item.dataset.idx);
  const pairs = state.matchedPairsByEnigma[enigmaIdx];

  if (side === 'gauche') {
    document.querySelectorAll('.matching-item[data-side="gauche"]').forEach(el => el.classList.remove('selected'));
    item.classList.add('selected');
    state.matchSel.gauche = i;
  } else {
    if (state.matchSel.gauche === null) return;
    // Register pair (replace any existing pair for same gauche or droite)
    const filtered = pairs.filter(p => p.g !== state.matchSel.gauche && p.d !== i);
    filtered.push({ g: state.matchSel.gauche, d: i });
    state.matchedPairsByEnigma[enigmaIdx] = filtered;
    // Update visual: mark all matched pairs
    document.querySelectorAll('.matching-item').forEach(el => {
      el.classList.remove('selected');
      el.style.background = '';
      el.style.borderColor = '';
    });
    filtered.forEach(p => {
      document.querySelectorAll(`.matching-item[data-side="gauche"][data-idx="${p.g}"]`).forEach(el => el.classList.add('selected'));
      document.querySelectorAll(`.matching-item[data-side="droite"][data-idx="${p.d}"]`).forEach(el => el.classList.add('selected'));
    });
    state.matchSel.gauche = null;
    state.matchSel.droite = null;
  }
}

/* ===== VALIDATE ===== */
function validateEnigma(idx) {
  if (state.validated[idx]) return;
  const eng = getCurrentEnigmas()[idx];
  state.attempts[idx]++;

  let isCorrect = false;
  switch (eng.type) {
    case 'qcm':    isCorrect = validateQCM(eng, idx); break;
    case 'multi':  isCorrect = validateMulti(eng, idx); break;
    case 'ordering': isCorrect = validateOrdering(eng, idx, state.attempts[idx] >= eng.tentativesMax); break;
    case 'fill':   isCorrect = validateFill(eng, idx, state.attempts[idx] >= eng.tentativesMax); break;
    case 'matching': isCorrect = validateMatching(eng, idx, state.attempts[idx] >= eng.tentativesMax); break;
    case 'crossword': isCorrect = validateCrossword(eng, idx, state.attempts[idx] >= eng.tentativesMax); break;
  }

  if (isCorrect === null) {
    state.attempts[idx]--;
    return;
  }

  if (isCorrect) {
    // Calculate score
    let pts = eng.points;
    pts -= (state.attempts[idx] - 1) * SCORING.malusEssai;
    if (state.hints[idx]) pts -= SCORING.malusIndice;
    pts = Math.max(pts, Math.floor(eng.points * 0.3)); // floor at 30%
    state.scores[idx] = pts;
    state.solved[idx] = true;
    state.validated[idx] = true;
    state.exhausted[idx] = false;
    updateScore();
    renderNav();
    renderProgress();
    showFeedback(idx, true, eng, pts);
    lockValidate(idx);
    showUnlock(eng, idx, pts);
  } else {
    const left = eng.tentativesMax - state.attempts[idx];
    if (left <= 0) {
      // Tentatives épuisées : on montre la correction mais on ne verrouille pas définitivement
      // L'élève peut revenir sur ce dossier et recommencer depuis le début
      state.exhausted[idx] = true;
      showFeedback(idx, false, eng, 0, true);
      const btn = $(`btn-validate-${idx}`);
      if (btn) btn.disabled = true;
      showNextBtn(idx);
    } else {
      showFeedback(idx, false, eng, 0, false, left);
    }
  }
  // Update attempts badge
  const badge = document.querySelector(`#btn-validate-${idx}`)?.closest('.dossier-card')?.querySelector('.badge-attempts');
  if (badge) badge.textContent = `⚡ ${Math.max(0, eng.tentativesMax - state.attempts[idx])} essai(s) restant(s)`;
}

function lockValidate(idx) {
  const btn = $(`btn-validate-${idx}`);
  if (btn) btn.disabled = true;
  showNextBtn(idx);
}

function showNextBtn(idx) {
  const btn = $(`btn-next-${idx}`);
  if (btn) btn.style.display = 'block';
}

/* ===== VALIDATE QCM ===== */
function validateQCM(eng, idx) {
  const selected = document.querySelector(`#enigma-content .qcm-option.selected`);
  if (!selected) {
    showFeedbackMsg(idx, 'Sélectionnez une réponse avant de valider.', false);
    return null;
  }
  const choice = parseInt(selected.dataset.idx);
  const correct = choice === eng.reponse;
  document.querySelectorAll('#enigma-content .qcm-option').forEach((opt, i) => {
    if (i === eng.reponse) opt.classList.add('correct');
    else if (i === choice && !correct) opt.classList.add('wrong');
  });
  return correct;
}

/* ===== VALIDATE MULTI ===== */
function validateMulti(eng, idx) {
  const selected = [...document.querySelectorAll('#enigma-content .multi-check.selected')].map(el => parseInt(el.dataset.idx));
  if (selected.length === 0) {
    showFeedbackMsg(idx, 'Cochez au moins une proposition avant de valider.', false);
    return null;
  }
  selected.sort();
  const expected = [...eng.reponses].sort();
  const correct = JSON.stringify(selected) === JSON.stringify(expected);
  document.querySelectorAll('#enigma-content .multi-check').forEach((item, i) => {
    const isSelected = selected.includes(i);
    const isExpected = eng.reponses.includes(i);
    if (isExpected) item.classList.add('correct');
    else if (isSelected) item.classList.add('wrong');
  });
  return correct;
}

/* ===== VALIDATE ORDERING ===== */
function validateOrdering(eng, idx, lastAttempt) {
  const list = $(`ordering-${idx}`);
  if (!list) return false;
  const items = [...list.querySelectorAll('.ordering-item')];
  const userOrder = items.map(el => parseInt(el.dataset.origIdx));
  const correct = JSON.stringify(userOrder) === JSON.stringify(eng.ordre);
  items.forEach((item, pos) => {
    item.classList.remove('correct', 'wrong');
    const origIdx = parseInt(item.dataset.origIdx);
    if (eng.ordre[pos] === origIdx) {
      item.classList.add('correct');
    } else {
      item.classList.add('wrong');
    }
    if (correct || lastAttempt) item.draggable = false;
  });
  return correct;
}

/* ===== VALIDATE FILL ===== */
function validateFill(eng, idx, lastAttempt) {
  const missing = eng.champs.some((_, i) => {
    const input = $(`fill-${idx}-${i}`);
    return input && !input.disabled && !input.value.trim();
  });
  if (missing) {
    showFeedbackMsg(idx, 'Complétez tous les champs avant de valider.', false);
    return null;
  }

  let allCorrect = true;
  eng.champs.forEach((champ, i) => {
    const input = $(`fill-${idx}-${i}`);
    if (!input || input.disabled) return;
    input.classList.remove('correct', 'wrong');
    const val = input.value.trim().toLowerCase().replace(/\s+/g, '');
    const valid = champ.reponsesValides.some(r => r.toLowerCase().replace(/\s+/g, '') === val);
    if (valid) {
      input.classList.add('correct');
      input.disabled = true;
    } else {
      input.classList.add('wrong');
      allCorrect = false;
      if (lastAttempt) input.disabled = true;
    }
  });
  return allCorrect;
}

/* ===== VALIDATE MATCHING ===== */
function validateMatching(eng, idx, lastAttempt) {
  const pairs = state.matchedPairsByEnigma[idx];
  if (pairs.length < eng.gauche.length) {
    showFeedbackMsg(idx, `Associez tous les éléments (${pairs.length}/${eng.gauche.length} fait(s)).`, false);
    return null;
  }
  let allCorrect = true;
  const correctPairs = [];
  const wrongPairs = [];

  pairs.forEach(pair => {
    const correct = eng.correspondances[pair.g] === pair.d;
    const leftEl = document.querySelector(`.matching-item[data-side="gauche"][data-idx="${pair.g}"]`);
    const rightEl = document.querySelector(`.matching-item[data-side="droite"][data-idx="${pair.d}"]`);
    leftEl?.classList.remove('selected');
    rightEl?.classList.remove('selected');
    if (correct) {
      leftEl?.classList.add('matched-correct');
      rightEl?.classList.add('matched-correct');
      correctPairs.push(pair);
    } else {
      leftEl?.classList.add('matched-wrong');
      rightEl?.classList.add('matched-wrong');
      wrongPairs.push(pair);
      allCorrect = false;
    }
  });

  // On a non-final failed attempt: show red briefly, then unlock wrong pairs for retry
  if (!allCorrect && !lastAttempt) {
    setTimeout(() => {
      wrongPairs.forEach(pair => {
        document.querySelector(`.matching-item[data-side="gauche"][data-idx="${pair.g}"]`)?.classList.remove('matched-wrong');
        document.querySelector(`.matching-item[data-side="droite"][data-idx="${pair.d}"]`)?.classList.remove('matched-wrong');
      });
      state.matchedPairsByEnigma[idx] = correctPairs;
    }, 1200);
  }

  return allCorrect;
}

/* ===== VALIDATE CROSSWORD ===== */
function validateCrossword(eng, idx, lastAttempt) {
  const inputs = [...document.querySelectorAll(`#enigma-content input[id^="cw-${idx}-"]`)];
  if (inputs.some(input => !input.value.trim())) {
    showFeedbackMsg(idx, 'Complétez toutes les cases du mot croisé avant de valider.', false);
    return null;
  }

  let allCorrect = true;
  inputs.forEach(input => {
    input.classList.remove('correct', 'wrong');
    const isCorrect = normalizeAnswer(input.value) === input.dataset.answer;
    input.classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) allCorrect = false;
    if (isCorrect || lastAttempt) input.disabled = true;
  });
  return allCorrect;
}

/* ===== FEEDBACK ===== */
function showFeedback(idx, success, eng, pts, exhausted = false, left = 0) {
  const box = $(`feedback-${idx}`);
  if (!box) return;
  box.style.display = 'block';
  if (success) {
    box.className = 'feedback-box success';
    box.innerHTML = `<div class="feedback-title">✅ Dossier résolu ! +${pts} points</div>
      <div class="feedback-explication">📚 ${eng.explication}</div>`;
  } else if (exhausted) {
    box.className = 'feedback-box error';
    box.innerHTML = `<div class="feedback-title">❌ Dossier non résolu — 0 point</div>
      <div class="feedback-explication">📚 Correction : ${eng.explication}</div>`;
  } else {
    box.className = 'feedback-box error';
    box.innerHTML = `<div class="feedback-title">⚠️ Réponse incorrecte — il vous reste ${left} essai(s)</div>`;
  }
}

function showFeedbackMsg(idx, msg, success) {
  const box = $(`feedback-${idx}`);
  if (!box) return;
  box.style.display = 'block';
  box.className = `feedback-box ${success ? 'success' : 'error'}`;
  box.innerHTML = `<div class="feedback-title">${msg}</div>`;
}

/* ===== HINTS ===== */
function updateHintBar() {
  const left = state.hintsMax - state.hintsUsed;
  $('hint-count').textContent = `💡 Indices disponibles : ${left}`;
  const btn = $('btn-hint');
  btn.disabled = left <= 0 || state.hints[state.currentEnigma];
}

$('btn-hint').addEventListener('click', () => {
  const idx = state.currentEnigma;
  if (state.hints[idx] || state.hintsUsed >= state.hintsMax) return;
  state.hints[idx] = true;
  state.hintsUsed++;
  const box = $(`hint-box-${idx}`);
  if (box) {
    box.textContent = `💡 Indice : ${getCurrentEnigmas()[idx].indice}`;
    box.classList.add('show');
  }
  updateHintBar();
});

/* ===== UNLOCK ANIMATION ===== */
function showUnlock(eng, idx, pts) {
  const overlay = $('unlock-overlay');
  $('unlock-icon').textContent = '🔓';
  $('unlock-title').textContent = 'Dossier résolu !';
  $('unlock-sub').textContent = eng.titre;
  $('unlock-score').textContent = `+${pts} points — ${getEnigmaCount() - state.solved.filter(Boolean).length} dossier(s) restant(s)`;
  overlay.classList.add('show');
}

$('btn-unlock-continue').addEventListener('click', () => {
  $('unlock-overlay').classList.remove('show');
  const nextUnsolved = state.solved.findIndex((s, i) => !s && i > state.currentEnigma);
  if (nextUnsolved !== -1) loadEnigma(nextUnsolved);
  else {
    const anyUnsolved = state.solved.findIndex(s => !s);
    if (anyUnsolved !== -1) loadEnigma(anyUnsolved);
    else endGame(true);
  }
});

/* ===== RESTORE VALIDATED STATE ===== */
function restoreValidatedState(idx) {
  // Just show next btn — visual restore handled by re-render
  showNextBtn(idx);
}

/* ===== END GAME ===== */
function endGame(completed) {
  clearInterval(state.timerInterval);
  const elapsed = GAME_DURATION - state.timeLeft;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const total = state.scores.reduce((a, b) => a + b, 0);
  const maxPts = getMaxPoints();
  const pct = Math.round((total / maxPts) * 100);

  // Render results
  let icon = '🏆', titre = 'Excellent !', mention = 'Félicitations — Entreprise sauvée !';
  if (pct >= 80) { icon = '🥇'; titre = 'Expert en droit social !'; mention = '🌟 Mention Très Bien — L\'inspection est ravie !'; }
  else if (pct >= 60) { icon = '🥈'; titre = 'Bon travail !'; mention = '👍 Mention Bien — Quelques sanctions légères...'; }
  else if (pct >= 40) { icon = '🥉'; titre = 'Peut mieux faire'; mention = '⚠️ Mention Passable — L\'inspection impose un plan de correction'; }
  else { icon = '📛'; titre = 'Dossiers non maîtrisés'; mention = '❌ Échec — L\'entreprise risque de lourdes sanctions !'; }

  $('results-icon').textContent = icon;
  $('results-title').textContent = completed ? getCurrentLevel().resultTitle : titre;
  $('results-sub').textContent = completed ? `Tous les dossiers du ${getCurrentLevel().label.toLowerCase()} sont traités` : `Temps écoulé — ${state.solved.filter(Boolean).length}/${getEnigmaCount()} dossiers résolus`;
  $('results-score-val').textContent = total;
  $('results-score-max').textContent = `/ ${maxPts} pts`;
  $('results-time').textContent = `Temps utilisé : ${mins}m ${secs.toString().padStart(2,'0')}s`;
  $('results-mention').textContent = mention;

  const breakdown = $('results-breakdown');
  breakdown.innerHTML = '<h3>Détail par dossier</h3>';
  getCurrentEnigmas().forEach((eng, i) => {
    const row = el('div', 'result-row');
    row.innerHTML = `<span class="result-status">${state.solved[i] ? '✅' : '❌'}</span>
      <span class="result-name">${eng.titre}</span>
      <span class="result-pts">${state.scores[i]} pts</span>`;
    breakdown.appendChild(row);
  });

  showScreen('screen-results');
  const nextLevelBtn = $('btn-next-level');
  if (nextLevelBtn) {
    const nextLevel = LEVELS[state.levelIndex + 1];
    const allSolved = state.solved.every(Boolean);
    nextLevelBtn.style.display = completed && allSolved && nextLevel ? 'block' : 'none';
    if (nextLevel) {
      nextLevelBtn.textContent = nextLevel.label === 'Mission finale' ? '🧩 Débloquer la mission finale' : `🔓 Débloquer ${nextLevel.label.toLowerCase()}`;
    }
  }
}

$('btn-next-level').addEventListener('click', () => {
  if (state.levelIndex >= LEVELS.length - 1) return;
  state.levelIndex++;
  resetLevelState();
  showScreen('screen-game');
  $('header-level').textContent = getCurrentLevel().label;
  renderStaticScoreLabels();
  updateScore();
  renderNav();
  loadEnigma(0);
  startTimer();
});

$('btn-restart').addEventListener('click', () => {
  state.levelIndex = 0;
  renderStaticScoreLabels();
  showScreen('screen-welcome');
});

/* ===== GLOSSARY ===== */
function renderGlossary() {
  const list = $('glossary-list');
  if (!list) return;
  list.innerHTML = '';
  GLOSSARY.forEach(item => {
    const entry = el('div', 'glossary-entry');
    entry.innerHTML = `<h4>${item.terme}</h4><p>${item.definition}</p>`;
    list.appendChild(entry);
  });
}

$('btn-glossary').addEventListener('click', () => {
  renderGlossary();
  $('glossary-modal').classList.add('show');
});

$('btn-glossary-close').addEventListener('click', () => {
  $('glossary-modal').classList.remove('show');
});

$('glossary-modal').addEventListener('click', event => {
  if (event.target === $('glossary-modal')) {
    $('glossary-modal').classList.remove('show');
  }
});

/* ===== INIT ===== */
renderStaticScoreLabels();
renderProgress();

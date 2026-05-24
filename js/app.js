/* ===== ESCAPE ROOM — RUPTURE CONTRAT DE TRAVAIL ===== */

const GAME_DURATION = 40 * 60; // 40 minutes en secondes

const state = {
  teamName: '',
  timerInterval: null,
  timeLeft: GAME_DURATION,
  currentEnigma: 0,
  solved: Array(6).fill(false),
  scores: Array(6).fill(0),
  hints: Array(6).fill(false),
  hintsUsed: 0,
  hintsMax: 3,
  attempts: Array(6).fill(0),
  dragSrc: null,
  matchSel: { gauche: null, droite: null },
  matchedPairsByEnigma: Array(6).fill(null).map(() => []),
  validated: Array(6).fill(false),
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
  state.timeLeft = GAME_DURATION;
  state.currentEnigma = 0;
  state.solved = Array(6).fill(false);
  state.scores = Array(6).fill(0);
  state.hints = Array(6).fill(false);
  state.hintsUsed = 0;
  state.attempts = Array(6).fill(0);
  state.validated = Array(6).fill(false);
  state.matchSel = { gauche: null, droite: null };
  state.matchedPairsByEnigma = Array(6).fill(null).map(() => []);
  state.startTime = Date.now();

  showScreen('screen-game');
  $('header-team').textContent = state.teamName;
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
  ENIGMAS.forEach((e, i) => {
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
  ENIGMAS.forEach((_, i) => {
    const step = el('div', 'progress-step');
    if (state.solved[i]) step.classList.add('done');
    else if (i === state.currentEnigma) step.classList.add('current');
    container.appendChild(step);
  });
  const solved = state.solved.filter(Boolean).length;
  $('progress-label').textContent = `${solved}/6 dossiers résolus`;
}

/* ===== LOAD ENIGMA ===== */
function loadEnigma(idx) {
  state.currentEnigma = idx;
  const eng = ENIGMAS[idx];
  const content = $('enigma-content');
  state.matchSel = { gauche: null, droite: null };

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

  const btnNext = el('button', 'btn-next', idx < 5 ? 'Dossier suivant →' : '🏁 Terminer');
  btnNext.id = `btn-next-${idx}`;
  if (state.validated[idx]) { btnNext.style.display = 'block'; }
  btnNext.addEventListener('click', () => {
    if (idx < 5) loadEnigma(idx + 1);
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
  const eng = ENIGMAS[idx];
  state.attempts[idx]++;

  let isCorrect = false;
  switch (eng.type) {
    case 'qcm':    isCorrect = validateQCM(eng, idx); break;
    case 'multi':  isCorrect = validateMulti(eng, idx); break;
    case 'ordering': isCorrect = validateOrdering(eng, idx); break;
    case 'fill':   isCorrect = validateFill(eng, idx, state.attempts[idx] >= eng.tentativesMax); break;
    case 'matching': isCorrect = validateMatching(eng, idx); break;
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
    updateScore();
    showFeedback(idx, true, eng, pts);
    lockValidate(idx);
    showUnlock(eng, idx, pts);
  } else {
    const left = eng.tentativesMax - state.attempts[idx];
    if (left <= 0) {
      // No more attempts
      state.scores[idx] = 0;
      state.validated[idx] = true;
      showFeedback(idx, false, eng, 0, true);
      lockValidate(idx);
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
  if (!selected) return false;
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
function validateOrdering(eng, idx) {
  const list = $(`ordering-${idx}`);
  if (!list) return false;
  const items = [...list.querySelectorAll('.ordering-item')];
  const userOrder = items.map(el => parseInt(el.dataset.origIdx));
  const correctOrder = eng.ordre.map(i => eng.items[i]).map((_, i) => eng.ordre[i]);
  // Compare positions
  const correct = JSON.stringify(userOrder) === JSON.stringify(eng.ordre);
  items.forEach((item, pos) => {
    const origIdx = parseInt(item.dataset.origIdx);
    if (eng.ordre[pos] === origIdx) item.classList.add('correct');
    else item.classList.add('wrong');
  });
  return correct;
}

/* ===== VALIDATE FILL ===== */
function validateFill(eng, idx, lastAttempt) {
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
function validateMatching(eng, idx) {
  const pairs = state.matchedPairsByEnigma[idx];
  if (pairs.length < eng.gauche.length) {
    showFeedbackMsg(idx, `Associez tous les éléments (${pairs.length}/${eng.gauche.length} fait(s)).`, false);
    state.attempts[idx]--;
    return false;
  }
  let allCorrect = true;
  pairs.forEach(pair => {
    const correct = eng.correspondances[pair.g] === pair.d;
    const leftEl = document.querySelector(`.matching-item[data-side="gauche"][data-idx="${pair.g}"]`);
    const rightEl = document.querySelector(`.matching-item[data-side="droite"][data-idx="${pair.d}"]`);
    if (correct) {
      leftEl?.classList.add('matched-correct');
      rightEl?.classList.add('matched-correct');
    } else {
      leftEl?.classList.add('matched-wrong');
      rightEl?.classList.add('matched-wrong');
      allCorrect = false;
    }
    leftEl?.classList.remove('selected');
    rightEl?.classList.remove('selected');
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
    box.textContent = `💡 Indice : ${ENIGMAS[idx].indice}`;
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
  $('unlock-score').textContent = `+${pts} points — ${6 - state.solved.filter(Boolean).length} dossier(s) restant(s)`;
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
  const maxPts = ENIGMAS.reduce((a, e) => a + e.points, 0);
  const pct = Math.round((total / maxPts) * 100);

  // Render results
  let icon = '🏆', titre = 'Excellent !', mention = 'Félicitations — Entreprise sauvée !';
  if (pct >= 80) { icon = '🥇'; titre = 'Expert en droit social !'; mention = '🌟 Mention Très Bien — L\'inspection est ravie !'; }
  else if (pct >= 60) { icon = '🥈'; titre = 'Bon travail !'; mention = '👍 Mention Bien — Quelques sanctions légères...'; }
  else if (pct >= 40) { icon = '🥉'; titre = 'Peut mieux faire'; mention = '⚠️ Mention Passable — L\'inspection impose un plan de correction'; }
  else { icon = '📛'; titre = 'Dossiers non maîtrisés'; mention = '❌ Échec — L\'entreprise risque de lourdes sanctions !'; }

  $('results-icon').textContent = icon;
  $('results-title').textContent = titre;
  $('results-sub').textContent = completed ? `Tous les dossiers traités` : `Temps écoulé — ${state.solved.filter(Boolean).length}/6 dossiers résolus`;
  $('results-score-val').textContent = total;
  $('results-time').textContent = `Temps utilisé : ${mins}m ${secs.toString().padStart(2,'0')}s`;
  $('results-mention').textContent = mention;

  const breakdown = $('results-breakdown');
  breakdown.innerHTML = '<h3>Détail par dossier</h3>';
  ENIGMAS.forEach((eng, i) => {
    const row = el('div', 'result-row');
    row.innerHTML = `<span class="result-status">${state.solved[i] ? '✅' : '❌'}</span>
      <span class="result-name">${eng.titre}</span>
      <span class="result-pts">${state.scores[i]} pts</span>`;
    breakdown.appendChild(row);
  });

  showScreen('screen-results');
}

$('btn-restart').addEventListener('click', () => {
  showScreen('screen-welcome');
});

/* ===== INIT ===== */
renderProgress();

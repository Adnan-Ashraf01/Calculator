
const displayEl = document.getElementById('display');

let current = '0';
let previous = null;
let operation = null;
let overwrite = false;

function updateDisplay() {
  if (operation && overwrite) {
    displayEl.textContent = previous + ' ' + operation;
  } else {
    displayEl.textContent = current;
  }
}

function inputDigit(d) {
  if (overwrite) {
    current = (d === '.') ? '0.' : d;
    overwrite = false;
  } else {
    if (d === '.' && current.includes('.')) return;
    current = (current === '0' && d !== '.') ? d : current + d;
  }
  updateDisplay();
}

function handleOperator(op) {
  if (operation && !overwrite) {
    compute();
  }
  previous = current;
  operation = op;
  overwrite = true;
  updateDisplay();
}

function compute() {
  if (operation == null || previous == null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  if (operation === '+') result = a + b;
  else if (operation === '-') result = a - b;
  else if (operation === '*') result = a * b;
  else if (operation === '/') result = (b === 0 ? 'Error' : a / b);

  current = (result === 'Error') ? result : String(roundAccurate(result));
  previous = null;
  operation = null;
  overwrite = true;
  updateDisplay();
}

function roundAccurate(n) {
  return Math.round((n + Number.EPSILON) * 1e12) / 1e12;
}

function clearAll() {
  current = '0';
  previous = null;
  operation = null;
  overwrite = false;
  updateDisplay();
}

function backspace() {
  if (overwrite || current.length <= 1) {
    current = '0';
    overwrite = false;
  } else {
    current = current.slice(0, -1);
  }
  updateDisplay();
}

function percent() {
  current = String(parseFloat(current) / 100);
  overwrite = true;
  updateDisplay();
}

function negate() {
  if (current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

/* Buttons click */
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelector('.buttons');
  if (!buttons) {
    console.error('Buttons container not found');
    return;
  }

  buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const val = btn.dataset.value;
    const action = btn.dataset.action;

    if (val) {
      if (['+', '-', '*', '/'].includes(val)) handleOperator(val);
      else inputDigit(val);
    } else if (action) {
      if (action === 'clear') clearAll();
      else if (action === 'back') backspace();
      else if (action === 'percent') percent();
      else if (action === 'neg') negate();
      else if (action === 'equals') compute();
    }
  });

  // keyboard support
  window.addEventListener('keydown', (e) => {
    if ((/\d/).test(e.key)) inputDigit(e.key);
    else if (e.key === '.') inputDigit('.');
    else if (['+', '-', '*', '/'].includes(e.key)) handleOperator(e.key);
    else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); compute(); }
    else if (e.key === 'Backspace') backspace();
    else if (e.key === 'Escape') clearAll();
  });

  updateDisplay();
});

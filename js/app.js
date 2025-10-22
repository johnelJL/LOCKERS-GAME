const lockerGrid = document.querySelector('#locker-grid');
const lockerCountInput = document.querySelector('#locker-count');
const lockerSlider = document.querySelector('#locker-slider');
const studentCountInput = document.querySelector('#student-count');
const highlightSquaresToggle = document.querySelector('#highlight-squares');
const showOpenOnlyToggle = document.querySelector('#show-open-only');
const openCountEl = document.querySelector('#open-count');
const closedCountEl = document.querySelector('#closed-count');
const openListEl = document.querySelector('#open-list');
const controlsForm = document.querySelector('#controls-form');
const resetBtn = document.querySelector('#reset-btn');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function getDivisors(number) {
  const divisors = new Set();
  for (let i = 1; i <= Math.sqrt(number); i += 1) {
    if (number % i === 0) {
      divisors.add(i);
      divisors.add(number / i);
    }
  }
  return Array.from(divisors).sort((a, b) => a - b);
}

function runSimulation(lockersCount, studentsCount) {
  const lockers = new Array(lockersCount).fill(false);
  for (let student = 1; student <= studentsCount; student += 1) {
    for (let locker = student; locker <= lockersCount; locker += student) {
      lockers[locker - 1] = !lockers[locker - 1];
    }
  }
  return lockers;
}

function isPerfectSquare(value) {
  const root = Math.sqrt(value);
  return Number.isInteger(root);
}

function render(lockerStates) {
  lockerGrid.innerHTML = '';
  const showOpenOnly = showOpenOnlyToggle.checked;
  const highlightSquares = highlightSquaresToggle.checked;

  lockerStates.forEach((isOpen, index) => {
    const lockerNumber = index + 1;
    const square = isPerfectSquare(lockerNumber);
    if (showOpenOnly && !isOpen) {
      return;
    }

    const tile = document.createElement('button');
    tile.className = 'locker-tile';
    tile.type = 'button';
    tile.dataset.state = isOpen ? 'open' : 'closed';
    tile.dataset.square = highlightSquares && square ? 'true' : 'false';
    tile.setAttribute('role', 'gridcell');
    tile.setAttribute('aria-label', `Locker ${lockerNumber} is ${isOpen ? 'open' : 'closed'}`);

    const numberEl = document.createElement('div');
    numberEl.className = 'locker-number';
    numberEl.textContent = lockerNumber;

    const stateEl = document.createElement('div');
    stateEl.className = 'locker-state';
    stateEl.textContent = isOpen ? 'Open' : 'Closed';

    const factorsEl = document.createElement('div');
    factorsEl.className = 'locker-factors';
    const divisors = getDivisors(lockerNumber).join(', ');
    factorsEl.textContent = `Factors: ${divisors}`;

    tile.append(numberEl, stateEl, factorsEl);
    lockerGrid.appendChild(tile);
  });
}

function updateSummary(lockerStates) {
  const openLockers = [];
  lockerStates.forEach((isOpen, index) => {
    if (isOpen) {
      openLockers.push(index + 1);
    }
  });

  openCountEl.textContent = openLockers.length.toLocaleString();
  closedCountEl.textContent = (lockerStates.length - openLockers.length).toLocaleString();
  openListEl.textContent = openLockers.length ? openLockers.join(', ') : 'None';
}

function simulateAndRender() {
  const lockerCount = clamp(Number(lockerCountInput.value), 1, Number(lockerCountInput.max));
  const studentCount = clamp(Number(studentCountInput.value), 1, Number(studentCountInput.max));

  lockerCountInput.value = lockerCount;
  lockerSlider.value = lockerCount;
  studentCountInput.value = studentCount;

  const states = runSimulation(lockerCount, studentCount);
  render(states);
  updateSummary(states);
}

function resetControls() {
  lockerCountInput.value = 100;
  lockerSlider.value = 100;
  studentCountInput.value = 100;
  highlightSquaresToggle.checked = true;
  showOpenOnlyToggle.checked = false;
  simulateAndRender();
}

controlsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  simulateAndRender();
});

highlightSquaresToggle.addEventListener('change', () => {
  simulateAndRender();
});

showOpenOnlyToggle.addEventListener('change', () => {
  simulateAndRender();
});

lockerSlider.addEventListener('input', () => {
  lockerCountInput.value = lockerSlider.value;
});

lockerSlider.addEventListener('change', () => {
  simulateAndRender();
});

lockerCountInput.addEventListener('change', () => {
  simulateAndRender();
});

studentCountInput.addEventListener('change', () => {
  simulateAndRender();
});

resetBtn.addEventListener('click', () => {
  resetControls();
});

window.addEventListener('DOMContentLoaded', () => {
  simulateAndRender();
});

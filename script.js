const screens = {
  welcome: document.getElementById('welcome-screen'),
  question: document.getElementById('question-screen'),
  success: document.getElementById('success-screen'),
  thankyou: document.getElementById('thankyou-screen'),
};

const welcomeForm = document.getElementById('welcome-form');
const questionForm = document.getElementById('question-form');
const optionsContainer = document.getElementById('options-container');
const questionText = document.getElementById('question-text');
const questionFeedback = document.getElementById('question-feedback');
const codeOutput = document.getElementById('code-output');
const successDetails = document.getElementById('success-details');
const thankYouMessage = document.getElementById('thankyou-message');
const successFinishButton = document.getElementById('success-finish');
const thankYouRestartButton = document.getElementById('thankyou-restart');
const currentYear = document.getElementById('current-year');

const STORAGE_KEY = 'lockersGamePlayers';
let players = loadPlayers();
let currentPlayer = null;
let currentQuestion = null;

const questions = [
  {
    text: 'How many lockers appear in the Lockers Activation logo?',
    options: ['Two', 'Three', 'Four', 'Five'],
    answerIndex: 1,
  },
  {
    text: 'Which color is featured most prominently in the Lockers brand palette?',
    options: ['Crimson', 'Emerald', 'Royal Blue', 'Sunset Orange'],
    answerIndex: 2,
  },
  {
    text: 'Lockers Activation launched in which year?',
    options: ['2018', '2019', '2020', '2021'],
    answerIndex: 2,
  },
  {
    text: 'How long does the typical Lockers campaign experience last?',
    options: ['2 minutes', '5 minutes', '10 minutes', '15 minutes'],
    answerIndex: 1,
  },
  {
    text: 'Which technology powers Lockers smart lockers?',
    options: ['NFC', 'Bluetooth', 'Facial Recognition', 'QR Codes'],
    answerIndex: 3,
  },
  {
    text: 'Where can players find the Lockers leaderboard?',
    options: ['Company blog', 'In-app dashboard', 'Welcome email', 'Printed brochure'],
    answerIndex: 1,
  },
  {
    text: 'What reward do Lockers campaigns typically distribute?',
    options: ['Gift cards', 'Stickers', 'Posters', 'Water bottles'],
    answerIndex: 0,
  },
  {
    text: 'How many attempts does a player get during Lockers activations?',
    options: ['One', 'Two', 'Three', 'Unlimited'],
    answerIndex: 0,
  },
  {
    text: 'Lockers events most often take place in which venue?',
    options: ['Corporate lobbies', 'Outdoor festivals', 'Sports arenas', 'Shopping malls'],
    answerIndex: 3,
  },
  {
    text: 'Which feature helps Lockers track participant engagement?',
    options: ['AI predictions', 'Manual surveys', 'QR code scans', 'SMS blasts'],
    answerIndex: 2,
  },
];

function loadPlayers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Unable to read stored players', error);
    return [];
  }
}

function savePlayers() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch (error) {
    console.warn('Unable to save players', error);
  }
}

function hasPlayed(email) {
  const normalized = email.trim().toLowerCase();
  return players.some((player) => player.email === normalized);
}

function recordPlay(result) {
  if (!currentPlayer) return;
  const normalizedEmail = currentPlayer.email;
  const existingIndex = players.findIndex((player) => player.email === normalizedEmail);
  const playerRecord = {
    name: currentPlayer.name,
    email: normalizedEmail,
    phone: currentPlayer.phone,
    lastPlayedAt: new Date().toISOString(),
    result,
  };

  if (existingIndex >= 0) {
    players[existingIndex] = playerRecord;
  } else {
    players.push(playerRecord);
  }
  savePlayers();
}

function showScreen(key) {
  Object.values(screens).forEach((screen) => screen.classList.remove('active'));
  screens[key].classList.add('active');
}

function resetQuestionFeedback() {
  questionFeedback.textContent = '';
}

function renderQuestion(question) {
  questionText.textContent = question.text;
  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const optionId = `option-${index}`;
    const optionWrapper = document.createElement('label');
    optionWrapper.className = 'option';
    optionWrapper.setAttribute('for', optionId);

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.value = index;
    input.id = optionId;
    input.required = true;

    const text = document.createElement('span');
    text.textContent = option;

    optionWrapper.appendChild(input);
    optionWrapper.appendChild(text);
    optionsContainer.appendChild(optionWrapper);
  });
}

function handleWelcomeSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim().toLowerCase();
  const phone = formData.get('phone').trim();

  if (!name || !email || !phone) {
    return;
  }

  currentPlayer = { name, email, phone };

  if (hasPlayed(email)) {
    thankYouMessage.textContent = 'Our records show you\'ve already played today. Thank you for checking in again!';
    showScreen('thankyou');
    return;
  }

  currentQuestion = getRandomQuestion();
  renderQuestion(currentQuestion);
  resetQuestionFeedback();
  showScreen('question');
}

function getRandomQuestion() {
  const index = Math.floor(Math.random() * questions.length);
  return questions[index];
}

function handleQuestionSubmit(event) {
  event.preventDefault();
  const selected = optionsContainer.querySelector('input[name="answer"]:checked');

  if (!selected) {
    questionFeedback.textContent = 'Please select an answer to continue.';
    return;
  }

  const answerIndex = Number(selected.value);
  const isCorrect = answerIndex === currentQuestion.answerIndex;

  if (isCorrect) {
    const code = generateFourDigitCode();
    codeOutput.textContent = code;
    successDetails.textContent = `${currentPlayer.name}, keep this code safe for your reward.`;
    recordPlay({ outcome: 'correct', code });
    showScreen('success');
  } else {
    thankYouMessage.textContent = 'Thanks for playing! Unfortunately that wasn\'t the correct answer, but we hope to see you again soon.';
    recordPlay({ outcome: 'incorrect' });
    showScreen('thankyou');
  }
}

function generateFourDigitCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function handleSuccessFinish() {
  thankYouMessage.textContent = 'Thanks for playing! Share the excitement with your friends.';
  showScreen('thankyou');
}

function handleThankYouRestart() {
  currentPlayer = null;
  currentQuestion = null;
  welcomeForm.reset();
  showScreen('welcome');
}

welcomeForm.addEventListener('submit', handleWelcomeSubmit);
questionForm.addEventListener('submit', handleQuestionSubmit);
successFinishButton.addEventListener('click', handleSuccessFinish);
thankYouRestartButton.addEventListener('click', handleThankYouRestart);

currentYear.textContent = new Date().getFullYear();

// Support returning visitors that may have already played.
(function resumeIfReturning() {
  if (!players.length) {
    return;
  }

  const emailParam = new URLSearchParams(window.location.search).get('email');
  if (!emailParam) {
    return;
  }

  const normalized = emailParam.trim().toLowerCase();
  if (hasPlayed(normalized)) {
    thankYouMessage.textContent = 'Welcome back! You have already completed the challenge.';
    showScreen('thankyou');
  }
})();

// List of Questions and Answers

var questions = [
  {
    prompt: 'What does CSS stand for?',
    options: [
      'Computer Style Sheets',
      'Cascading Style Sheets',
      'Creative Style Sheets',
      'Colorful Style Sheets',
    ],
    answer: 'Cascading Style Sheets',
  },
  {
    prompt: 'What is the correct HTML element for inserting a line break?',
    options: ['<break>', '<lb>', '<br>', '<ln>'],
    answer: '<br>',
  },
  {
    prompt:
      'Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?',
    options: ['src', 'longdesc', 'title', 'alt'],
    answer: 'alt',
  },
  {
    prompt: 'Which property is used to change the background color?',
    options: ['color', 'background-color', 'bgcolor', 'bg-color'],
    answer: 'background-color',
  },
  {
    prompt: "What does the 'this' keyword refer to in JavaScript?",
    options: [
      'The current function',
      'The global object',
      'The parent object',
      'The object that is calling the function',
    ],
    answer: 'The object that is calling the function',
  },
];

// Get Dom Elements

var questionsEl = document.querySelector('#questions');
var timerEl = document.querySelector('#timer');
var choicesEl = document.querySelector('#options');
var submitBtn = document.querySelector('#submit-score');
var startBtn = document.querySelector('#start');
var nameEl = document.querySelector('#name');
var feedbackEl = document.querySelector('#feedback');
var reStartBtn = document.querySelector('#restart');

// Quiz's initial state

var currentQuestionIndex = 0;
var time = questions.length * 20;
var timerId;

// Start quiz and hide frontpage

function quizStart() {
  timerId = setInterval(clockTick, 1000);
  timerEl.textContent = time;
  var landingScreenEl = document.getElementById('start-screen');
  landingScreenEl.setAttribute('class', 'hide');
  questionsEl.removeAttribute('class');
  getQuestion();
}

// Loop through array of questions and answers and create list with buttons

function getQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  var promptEl = document.getElementById('question-words');
  promptEl.textContent = currentQuestion.prompt;
  choicesEl.innerHTML = '';
  currentQuestion.options.forEach(function (choice, i) {
    var choiceBtn = document.createElement('button');
    choiceBtn.setAttribute('value', choice);
    choiceBtn.textContent = i + 1 + '. ' + choice;
    choiceBtn.onclick = questionClick;
    choicesEl.appendChild(choiceBtn);
  });
}

// Check for right answers and deduct time for wrong answer, go to next question

function questionClick() {
  if (this.value !== questions[currentQuestionIndex].answer) {
    time -= 10;
    if (time < 0) {
      time = 0;
    }
    timerEl.textContent = time;
    feedbackEl.textContent = `Wrong! The correct answer was ${questions[currentQuestionIndex].answer}.`;
    feedbackEl.style.color = 'red';
  } else {
    feedbackEl.textContent = 'Correct!';
    feedbackEl.style.color = 'green';
  }
  feedbackEl.setAttribute('class', 'feedback');
  setTimeout(function () {
    feedbackEl.setAttribute('class', 'feedback hide');
  }, 2000);
  currentQuestionIndex++;
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

// End quiz by hiding questions, stop timer and show final score

function quizEnd() {
  clearInterval(timerId);
  var endScreenEl = document.getElementById('quiz-end');
  endScreenEl.removeAttribute('class');
  var finalScoreEl = document.getElementById('score-final');
  finalScoreEl.textContent = time;
  questionsEl.setAttribute('class', 'hide');
}

// End quiz if timer reaches 0

function clockTick() {
  time--;
  timerEl.textContent = time;
  if (time <= 0) {
    quizEnd();
  }
}

// Save score in local storage along with users' name
function saveHighscore() {
  var name = nameEl.value.trim();
  if (name !== '') {
    var highscores =
      JSON.parse(window.localStorage.getItem('highscores')) || [];
    var newScore = {
      score: time,
      name: name,
    };
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));
    alert('Your score has been saved!');
  }
}

// Save users' score after pressing enter

function checkForEnter(event) {
  if (event.key === 'Enter') {
    saveHighscore();
  }
}
nameEl.onkeyup = checkForEnter;

// Save users' score after clicking submit

submitBtn.onclick = saveHighscore;

// Start quiz after clicking start quiz

startBtn.onclick = quizStart;

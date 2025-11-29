const questions = [
    {
        id: 1,
        prompt: 'Which JavaScript method is used to attach a function to run when a user clicks a button?',
        options: ['setTimeout()', 'addEventListener()', 'querySelector()', 'createElement()'],
        answerIndex: 1,
        explanation: 'The addEventListener method registers a specific listener on the target, such as a click handler on a button.'
    },
    {
        id: 2,
        prompt: 'What does DOM stand for?',
        options: ['Document Object Model', 'Dynamic Output Mechanism', 'Document Order Manager', 'Data Object Map'],
        answerIndex: 0,
        explanation: 'DOM stands for Document Object Model, representing the structure of HTML documents so scripts can manipulate them.'
    },
    {
        id: 3,
        prompt: 'Which CSS property makes a layout responsive by distributing space between flex items?',
        options: ['align-items', 'flex-wrap', 'justify-content', 'grid-template'],
        answerIndex: 2,
        explanation: 'justify-content controls how remaining space is distributed along the main axis in a flex container.'
    },
    {
        id: 4,
        prompt: 'In HTML forms, which attribute ensures an input must be filled before submission?',
        options: ['required', 'pattern', 'placeholder', 'minlength'],
        answerIndex: 0,
        explanation: 'Adding the required attribute tells the browser a value must be provided before the form can be submitted.'
    },
    {
        id: 5,
        prompt: 'Which array method returns a new array containing only elements that pass a test?',
        options: ['forEach()', 'filter()', 'reduce()', 'push()'],
        answerIndex: 1,
        explanation: 'filter creates a new array with elements that meet the condition defined in its callback function.'
    },
    {
        id: 6,
        prompt: 'Which HTTP status code indicates that a resource was not found?',
        options: ['200', '301', '403', '404'],
        answerIndex: 3,
        explanation: 'A 404 status code tells the client the requested resource could not be located on the server.'
    },
    {
        id: 7,
        prompt: 'What is the output type of the JavaScript method JSON.stringify()?',
        options: ['Boolean', 'Number', 'String', 'Object'],
        answerIndex: 2,
        explanation: 'JSON.stringify() converts a JavaScript value to a JSON-formatted string.'
    },
    {
        id: 8,
        prompt: 'Which CSS unit scales with the width of the viewport?',
        options: ['em', 'rem', 'vh', 'vw'],
        answerIndex: 3,
        explanation: 'The vw unit equals 1% of the viewport width, making it responsive to screen size changes.'
    },
    {
        id: 9,
        prompt: 'Which HTML element is semantic for marking navigation links?',
        options: ['<div>', '<section>', '<nav>', '<aside>'],
        answerIndex: 2,
        explanation: 'The <nav> element semantically groups primary navigation links for a document or section.'
    },
    {
        id: 10,
        prompt: 'In Git, which command creates a new branch based on the current HEAD?',
        options: ['git branch <name>', 'git merge <name>', 'git add <name>', 'git clone <name>'],
        answerIndex: 0,
        explanation: 'Running git branch <name> makes a new branch pointer at the current commit without switching to it.'
    }
];

const quizCard = document.getElementById('quizCard');
const quizSummary = document.getElementById('quizSummary');
const questionEl = document.getElementById('quizQuestion');
const optionsEl = document.getElementById('quizOptions');
const feedbackEl = document.getElementById('quizFeedback');
const progressEl = document.getElementById('quizProgress');
const liveScoreEl = document.getElementById('quizLiveScore');
const progressBarEl = document.getElementById('quizProgressBar');
const progressFillEl = document.getElementById('quizProgressFill');
const nextButton = document.getElementById('nextButton');
const restartButton = document.getElementById('restartButton');
const restartButtonSummary = document.getElementById('restartButtonSummary');
const scoreEl = document.getElementById('quizScore');
const remarkEl = document.getElementById('quizRemark');

let currentIndex = 0;
let score = 0;

function initQuiz() {
    currentIndex = 0;
    score = 0;
    quizSummary.hidden = true;
    quizCard.hidden = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'quiz__feedback';
    nextButton.disabled = true;
    nextButton.textContent = 'Next Question';
    nextButton.classList.remove('quiz__button--hidden');
    if (restartButton) {
        restartButton.disabled = false;
    }
    updateScoreDisplay();
    updateProgressBar(0);
    renderQuestion();
}

function renderQuestion() {
    const question = questions[currentIndex];
    questionEl.textContent = question.prompt;
    progressEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    updateScoreDisplay();
    updateProgressBar(currentIndex);

    nextButton.textContent = 'Next Question';

    optionsEl.innerHTML = '';
    question.options.forEach((optionText, index) => {
        const listItem = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = optionText;
        button.dataset.index = index.toString();
        button.addEventListener('click', () => handleOptionSelect(index));
        listItem.appendChild(button);
        optionsEl.appendChild(listItem);
    });

    nextButton.disabled = true;
    nextButton.classList.add('quiz__button--hidden');
    feedbackEl.textContent = '';
    feedbackEl.className = 'quiz__feedback';
}

function handleOptionSelect(selectedIndex) {
    const question = questions[currentIndex];
    const buttons = optionsEl.querySelectorAll('button');

    buttons.forEach((button) => {
        button.disabled = true;
        const buttonIndex = Number(button.dataset.index);
        if (buttonIndex === question.answerIndex) {
            button.classList.add('is-correct');
        }
        if (buttonIndex === selectedIndex && selectedIndex !== question.answerIndex) {
            button.classList.add('is-incorrect');
        }
    });

    if (selectedIndex === question.answerIndex) {
        score += 1;
        feedbackEl.textContent = `Correct! ${question.explanation}`;
        feedbackEl.className = 'quiz__feedback is-success';
    } else {
        const correctText = question.options[question.answerIndex];
        feedbackEl.textContent = `Not quite. ${question.explanation} (Answer: ${correctText})`;
        feedbackEl.className = 'quiz__feedback is-error';
    }

    updateScoreDisplay();
    updateProgressBar(currentIndex + 1);
    nextButton.classList.remove('quiz__button--hidden');
    nextButton.disabled = false;
    nextButton.textContent = currentIndex === questions.length - 1 ? 'View Results' : 'Next Question';
}

function showNext() {
    if (currentIndex < questions.length - 1) {
        currentIndex += 1;
        renderQuestion();
        return;
    }
    renderSummary();
}

function renderSummary() {
    quizCard.hidden = true;
    quizSummary.hidden = false;
    nextButton.classList.add('quiz__button--hidden');
    scoreEl.textContent = `Your Score: ${score} / ${questions.length}`;
    remarkEl.textContent = buildRemark(score, questions.length);
    updateScoreDisplay();
    updateProgressBar(questions.length);
}

function buildRemark(correctCount, total) {
    const ratio = correctCount / total;
    if (ratio === 1) {
        return 'Outstanding work! You nailed every question.';
    }
    if (ratio >= 0.7) {
        return 'Great job! A little more practice will make it perfect.';
    }
    if (ratio >= 0.4) {
        return 'Nice effort. Review the explanations and try again.';
    }
    return 'Keep practicing! Revisit the basics and give it another shot.';
}

function updateScoreDisplay() {
    if (liveScoreEl) {
        liveScoreEl.textContent = `Score: ${score} / ${questions.length}`;
    }
}

function updateProgressBar(completedCount) {
    if (!progressBarEl || !progressFillEl) {
        return;
    }
    const total = questions.length;
    const percentage = total === 0 ? 0 : Math.min((completedCount / total) * 100, 100);
    progressFillEl.style.width = `${percentage}%`;
    progressBarEl.setAttribute('aria-valuenow', Math.round(percentage));
}

nextButton.addEventListener('click', showNext);
if (restartButton) {
    restartButton.addEventListener('click', initQuiz);
}
restartButtonSummary.addEventListener('click', initQuiz);

initQuiz();

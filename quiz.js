// Array of quiz questions, options, and answers
const quizData = [
    {
      question: 'Which city is known as the "City of Light"?',
      options: ['New York', 'Tokyo', 'Paris', 'Sydney'],
      answer: 'Paris'
    },
    {
      question: 'What is the name of the famous beach in Rio de Janeiro?',
      options: ['Waikiki Beach', 'Bondi Beach', 'Copacabana Beach', 'Venice Beach'],
      answer: 'Copacabana Beach'
    },
    {
      question: 'Which country is home to the Great Barrier Reef?',
      options: ['Australia', 'Thailand', 'Maldives', 'Fiji'],
      answer: 'Australia'
    },
    {
      question: 'Which city is famous for the Colosseum?',
      options: ['Athens', 'Rome', 'Istanbul', 'Barcelona'],
      answer: 'Rome'
    },
    {
      question: 'What is the tallest mountain in the world?',
      options: ['Mount Kilimanjaro', 'Mount Everest', 'Mount Fuji', 'K2'],
      answer: 'Mount Everest'
    }
];

// DOM elements for the quiz container, result display, and buttons
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const submitButton = document.getElementById('submit');
const retryButton = document.getElementById('retry');
const showAnswerButton = document.getElementById('showAnswer');

// Variables to track the current question, score, and incorrect answers
let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];

// Function to shuffle an array (used for randomizing options)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to display the current question and its options
function displayQuestion() {
  // Get current question data
  const questionData = quizData[currentQuestion];

  // Creating a question counter element
  const questionCounter = document.createElement('div');
  questionCounter.className = 'question-counter';
  questionCounter.innerHTML = `Question ${currentQuestion + 1}/${quizData.length}`;

  // Creating a question text element
  const questionElement = document.createElement('div');
  questionElement.className = 'question';
  questionElement.innerHTML = questionData.question;

  // Creating a container for the options
  const optionsElement = document.createElement('div');
  optionsElement.className = 'options';

  // Shuffle the options for random order
  const shuffledOptions = [...questionData.options];
  shuffleArray(shuffledOptions);

  // Creating radio button options for each answer
  for (let i = 0; i < shuffledOptions.length; i++) {
    const option = document.createElement('label');
    option.className = 'option';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'quiz';
    radio.value = shuffledOptions[i];

    const optionText = document.createTextNode(shuffledOptions[i]);

    option.appendChild(radio);
    option.appendChild(optionText);
    optionsElement.appendChild(option);
  }

  // Update the quiz container with the new question
  quizContainer.style.display = 'block';
  quizContainer.innerHTML = '';
  quizContainer.appendChild(questionCounter);
  quizContainer.appendChild(questionElement);
  quizContainer.appendChild(optionsElement);
}

// Function to check the selected answer and update the score
function checkAnswer() {
  const selectedOption = document.querySelector('input[name="quiz"]:checked');
  if (selectedOption) {
    const answer = selectedOption.value;
    // Checking if the selected answer is correct
    if (answer === quizData[currentQuestion].answer) {
      score++;
    } else {
      // Add the incorrect answer details to the list
      incorrectAnswers.push({
        question: quizData[currentQuestion].question,
        incorrectAnswer: answer,
        correctAnswer: quizData[currentQuestion].answer
      });
    }
    currentQuestion++; // Move to the next question
    selectedOption.checked = false; // Uncheck the selected option
    if (currentQuestion < quizData.length) {
      // Display the next question
      displayQuestion();
    } else {
      // Show the results if the quiz is completed
      displayResult();
    }
    saveQuizState(); // Save the current state of the quiz
  }
}

// Function to display the final quiz results
function displayResult() {
  quizContainer.style.display = 'none';
  submitButton.style.display = 'none';
  retryButton.style.display = 'inline-block';
  showAnswerButton.style.display = 'inline-block';
  resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!`;
  saveQuizState();
}

// Function to reset the quiz and start again
function retryQuiz() {
  localStorage.removeItem('quizState');
  currentQuestion = 0;
  score = 0;
  incorrectAnswers = [];
  quizContainer.style.display = 'block';
  submitButton.style.display = 'inline-block';
  retryButton.style.display = 'none';
  showAnswerButton.style.display = 'none';
  resultContainer.innerHTML = '';
  displayQuestion();
}

// Function to display incorrect answers with correct answers
function showAnswer() {
  quizContainer.style.display = 'none';
  submitButton.style.display = 'none';
  retryButton.style.display = 'inline-block';
  showAnswerButton.style.display = 'none';

  let incorrectAnswersHtml = '';
  // Generating HTML for incorrect answers
  for (let i = 0; i < incorrectAnswers.length; i++) {
    incorrectAnswersHtml += `
      <p>
        <strong>Question:</strong> ${incorrectAnswers[i].question}<br>
        <strong>Your Answer:</strong> ${incorrectAnswers[i].incorrectAnswer}<br>
        <strong>Correct Answer:</strong> ${incorrectAnswers[i].correctAnswer}
      </p>
    `;
  }

  // Displaying the results and incorrect answers
  resultContainer.innerHTML = `
    <p>You scored ${score} out of ${quizData.length}!</p>
    <p>Incorrect Answers:</p>
    ${incorrectAnswersHtml}
  `;
}

// Function to save the current state of the quiz to local storage
function saveQuizState() {
  const state = {
    currentQuestion,
    score,
    incorrectAnswers,
    quizCompleted: currentQuestion >= quizData.length // Flag for quiz completion
  };
  localStorage.setItem('quizState', JSON.stringify(state)); // Save state as a JSON string
}

// Function to load the quiz state from local storage
function loadQuizState() {
  const storedState = localStorage.getItem('quizState');
  if (storedState) {
    const state = JSON.parse(storedState);
    currentQuestion = state.currentQuestion;
    score = state.score;
    incorrectAnswers = state.incorrectAnswers;

    // Check if the quiz was completed and resume appropriately
    if (state.quizCompleted) {
      displayResult();
    } else {
      displayQuestion();
    }
  } else {
    displayQuestion(); // Start a new quiz if no state is saved
  }
}

// Event listeners for the buttons
submitButton.addEventListener('click', () => {
  checkAnswer(); // Check the selected answer
});
retryButton.addEventListener('click', retryQuiz); // Restart the quiz
showAnswerButton.addEventListener('click', showAnswer); // Show incorrect answers

// Initialize the quiz by loading the state
loadQuizState();
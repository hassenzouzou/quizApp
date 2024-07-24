const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-btn");
const questionCount = document.getElementById("questionCount");
const timer = document.getElementById("timer");

let currentQuestionIndex =
  parseInt(localStorage.getItem("currentQuestionIndex")) || 0;
let score = parseInt(localStorage.getItem("score")) || 0;
let quizData = [];

let timeLeft = 30;
let timerInterval;

function startTimer() {
  const timeDisplay = document.getElementById("time");

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function endGame() {
  showResults();
  alert("Game Over GG");
}

function loadQuizData() {
  fetch("db.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      quizData = data.quiz;
      loadQuestion();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function loadQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  if (!currentQuestion) {
    showResults();
    return;
  }

  questionElement.textContent = currentQuestion.question;
  optionsElement.innerHTML = "";

  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", () =>
      selectOption(button, currentQuestion.answer)
    );
    optionsElement.appendChild(button);
  });

  questionCount.innerHTML = `${currentQuestionIndex + 1} from ${
    quizData.length
  }`;

  nextButton.style.display = "none";
}

function selectOption(button, correctAnswer) {
  if (button.textContent === correctAnswer) {
    score++;
  }
  nextButton.style.display = "block";

  localStorage.setItem("currentQuestionIndex", currentQuestionIndex + 1);
  localStorage.setItem("score", score);
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  questionElement.textContent = `Quiz Completed! Your score: ${score} out of ${quizData.length}`;
  optionsElement.innerHTML = "";
  nextButton.style.display = "none";
  questionCount.style.display = "none";
  localStorage.removeItem("currentQuestionIndex");
  localStorage.removeItem("score");
  timer.style.display = "none";
}

loadQuizData();

onload = startTimer();

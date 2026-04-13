let questions = [];
let index = 0;
let score = 0;
let name = "";

// load stats
fetch('/stats')
  .then(res => res.json())
  .then(data => {
    document.getElementById("attempts").innerText =
      data.attempts + " Attempts";

    document.getElementById("topScore").innerText =
      "Top Score: " + data.topScore;
  });

// load questions
fetch('/questions')
  .then(res => res.json())
  .then(data => questions = data);

function startQuiz() {
  name = document.getElementById("username").value;

  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";

  showQuestion();
}

let timeLeft = 10;
let interval;

function showQuestion() {
  if (index >= questions.length) {
    finishQuiz();
    return;
  }

  let q = questions[index];

  document.getElementById("progress").innerText =
    `Question ${index + 1}/${questions.length}`;

  let html = `<h3>${q.question}</h3>`;

  q.options.forEach((opt, i) => {
    html += `<button onclick="check(${i})">${opt}</button>`;
  });

  document.getElementById("quiz").innerHTML = html;

  // 👉 RESET TIMER
  timeLeft = 10;
  document.getElementById("timer").innerText = "Time: " + timeLeft;

  clearInterval(interval);

  interval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = "Time: " + timeLeft;

    if (timeLeft === 0) {
      clearInterval(interval);
      index++;
      showQuestion();
    }
  }, 1000);
}

function check(i) {
  clearInterval(interval); // stop timer

  if (i === questions[index].answer) {
    score++;
  }

  index++;
  showQuestion();
}

function finishQuiz() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "block";

  document.getElementById("finalScore").innerText =
    `${name}, your score: ${score}/${questions.length}`;

  fetch('/save-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, score })
  });
}
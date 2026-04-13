const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// 👉 Get questions
app.get('/questions', (req, res) => {
  const data = fs.readFileSync('questions.json');
  res.json(JSON.parse(data));
});

// 👉 Save score
app.post('/save-score', (req, res) => {
  let scores = [];

  if (fs.existsSync('scores.json')) {
    scores = JSON.parse(fs.readFileSync('scores.json'));
  }

  scores.push(req.body);

  fs.writeFileSync('scores.json', JSON.stringify(scores, null, 2));

  res.send("Saved");
});

// 👉 Get stats
app.get('/stats', (req, res) => {
  let scores = [];

  if (fs.existsSync('scores.json')) {
    scores = JSON.parse(fs.readFileSync('scores.json'));
  }

  let attempts = scores.length;
  let topScore = 0;

  scores.forEach(s => {
    if (s.score > topScore) {
      topScore = s.score;
    }
  });

  res.json({ attempts, topScore });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});

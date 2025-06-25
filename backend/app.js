const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { convert, calculTTC, applyRemise } = require('./conversionService.js');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Données fictives
const USERS = [{ username: "user1", password: "pass1" }];
let tasks = [
  { id: 1, title: "Apprendre Cobol" },
  { id: 2, title: "Faire un E2E" },
];
let nextTaskId = 3;

// POST /login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    // Juste un token jwt fictif pour la démo
    res.json({ token: "fake-jwt-token" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Middleware simple pour simuler une vérification de token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer fake-jwt-token") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// GET /tasks (protégé)
app.get("/tasks", authMiddleware, (req, res) => {
  res.json(tasks);
});

// POST /tasks (protégé)
app.post("/tasks", authMiddleware, (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTask = { id: nextTaskId++, title: title.trim() };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// DELETE /tasks/:id (protégé)
app.delete("/tasks/:id", authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

app.get('/convert', (req, res) => {
    const { amount, from, to } = req.query;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return res.status(400).json({ error: 'amount must be a number' });
    try {
        const converted = convert(amountNum, from, to);
        res.json({ from, to, originalAmount: amountNum, convertedAmount: converted });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.get('/tva', (req, res) => {
    const { ht, tva } = req.query;
    const htNum = parseFloat(ht);
    const tvaNum = parseFloat(tva);
    if (isNaN(htNum) || isNaN(tvaNum)) return res.status(400).json({ error: 'ht and tva must be numbers' });
    res.json({ ht: htNum, taux: tvaNum, ttc: calculTTC(htNum, tvaNum) });
});

app.get('/remise', (req, res) => {
    const { prix, remise } = req.query;
    const prixNum = parseFloat(prix);
    const remiseNum = parseFloat(remise);
    if (isNaN(prixNum) || isNaN(remiseNum)) return res.status(400).json({ error: 'prix and remise must be numbers' });
    res.json({ prixInitial: prixNum, pourcentage: remiseNum, prixFinal: applyRemise(prixNum, remiseNum) });
});


// Démarrage
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

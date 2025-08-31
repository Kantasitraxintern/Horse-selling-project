const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// เปิด/สร้างฐานข้อมูล
const db = new sqlite3.Database('./characters.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    va TEXT,
    color TEXT,
    image TEXT
  )`);
});

// REST API: GET /characters
app.get('/characters', (req, res) => {
  db.all('SELECT * FROM characters', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// REST API: POST /characters (เพิ่มตัวละครใหม่)
app.post('/characters', (req, res) => {
  const { name, va, color, image } = req.body;
  db.run('INSERT INTO characters (name, va, color, image) VALUES (?, ?, ?, ?)', [name, va, color, image], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, va, color, image });
  });
});

// REST API: PUT /characters/:id (แก้ไขข้อมูล)
app.put('/characters/:id', (req, res) => {
  const { name, va, color, image } = req.body;
  db.run('UPDATE characters SET name=?, va=?, color=?, image=? WHERE id=?', [name, va, color, image, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, name, va, color, image });
  });
});

// REST API: DELETE /characters/:id
app.delete('/characters/:id', (req, res) => {
  db.run('DELETE FROM characters WHERE id=?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

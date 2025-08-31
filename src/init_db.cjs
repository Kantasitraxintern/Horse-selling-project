const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const Papa = require('papaparse');

const db = new sqlite3.Database('./characters.db');
const csv = fs.readFileSync('./src/characters.csv', 'utf8');
const result = Papa.parse(csv, { header: true });

// สร้างตารางถ้ายังไม่มี
const createTable = `
CREATE TABLE IF NOT EXISTS characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  va TEXT,
  color TEXT,
  image TEXT
);
`;

const run = sql => new Promise((resolve, reject) => db.run(sql, err => err ? reject(err) : resolve()));
const insert = (c) => new Promise((resolve, reject) => {
  db.run('INSERT INTO characters (name, va, color, image) VALUES (?, ?, ?, ?)', [c.name, c.va, c.color, c.image], function(err) {
    if (err) reject(err); else resolve();
  });
});

(async () => {
  await run(createTable); // <--- เพิ่มบรรทัดนี้
  await run('DELETE FROM characters');
  for (const c of result.data) {
    if (c.name && c.image) await insert(c);
  }
  db.close();
  console.log('Database initialized from CSV!');
})();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;


app.use(express.json());

const db = new sqlite3.Database('mi_base.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Conectado a la base de datos SQLite');
});

db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    correo TEXT
  )
`);


app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


app.post('/usuarios', (req, res) => {
  const { nombre, correo } = req.body;
  db.run('INSERT INTO usuarios (nombre, correo) VALUES (?, ?)', [nombre, correo], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nombre, correo });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

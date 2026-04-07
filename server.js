const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// SQLite Database Setup
const db = new sqlite3.Database('./trabahanap.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize Database Tables
function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS job_seekers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        barangay TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT,
        email TEXT NOT NULL,
        experience TEXT,
        skills TEXT,
        facebook_link TEXT,
        position_desired TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error(err.message);
      else console.log('job_seekers table created/exists');
    });
  });
}

// List all Baliwag Baranggays
const baliwagBaranggays = [
  'Bagong Nayon',
  'Barangca',
  'Calantipay',
  'Catulinan',
  'Concepcion',
  'Hinukay',
  'Makinabang',
  'Matang Tubig',
  'Pagala',
  'Paitan',
  'Piel',
  'Pinagbarilan',
  'Poblacion',
  'Sabang',
  'San Jose',
  'San Roque',
  'Santa Barbara',
  'Santo Cristo',
  'Santo Niño',
  'Subic',
  'Sulivan',
  'Tangos',
  'Tarcan',
  'Tiaong',
  'Tibag',
  'Tilapayong',
  'Virgen delos Flores'
];

// ================ ROUTES ================

// Get all job seekers
app.get('/api/job-seekers', (req, res) => {
  db.all(`SELECT * FROM job_seekers ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single job seeker by ID
app.get('/api/job-seekers/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM job_seekers WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Job seeker not found' });
    } else {
      res.json(row);
    }
  });
});

// Create new job seeker profile
app.post('/api/job-seekers', (req, res) => {
  const { name, barangay, address, phone, email, experience, skills, facebook_link, position_desired } = req.body;

  // Validation
  if (!name || !barangay || !address || !email) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  if (!baliwagBaranggays.includes(barangay)) {
    return res.status(400).json({ error: 'Invalid barangay. Must be from Baliwag, Bulacan' });
  }

  const sql = `
    INSERT INTO job_seekers (name, barangay, address, phone, email, experience, skills, facebook_link, position_desired)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, barangay, address, phone || null, email, experience || '', skills || '', facebook_link || '', position_desired || ''], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({
        id: this.lastID,
        message: 'Profile created successfully'
      });
    }
  });
});

// Update job seeker profile
app.put('/api/job-seekers/:id', (req, res) => {
  const id = req.params.id;
  const { name, barangay, address, phone, email, experience, skills, facebook_link, position_desired } = req.body;

  if (!baliwagBaranggays.includes(barangay)) {
    return res.status(400).json({ error: 'Invalid barangay. Must be from Baliwag, Bulacan' });
  }

  const sql = `
    UPDATE job_seekers
    SET name = ?, barangay = ?, address = ?, phone = ?, email = ?, experience = ?, skills = ?, facebook_link = ?, position_desired = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [name, barangay, address, phone || null, email, experience || '', skills || '', facebook_link || '', position_desired || '', id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Job seeker not found' });
    } else {
      res.json({ message: 'Profile updated successfully' });
    }
  });
});

// Delete job seeker profile
app.delete('/api/job-seekers/:id', (req, res) => {
  const id = req.params.id;

  db.run('DELETE FROM job_seekers WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Job seeker not found' });
    } else {
      res.json({ message: 'Profile deleted successfully' });
    }
  });
});

// Get baranggays list
app.get('/api/baranggays', (req, res) => {
  res.json(baliwagBaranggays);
});

// Home route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Trabahanap server running at http://localhost:${PORT}`);
});
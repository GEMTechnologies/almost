import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'granada-ngo-secret-key';

// Database setup
const db = new Database.Database('ngo_management.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'staff',
    organization TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Projects table
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'planning',
    budget REAL DEFAULT 0,
    start_date DATE,
    end_date DATE,
    manager_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id)
  )`);

  // Grants table
  db.run(`CREATE TABLE IF NOT EXISTS grants (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    amount REAL NOT NULL,
    deadline DATE,
    status TEXT DEFAULT 'open',
    organization TEXT,
    requirements TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Applications table
  db.run(`CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    grant_id TEXT,
    project_id TEXT,
    applicant_id TEXT,
    status TEXT DEFAULT 'submitted',
    amount_requested REAL,
    proposal TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grant_id) REFERENCES grants(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (applicant_id) REFERENCES users(id)
  )`);

  // Financial transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    project_id TEXT,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    category TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_by TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  // Insert sample data
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (id, username, email, password, role, organization) 
          VALUES (?, ?, ?, ?, ?, ?)`, 
         [uuidv4(), 'admin', 'admin@ngo.org', hashedPassword, 'admin', 'Granada NGO']);

  // Sample grants
  db.run(`INSERT OR IGNORE INTO grants (id, title, description, amount, deadline, organization, requirements) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [uuidv4(), 'Community Development Grant', 'Funding for community infrastructure projects', 50000, '2024-12-31', 'Development Foundation', 'Non-profit status, community impact plan']);

  db.run(`INSERT OR IGNORE INTO grants (id, title, description, amount, deadline, organization, requirements) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
         [uuidv4(), 'Education Initiative Fund', 'Support for educational programs and resources', 25000, '2024-11-30', 'Education Trust', 'Educational focus, measurable outcomes']);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password, organization } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userId = uuidv4();

  db.run('INSERT INTO users (id, username, email, password, organization) VALUES (?, ?, ?, ?, ?)',
         [userId, username, email, hashedPassword, organization], (err) => {
    if (err) {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.json({ message: 'User created successfully' });
  });
});

// Projects routes
app.get('/api/projects', authenticateToken, (req, res) => {
  db.all(`SELECT p.*, u.username as manager_name FROM projects p 
          LEFT JOIN users u ON p.manager_id = u.id`, (err, projects) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(projects);
  });
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const { name, description, budget, start_date, end_date } = req.body;
  const projectId = uuidv4();

  db.run('INSERT INTO projects (id, name, description, budget, start_date, end_date, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
         [projectId, name, description, budget, start_date, end_date, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: projectId, message: 'Project created successfully' });
  });
});

// Grants routes
app.get('/api/grants', authenticateToken, (req, res) => {
  db.all('SELECT * FROM grants WHERE status = "open" ORDER BY deadline ASC', (err, grants) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(grants);
  });
});

app.post('/api/grants/apply', authenticateToken, (req, res) => {
  const { grant_id, project_id, amount_requested, proposal } = req.body;
  const applicationId = uuidv4();

  db.run('INSERT INTO applications (id, grant_id, project_id, applicant_id, amount_requested, proposal) VALUES (?, ?, ?, ?, ?, ?)',
         [applicationId, grant_id, project_id, req.user.id, amount_requested, proposal], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: applicationId, message: 'Application submitted successfully' });
  });
});

// Applications routes
app.get('/api/applications', authenticateToken, (req, res) => {
  db.all(`SELECT a.*, g.title as grant_title, p.name as project_name, u.username as applicant_name
          FROM applications a
          JOIN grants g ON a.grant_id = g.id
          JOIN projects p ON a.project_id = p.id
          JOIN users u ON a.applicant_id = u.id
          ORDER BY a.submitted_at DESC`, (err, applications) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(applications);
  });
});

// Financial routes
app.get('/api/transactions', authenticateToken, (req, res) => {
  db.all(`SELECT t.*, p.name as project_name, u.username as created_by_name
          FROM transactions t
          LEFT JOIN projects p ON t.project_id = p.id
          LEFT JOIN users u ON t.created_by = u.id
          ORDER BY t.date DESC`, (err, transactions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(transactions);
  });
});

app.post('/api/transactions', authenticateToken, (req, res) => {
  const { project_id, type, amount, description, category } = req.body;
  const transactionId = uuidv4();

  db.run('INSERT INTO transactions (id, project_id, type, amount, description, category, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
         [transactionId, project_id, type, amount, description, category, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: transactionId, message: 'Transaction recorded successfully' });
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as count FROM projects', (err, result) => {
    stats.totalProjects = result.count;
    
    db.get('SELECT COUNT(*) as count FROM grants WHERE status = "open"', (err, result) => {
      stats.openGrants = result.count;
      
      db.get('SELECT COUNT(*) as count FROM applications', (err, result) => {
        stats.totalApplications = result.count;
        
        db.get('SELECT SUM(amount) as total FROM transactions WHERE type = "income"', (err, result) => {
          stats.totalFunding = result.total || 0;
          res.json(stats);
        });
      });
    });
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Granada NGO Management System running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔑 Default login: admin / admin123`);
});
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./characters.db', (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Database initialization
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      va TEXT NOT NULL,
      color TEXT NOT NULL,
      image TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create index for better performance
  db.run('CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name)');
  db.run('CREATE INDEX IF NOT EXISTS idx_characters_va ON characters(va)');
});

// Helper function to handle database errors
const handleDbError = (err, res) => {
  console.error('Database error:', err);
  res.status(500).json({ 
    error: 'Database operation failed', 
    details: err.message 
  });
};

// Routes
app.get('/api/characters', (req, res) => {
  const { search, sort, limit = 50, offset = 0 } = req.query;
  
  let query = 'SELECT * FROM characters';
  const params = [];
  
  if (search) {
    query += ' WHERE name LIKE ? OR va LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  if (sort === 'name_asc') {
    query += ' ORDER BY name ASC';
  } else if (sort === 'name_desc') {
    query += ' ORDER BY name DESC';
  } else if (sort === 'created_desc') {
    query += ' ORDER BY created_at DESC';
  } else {
    query += ' ORDER BY id ASC';
  }
  
  query += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) return handleDbError(err, res);
    
    // Get total count for pagination
    db.get('SELECT COUNT(*) as total FROM characters', (err, countResult) => {
      if (err) return handleDbError(err, res);
      
      res.json({
        data: rows,
        pagination: {
          total: countResult.total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < countResult.total
        }
      });
    });
  });
});

app.get('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM characters WHERE id = ?', [id], (err, row) => {
    if (err) return handleDbError(err, res);
    if (!row) return res.status(404).json({ error: 'Character not found' });
    
    res.json({ data: row });
  });
});

app.post('/api/characters', (req, res) => {
  const { name, va, color, image } = req.body;
  
  // Validation
  if (!name || !va || !color || !image) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, va, color, image' 
    });
  }
  
  const query = `
    INSERT INTO characters (name, va, color, image) 
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(query, [name, va, color, image], function (err) {
    if (err) return handleDbError(err, res);
    
    res.status(201).json({
      data: { 
        id: this.lastID, 
        name, 
        va, 
        color, 
        image 
      },
      message: 'Character created successfully'
    });
  });
});

app.put('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  const { name, va, color, image } = req.body;
  
  // Check if character exists
  db.get('SELECT * FROM characters WHERE id = ?', [id], (err, row) => {
    if (err) return handleDbError(err, res);
    if (!row) return res.status(404).json({ error: 'Character not found' });
    
    // Update only provided fields
    const updates = [];
    const params = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (va !== undefined) {
      updates.push('va = ?');
      params.push(va);
    }
    if (color !== undefined) {
      updates.push('color = ?');
      params.push(color);
    }
    if (image !== undefined) {
      updates.push('image = ?');
      params.push(image);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    const query = `UPDATE characters SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);
    
    db.run(query, params, function (err) {
      if (err) return handleDbError(err, res);
      
      res.json({
        data: { 
          id: parseInt(id), 
          name: name || row.name, 
          va: va || row.va, 
          color: color || row.color, 
          image: image || row.image 
        },
        message: 'Character updated successfully',
        changes: this.changes
      });
    });
  });
});

app.delete('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM characters WHERE id = ?', [id], function (err) {
    if (err) return handleDbError(err, res);
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json({ 
      message: 'Character deleted successfully',
      deleted: this.changes 
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: `Route ${req.originalUrl} not found` 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Characters API: http://localhost:${PORT}/api/characters`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

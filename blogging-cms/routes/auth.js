const express = require('express');
const router = express.Router();
const db = require('../database/db');
const bcrypt = require('bcrypt');

// GET /auth/login - Show login form
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// POST /auth/login - Handle login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.render('auth/login', { error: 'Invalid username or password' });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        req.session.user = { id: user.id, username: user.username };
        res.redirect('/admin');
      } else {
        res.render('auth/login', { error: 'Invalid username or password' });
      }
    });
  });
});

// GET /auth/logout - Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;

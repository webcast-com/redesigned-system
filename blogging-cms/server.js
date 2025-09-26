const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const db = require('./database/db');
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'your-secret-key', // Change this in production
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY created_at DESC', [], (err, posts) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.render('index', { posts, user: req.session.user });
  });
});

// Admin route
app.get('/admin', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  db.all('SELECT * FROM posts ORDER BY created_at DESC', [], (err, posts) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.render('admin', { posts, user: req.session.user });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

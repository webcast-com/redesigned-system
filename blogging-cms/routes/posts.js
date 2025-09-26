const express = require('express');
const router = express.Router();
const db = require('../database/db');
const marked = require('marked');

// Middleware to check if user is logged in
function requireAuth(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
}

// Create slug from title
function createSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// GET /posts/new - Show new post form
router.get('/new', requireAuth, (req, res) => {
  res.render('posts/new', { user: req.session.user });
});

// POST /posts - Create new post
router.post('/', requireAuth, (req, res) => {
  const { title, content } = req.body;
  const slug = createSlug(title);
  const authorId = req.session.user.id;

  db.run(
    'INSERT INTO posts (title, content, slug, author_id) VALUES (?, ?, ?, ?)',
    [title, content, slug, authorId],
    function(err) {
      if (err) {
        return res.status(500).send('Error creating post');
      }
      res.redirect('/admin');
    }
  );
});

// GET /posts/:slug - Show individual post
router.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  db.get('SELECT * FROM posts WHERE slug = ?', [slug], (err, post) => {
    if (err || !post) {
      return res.status(404).send('Post not found');
    }
    // Convert markdown to HTML
    post.htmlContent = marked.parse(post.content);
    res.render('posts/show', { post, user: req.session.user });
  });
});

// GET /posts/:id/edit - Show edit form
router.get('/:id/edit', requireAuth, (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, post) => {
    if (err || !post) {
      return res.status(404).send('Post not found');
    }
    res.render('posts/edit', { post, user: req.session.user });
  });
});

// PUT /posts/:id - Update post
router.put('/:id', requireAuth, (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const slug = createSlug(title);

  db.run(
    'UPDATE posts SET title = ?, content = ?, slug = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, content, slug, id],
    function(err) {
      if (err) {
        return res.status(500).send('Error updating post');
      }
      res.redirect('/admin');
    }
  );
});

// DELETE /posts/:id - Delete post
router.delete('/:id', requireAuth, (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).send('Error deleting post');
    }
    res.redirect('/admin');
  });
});

module.exports = router;

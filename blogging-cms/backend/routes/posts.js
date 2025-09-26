const express = require('express');
const { protect, admin } = require('../middleware/auth');
const Post = require('../models/Post');

const router = express.Router();

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name');

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a post
// @route   POST /api/posts
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { title, content, excerpt, tags, category, published } = req.body;

  try {
    const post = new Post({
      title,
      content,
      excerpt,
      tags,
      category,
      published,
      author: req.user._id,
    });

    const createdPost = await post.save();
    await createdPost.populate('author', 'name');

    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { title, content, excerpt, tags, category, published } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      post.title = title || post.title;
      post.content = content || post.content;
      post.excerpt = excerpt || post.excerpt;
      post.tags = tags || post.tags;
      post.category = category || post.category;
      post.published = published !== undefined ? published : post.published;

      if (published && !post.publishedAt) {
        post.publishedAt = new Date();
      }

      const updatedPost = await post.save();
      await updatedPost.populate('author', 'name');

      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      await post.remove();
      res.json({ message: 'Post removed' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all posts (admin)
// @route   GET /api/posts/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

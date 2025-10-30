// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');

// Helper to slugify titles
const slugify = (text) =>
  text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

// @route   GET /api/posts
// @desc    Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID or slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let post = await Post.findById(id)
      .populate('author', 'name email')
      .populate('category', 'name slug');

    if (!post) {
      // Try finding by slug
      post = await Post.findOne({ slug: id })
        .populate('author', 'name email')
        .populate('category', 'name slug');
    }

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', async (req, res) => {
  try {
    const { title, content, authorId, categoryId, tags, isPublished } = req.body;

    if (!title || !content || !authorId || !categoryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const post = await Post.create({
      title,
      slug: slugify(title),
      content,
      author: authorId,
      category: categoryId,
      tags,
      isPublished,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email')
      .populate('category', 'name slug');

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
router.put('/:id', async (req, res) => {
  try {
    const { title, content, categoryId, tags, isPublished } = req.body;
    const { id } = req.params;

    const updatedData = {};
    if (title) updatedData.title = title;
    if (title) updatedData.slug = slugify(title);
    if (content) updatedData.content = content;
    if (categoryId) updatedData.category = categoryId;
    if (tags) updatedData.tags = tags;
    if (typeof isPublished === 'boolean') updatedData.isPublished = isPublished;

    const post = await Post.findByIdAndUpdate(id, updatedData, { new: true })
      .populate('author', 'name email')
      .populate('category', 'name slug');

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

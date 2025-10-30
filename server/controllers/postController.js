const Post = require('../models/Post');
const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');

exports.getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page)||1;
  const limit = Math.min(parseInt(req.query.limit)||10,50);
  const skip = (page-1)*limit;
  const { category, search } = req.query;
  const filter = {};
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }
  if (search) filter.$text = { $search: search };
  const [total, posts] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter).populate('author','name email').populate('category','name slug').sort({ createdAt:-1 }).skip(skip).limit(limit)
  ]);
  res.json({ success:true, meta:{ total, page, limit, pages: Math.ceil(total/limit) }, data: posts });
});

exports.getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let post;
  if (mongoose.isValidObjectId(id)) post = await Post.findById(id).populate('author','name email').populate('category','name slug');
  else post = await Post.findOne({ slug: id }).populate('author','name email').populate('category','name slug');
  if (!post) return res.status(404).json({ success:false, error:'Post not found' });
  await post.incrementViewCount();
  res.json({ success:true, data: post });
});

exports.createPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, category: categoryIdOrSlug, tags = [], author } = req.body;
  let categoryId = categoryIdOrSlug;
  if (categoryIdOrSlug && !mongoose.isValidObjectId(categoryIdOrSlug)) {
    const cat = await Category.findOne({ slug: categoryIdOrSlug });
    if (cat) categoryId = cat._id;
  }
  const postData = { title, content, excerpt, category: categoryId, tags: Array.isArray(tags)?tags:tags.split(',').map(t=>t.trim()).filter(Boolean), author };
  if (req.file) postData.featuredImage = `/uploads/${req.file.filename}`;
  const post = new Post(postData);
  await post.save();
  res.status(201).json({ success:true, data: post });
});

exports.updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ success:false, error:'Post not found' });
  const updatable = ['title','content','excerpt','tags','isPublished'];
  updatable.forEach(k => { if (req.body[k] !== undefined) post[k] = req.body[k]; });
  if (req.body.category) {
    let categoryId = req.body.category;
    if (!mongoose.isValidObjectId(categoryId)) {
      const cat = await Category.findOne({ slug: req.body.category });
      if (cat) categoryId = cat._id;
    }
    post.category = categoryId;
  }
  if (req.file) post.featuredImage = `/uploads/${req.file.filename}`;
  await post.save();
  res.json({ success:true, data: post });
});

exports.deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ success:false, error:'Post not found' });
  await post.remove();
  res.json({ success:true, data: {} });
});

exports.addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;
  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ success:false, error:'Post not found' });
  post.comments.push({ user: userId, content });
  await post.save();
  res.status(201).json({ success:true, data: post });
});

// seed.js - Seed database with sample data

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Post = require('./models/Post');

dotenv.config();

// Helper function to generate slugs
const slugify = (text) =>
  text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch((err) => console.error(err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});

    // 1️⃣ Create test user
    const user = await User.create({
      name: 'Test User',               // Required field
      email: 'testuser@example.com',
      password: 'password123',         // Hash in production
    });

    // 2️⃣ Create test category with slug
    const categoryName = 'General';
    const category = await Category.create({
      name: categoryName,
      slug: slugify(categoryName),
    });

    // 3️⃣ Create sample posts with explicit slugs
    const post1 = await Post.create({
      title: 'First Post',
      slug: slugify('First Post'),
      content: 'Hello MERN World!',
      author: user._id,
      category: category._id,
      tags: ['Welcome', 'MERN'],
      isPublished: true,
    });

    const post2 = await Post.create({
      title: 'Second Post',
      slug: slugify('Second Post'),
      content: 'React + Node is awesome!',
      author: user._id,
      category: category._id,
      tags: ['React', 'Node', 'MERN'],
      isPublished: true,
    });

    console.log('Database seeded successfully!');
    console.log({ user, category, posts: [post1, post2] });
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

// Run the async function
seedDatabase();

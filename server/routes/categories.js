// routes/categories.js
const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Categories route working fine!' });
});

module.exports = router;

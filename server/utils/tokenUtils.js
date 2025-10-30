const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (user) => jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'replace_me', { expiresIn: '15m' });
const generateRefreshToken = () => crypto.randomBytes(64).toString('hex');
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { generateAccessToken, generateRefreshToken, hashToken };

const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const { generateAccessToken, generateRefreshToken, hashToken } = require('../utils/tokenUtils');

const COOKIE_NAME = 'refreshToken';
const REFRESH_EXPIRES_DAYS = 7;

const setRefreshCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_EXPIRES_DAYS*24*60*60*1000,
    path: '/api/auth'
  };
  res.cookie(COOKIE_NAME, token, cookieOptions);
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ success:false, error:'Email already in use' });
  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  user.refreshTokens.push({ tokenHash, createdAt: new Date() });
  await user.save();
  setRefreshCookie(res, refreshToken);
  const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };
  res.status(201).json({ success:true, data: { user: safeUser, accessToken } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ success:false, error:'Invalid credentials' });
  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(401).json({ success:false, error:'Invalid credentials' });
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  user.refreshTokens.push({ tokenHash, createdAt: new Date() });
  await user.save();
  setRefreshCookie(res, refreshToken);
  const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };
  res.json({ success:true, data: { user: safeUser, accessToken } });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const rt = req.cookies && req.cookies[COOKIE_NAME];
  if (!rt) return res.status(401).json({ success:false, error:'Refresh token missing' });
  const rtHash = hashToken(rt);
  const user = await User.findOne({ 'refreshTokens.tokenHash': rtHash });
  if (!user) return res.status(401).json({ success:false, error:'Invalid refresh token' });
  user.refreshTokens = user.refreshTokens.filter(t => t.tokenHash !== rtHash);
  const newRefreshToken = generateRefreshToken();
  const newHash = hashToken(newRefreshToken);
  user.refreshTokens.push({ tokenHash: newHash, createdAt: new Date() });
  await user.save();
  const accessToken = generateAccessToken(user);
  setRefreshCookie(res, newRefreshToken);
  res.json({ success:true, data: { accessToken } });
});

exports.logout = asyncHandler(async (req, res) => {
  const rt = req.cookies && req.cookies[COOKIE_NAME];
  if (rt) {
    const rtHash = hashToken(rt);
    await User.updateOne({ 'refreshTokens.tokenHash': rtHash }, { $pull: { refreshTokens: { tokenHash: rtHash } } });
  }
  res.clearCookie(COOKIE_NAME, { path: '/api/auth' });
  res.json({ success:true });
});

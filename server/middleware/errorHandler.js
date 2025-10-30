module.exports = (err, req, res, next) => {
  console.error(err);
  if (err.code === 11000) {
    return res.status(400).json({ success:false, error:'Duplicate field', details: err.keyValue });
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e=>e.message);
    return res.status(400).json({ success:false, error: errors.join(', ') });
  }
  res.status(err.statusCode || 500).json({ success:false, error: err.message || 'Server Error' });
};

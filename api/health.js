module.exports = (req, res) => {
  res.json({
    status: 'healthy',
    product: 'base64-pro',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};

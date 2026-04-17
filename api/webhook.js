module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const event = req.body?.meta?.event_name;
  
  if (event === 'order_created' || event === 'subscription_created') {
    console.log('License created:', req.body);
    return res.json({ success: true, message: 'License activated' });
  }
  
  res.json({ received: true, event });
};

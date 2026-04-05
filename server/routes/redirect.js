const express = require('express');
const URL = require('../models/URL');

const router = express.Router();

// Redirect to original URL by shortId
router.get('/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;

    // Find URL by shortId
    const url = await URL.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Increment clicks counter
    url.clicks = (url.clicks || 0) + 1;
    await url.save();

    // Redirect to original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
const urlDatabase = {}; // In-memory storage for URL mappings

// Generate a short code using random bytes
function createShortCode() {
  return crypto.randomBytes(3).toString('hex'); // Generates a 6-character hex string
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle URL shortening request
app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' }); // Ensure URL is provided
  }

  // Check if the URL already exists
  const existing = Object.values(urlDatabase).find(item => item.longUrl === longUrl);
  if (existing) {
    return res.json(existing); // Return existing short code if already shortened
  }

  const shortCode = createShortCode();
  urlDatabase[shortCode] = { longUrl, shortCode, clicks: 0 };

  res.json({ shortCode }); // Respond with the new short URL code
});

// Retrieve click count for a short URL
app.get('/clicks/:code', (req, res) => {
  const record = urlDatabase[req.params.code];
  res.json({ clicks: record ? record.clicks : 0 }); // Return click count or 0 if not found
});

// Redirect short URL to original long URL
app.get('/:code', (req, res) => {
  const record = urlDatabase[req.params.code];
  if (record) {
    record.clicks++; // Increment click counter on access
    res.redirect(record.longUrl); // Redirect user to original URL
  } else {
    res.status(404).send('URL not found'); // Handle invalid short codes
  }
});

// Start server on specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

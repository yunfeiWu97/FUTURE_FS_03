const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();

const urlDatabase = {};

function createShortCode() {
  return crypto.randomBytes(3).toString('hex');
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }
  const existing = Object.values(urlDatabase).find(item => item.longUrl === longUrl);
  if (existing) {
    return res.json(existing);
  }
  const shortCode = createShortCode();
  urlDatabase[shortCode] = {
    longUrl,
    shortCode,
    clicks: 0
  };
  res.json({ shortCode });
});

app.get('/clicks/:code', (req, res) => {
  const code = req.params.code;
  const record = urlDatabase[code];
  res.json({ clicks: record ? record.clicks : 0 });
});

app.get('/:code', (req, res) => {
  const code = req.params.code;
  const record = urlDatabase[code];
  if (record) {
    record.clicks++;
    res.redirect(record.longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

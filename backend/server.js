const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();

// 模拟数据库，用于存储 URL 数据
const urlDatabase = {};

// 生成 6 位十六进制短码
function createShortCode() {
  return crypto.randomBytes(3).toString('hex');
}

app.use(bodyParser.json());
// 静态资源目录指向前端文件夹
app.use(express.static(path.join(__dirname, '../frontend')));

// 接口：接收长链接并生成短链接
app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }
  // 检查是否已存在相同的长链接
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

// 接口：返回指定短码的点击量
app.get('/clicks/:code', (req, res) => {
  const code = req.params.code;
  const record = urlDatabase[code];
  res.json({ clicks: record ? record.clicks : 0 });
});

// 根据短码重定向到原始 URL
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

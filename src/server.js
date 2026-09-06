'use strict';

const path = require('path');
const express = require('express');

const app = express();
const PORT = Number(process.env.PORT || 8080);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`bot-dev-test listening on ${PORT}`);
  });
}

module.exports = app;

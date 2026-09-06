'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../src/server');

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

function get(port, path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path }, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    }).on('error', reject);
  });
}

describe('bot-dev-test', () => {
  it('GET /health returns ok', async () => {
    const server = http.createServer(app);
    const port = await listen(server);
    try {
      const res = await get(port, '/health');
      assert.equal(res.status, 200);
      assert.deepEqual(JSON.parse(res.body), { status: 'ok' });
    } finally {
      server.close();
    }
  });

  it('GET / serves avatar page', async () => {
    const server = http.createServer(app);
    const port = await listen(server);
    try {
      const res = await get(port, '/');
      assert.equal(res.status, 200);
      assert.match(res.body, /avatar\.js/);
      assert.match(res.body, /three/);
      assert.match(res.body, /captions/);
    } finally {
      server.close();
    }
  });

  it('GET /avatar.js is served', async () => {
    const server = http.createServer(app);
    const port = await listen(server);
    try {
      const res = await get(port, '/avatar.js');
      assert.equal(res.status, 200);
      assert.match(res.body, /Hello world/);
      assert.match(res.body, /speechSynthesis/);
    } finally {
      server.close();
    }
  });
});

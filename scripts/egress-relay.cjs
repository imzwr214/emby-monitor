#!/usr/bin/env node
const http = require('http');

const port = Number(process.env.PORT || 8788);
const token = String(process.env.EGRESS_PROXY_TOKEN || '').trim();
const maxBodyBytes = Number(process.env.MAX_BODY_BYTES || 8 * 1024 * 1024);

const sendJson = (res, status, data) => {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'content-type': 'application/json;charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(body);
};

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  let size = 0;
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > maxBodyBytes) {
      reject(new Error('Request body too large'));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  req.on('error', reject);
});

const normalizeTarget = (value) => {
  const parsed = new URL(String(value || ''));
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only http/https targets are allowed');
  return parsed.toString();
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      return sendJson(res, 200, { ok: true });
    }
    if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'Method not allowed' });
    if (token) {
      const auth = String(req.headers.authorization || '');
      if (auth !== 'Bearer ' + token) return sendJson(res, 401, { ok: false, error: 'Unauthorized' });
    }

    const body = JSON.parse(await readBody(req));
    const targetUrl = normalizeTarget(body.url);
    const method = String(body.method || 'GET').toUpperCase();
    const headers = body.headers && typeof body.headers === 'object' ? body.headers : {};
    const requestBody = body.bodyBase64
      ? Buffer.from(String(body.bodyBase64), 'base64')
      : (body.bodyText || body.body ? String(body.bodyText || body.body) : undefined);

    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' ? undefined : requestBody,
      redirect: 'manual',
    });
    const buffer = Buffer.from(await upstream.arrayBuffer());
    const responseHeaders = {};
    upstream.headers.forEach((value, key) => {
      if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        responseHeaders[key] = value;
      }
    });

    return sendJson(res, 200, {
      ok: true,
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
      bodyBase64: buffer.toString('base64'),
    });
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: error.message || String(error) });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`egress relay listening on 0.0.0.0:${port}`);
});

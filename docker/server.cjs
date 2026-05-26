const fs = require('fs');
const path = require('path');
const http = require('http');
const { webcrypto } = require('crypto');
const { FileKVNamespace } = require('./file-kv.cjs');
const { DockerSelfUpdater } = require('./self-update.cjs');

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT_DIR, 'docker-data'));
const KV_PATH = path.join(DATA_DIR, 'kv.json');
const DEFAULT_PORT = Number(process.env.PORT) || 8787;
const DEFAULT_HOST = process.env.HOST || '0.0.0.0';

function loadWorker() {
  const sourcePath = path.join(ROOT_DIR, 'emby.js');
  const source = fs.readFileSync(sourcePath, 'utf8');
  const transformed = source.replace(/export\s+default\s*\{/, 'return {');
  return new Function(transformed)();
}

function createEnv() {
  const env = { ...process.env };
  env.EMBY_DB = new FileKVNamespace(KV_PATH);
  env.RUNTIME_ENV = 'docker';
  env.DOCKER_SELF_UPDATER = new DockerSelfUpdater({
    enabled: process.env.DOCKER_SELF_UPDATE_ENABLED === undefined ? '1' : process.env.DOCKER_SELF_UPDATE_ENABLED,
    image: process.env.DOCKER_UPDATE_IMAGE || 'ghcr.io/pototazhang/emby-js:latest',
    containerId: process.env.DOCKER_CONTAINER_ID || process.env.HOSTNAME || '',
    socketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock'
  });
  return env;
}

class ExecutionContext {
  constructor(label = 'task') {
    this.label = label;
    this.promises = [];
  }

  waitUntil(promise) {
    this.promises.push(Promise.resolve(promise).catch((error) => {
      console.error(`[${this.label}] waitUntil failed:`, error && error.stack ? error.stack : error);
    }));
  }

  async drain() {
    await Promise.allSettled(this.promises);
  }
}

async function nodeRequestToWebRequest(req) {
  const bodyChunks = [];
  for await (const chunk of req) bodyChunks.push(chunk);
  const body = bodyChunks.length ? Buffer.concat(bodyChunks) : undefined;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
      continue;
    }
    if (value !== undefined) headers.set(key, value);
  }
  const protocol = String(headers.get('x-forwarded-proto') || '').trim() || 'http';
  const host = String(headers.get('x-forwarded-host') || headers.get('host') || `127.0.0.1:${DEFAULT_PORT}`);
  const url = `${protocol}://${host}${req.url || '/'}`;
  return new Request(url, {
    method: req.method || 'GET',
    headers,
    body,
    redirect: 'manual'
  });
}

async function writeWebResponseToNode(res, response) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      const existing = res.getHeader(key);
      if (existing) {
        res.setHeader(key, Array.isArray(existing) ? existing.concat(value) : [existing, value]);
      } else {
        res.setHeader(key, value);
      }
      return;
    }
    res.setHeader(key, value);
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  res.end(buffer);
}

function parseScheduleIntervalMs() {
  const explicitMs = Number(process.env.SCHEDULE_INTERVAL_MS);
  if (Number.isFinite(explicitMs) && explicitMs > 0) return explicitMs;

  const cron = String(process.env.SCHEDULE_CRON || '*/1 * * * *').trim();
  if (cron === '* * * * *' || cron === '*/1 * * * *') return 60 * 1000;
  const everyMinutesMatch = cron.match(/^\*\/(\d+)\s+\*\s+\*\s+\*\s+\*$/);
  if (everyMinutesMatch) return Math.max(1, Number(everyMinutesMatch[1])) * 60 * 1000;
  throw new Error(`Unsupported SCHEDULE_CRON: ${cron}. Use */N * * * * or set SCHEDULE_INTERVAL_MS.`);
}

async function runScheduled(worker, env) {
  const ctx = new ExecutionContext('scheduled');
  const startedAt = Date.now();
  try {
    await worker.scheduled({ scheduledTime: startedAt, cron: process.env.SCHEDULE_CRON || '*/1 * * * *' }, env, ctx);
    await ctx.drain();
    console.log(`[scheduled] completed in ${Date.now() - startedAt}ms`);
  } catch (error) {
    console.error('[scheduled] failed:', error && error.stack ? error.stack : error);
  }
}

function scheduleLoop(worker, env) {
  if (String(process.env.SCHEDULE_ENABLED || '1').toLowerCase() === '0' || String(process.env.SCHEDULE_ENABLED || '1').toLowerCase() === 'false') {
    console.log('[scheduled] disabled');
    return;
  }
  const intervalMs = parseScheduleIntervalMs();
  const runOnStart = ['1', 'true', 'yes', 'on'].includes(String(process.env.RUN_SCHEDULE_ON_START || '').toLowerCase());

  const queueNext = () => {
    const now = Date.now();
    const delay = intervalMs - (now % intervalMs);
    setTimeout(async () => {
      await runScheduled(worker, env);
      queueNext();
    }, delay);
  };

  console.log(`[scheduled] enabled, interval=${intervalMs}ms`);
  if (runOnStart) {
    runScheduled(worker, env).catch((error) => {
      console.error('[scheduled] startup run failed:', error && error.stack ? error.stack : error);
    });
  }
  queueNext();
}

async function main() {
  await fs.promises.mkdir(DATA_DIR, { recursive: true });
  const worker = loadWorker();
  const env = createEnv();

  const server = http.createServer(async (req, res) => {
    try {
      const request = await nodeRequestToWebRequest(req);
      const response = await worker.fetch(request, env);
      await writeWebResponseToNode(res, response);
    } catch (error) {
      console.error('[http] request failed:', error && error.stack ? error.stack : error);
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ ok: false, error: error && error.message ? error.message : String(error) }));
    }
  });

  server.listen(DEFAULT_PORT, DEFAULT_HOST, () => {
    console.log(`[http] listening on http://${DEFAULT_HOST}:${DEFAULT_PORT}`);
    console.log(`[data] kv file: ${KV_PATH}`);
  });

  scheduleLoop(worker, env);
}

main().catch((error) => {
  console.error('[boot] failed:', error && error.stack ? error.stack : error);
  process.exitCode = 1;
});

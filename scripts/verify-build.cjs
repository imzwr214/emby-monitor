#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { babelParse } = require('../node_modules/playwright/lib/transform/babelBundle');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const fail = (message) => {
  console.error(`verify-build failed: ${message}`);
  process.exit(1);
};
const requireIncludes = (text, needle, label = needle) => {
  if (!text.includes(needle)) fail(`missing ${label}`);
};

const verifyModuleSyntax = (sourceText) => {
  const syntaxOnlySource = sourceText.replace(/\bexport\s+default\s*\{/, 'const __worker = {');
  try {
    new vm.Script(syntaxOnlySource, { filename: 'emby.js' });
  } catch (error) {
    fail(`emby.js syntax check failed: ${error.message}`);
  }
};

const verifyFrontendSyntax = (html) => {
  const scripts = [...html.matchAll(/<script\b[^>]*type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (!scripts.length) fail('missing frontend text/babel script');
  scripts.forEach((match, index) => {
    try {
      babelParse(match[1], `HTML_CONTENT text/babel script #${index + 1}`, { plugins: ['jsx'] });
    } catch (error) {
      fail(`frontend JSX syntax check failed: ${error.message}`);
    }
  });
};

const source = read('emby.js');
const wrangler = read('wrangler.toml');
const meta = JSON.parse(read('src/app-meta.json'));
const metaVersion = String(meta.version || '').trim();
const metaRuntimeVersions = meta.updateChannels && typeof meta.updateChannels === 'object' ? meta.updateChannels : {};
const metaWorkerVersion = String(metaRuntimeVersions.worker || metaVersion).trim();
const metaDockerVersion = String(metaRuntimeVersions.docker || metaVersion).trim();
const metaNotes = Array.isArray(meta.updateNotes) ? meta.updateNotes.map((item) => String(item)) : [];

if (source.length < 10000) fail('emby.js is unexpectedly small');
if (source.length > 5 * 1024 * 1024) fail('emby.js is unexpectedly large');
verifyModuleSyntax(source);
if (!metaVersion) fail('src/app-meta.json missing version');
if (!metaWorkerVersion) fail('src/app-meta.json missing updateChannels.worker');
if (!metaDockerVersion) fail('src/app-meta.json missing updateChannels.docker');
if (metaNotes.length < 1) fail('src/app-meta.json updateNotes must contain at least one note');

[
  'Emby 集群探针',
  'HTML_CONTENT',
  'export default',
  'APP_VERSION',
  'APP_RUNTIME_VERSIONS',
  'APP_UPDATE_NOTES'
].forEach((marker) => requireIncludes(source, marker));

const workerVersionMatch = source.match(/export\s+default\s*\{[\s\S]*?APP_VERSION:\s*["']([^"']+)["']/);
if (!workerVersionMatch) fail('missing Worker APP_VERSION literal');
if (workerVersionMatch[1] !== metaVersion) {
  fail(`Worker APP_VERSION does not match src/app-meta.json: worker=${workerVersionMatch[1]} meta=${metaVersion}`);
}
const runtimeVersionsMatch = source.match(/APP_RUNTIME_VERSIONS:\s*\{\s*worker:\s*["']([^"']+)["']\s*,\s*docker:\s*["']([^"']+)["']\s*\}\s*,/);
if (!runtimeVersionsMatch) fail('missing APP_RUNTIME_VERSIONS object literal');
if (runtimeVersionsMatch[1] !== metaWorkerVersion) {
  fail(`Worker runtime update version does not match src/app-meta.json: generated=${runtimeVersionsMatch[1]} meta=${metaWorkerVersion}`);
}
if (runtimeVersionsMatch[2] !== metaDockerVersion) {
  fail(`Docker runtime update version does not match src/app-meta.json: generated=${runtimeVersionsMatch[2]} meta=${metaDockerVersion}`);
}
let html = '';
const htmlMatch = source.match(/const HTML_CONTENT = ([\s\S]*?);\n\nexport default/);
if (!htmlMatch) fail('missing HTML_CONTENT literal');
try {
  html = JSON.parse(htmlMatch[1]);
} catch (error) {
  fail(`HTML_CONTENT literal is not parseable JSON: ${error.message}`);
}
const frontendVersionMatch = html.match(/const APP_VERSION = ["']([^"']+)["']/);
if (!frontendVersionMatch) fail('missing frontend APP_VERSION literal');
if (frontendVersionMatch[1] !== workerVersionMatch[1]) {
  fail(`version mismatch: frontend=${frontendVersionMatch[1]} worker=${workerVersionMatch[1]}`);
}
verifyFrontendSyntax(html);

const notesMatch = source.match(/APP_UPDATE_NOTES:\s*\[([\s\S]*?)\]\s*,/);
if (!notesMatch) fail('missing APP_UPDATE_NOTES array literal with trailing comma');
const noteCount = [...notesMatch[1].matchAll(/["']([^"']+)["']/g)].length;
if (noteCount < 1) fail('APP_UPDATE_NOTES must contain at least one note');
if (noteCount !== metaNotes.length) {
  fail(`APP_UPDATE_NOTES count does not match src/app-meta.json: generated=${noteCount} meta=${metaNotes.length}`);
}

requireIncludes(wrangler, 'main = "emby.js"', 'wrangler main = "emby.js"');
[
  "main_module: 'emby.js'",
  "form.append('emby.js'",
  "env.EMBY_DB.get('config')",
  "env.EMBY_DB.put('config'",
  'public_share_token:',
  'public_share_visitor:',
  'card_share_token:',
  'parsePublicHttpUrl(value)',
  'normalizeServerUrl(value)'
].forEach((marker) => requireIncludes(source, marker));

console.log(`verify-build ok: version ${workerVersionMatch[1]}, ${noteCount} update notes`);

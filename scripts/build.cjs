#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const write = (relativePath, content) => fs.writeFileSync(path.join(root, relativePath), content);

const indent = (content, spaces) => {
  const prefix = ' '.repeat(spaces);
  return String(content).replace(/\s+$/g, '').split('\n').map((line) => line ? prefix + line : '').join('\n');
};

const jsonString = (value) => JSON.stringify(String(value));

const meta = JSON.parse(read('src/app-meta.json'));
const version = String(meta.version || '').trim();
const updateNotes = Array.isArray(meta.updateNotes) ? meta.updateNotes.map((item) => String(item)) : [];

if (!version) throw new Error('src/app-meta.json missing version');
if (!updateNotes.length) throw new Error('src/app-meta.json missing updateNotes');

const boot = read('src/frontend/boot.js');
const bootSection = (name) => {
  const marker = `/* @section ${name} */`;
  const start = boot.indexOf(marker);
  if (start === -1) throw new Error(`Missing boot section: ${name}`);
  const after = start + marker.length;
  const next = boot.indexOf('/* @section ', after);
  return boot.slice(after, next === -1 ? boot.length : next).trim();
};

const frontendScript = [
  'const { useState, useEffect, useRef, useMemo } = React;',
  `const APP_VERSION = ${jsonString(version)};`,
  '',
  read('src/frontend/icons.jsx'),
  read('src/frontend/status-bars.jsx'),
  read('src/frontend/app.jsx')
].join('\n').trim();

const replaceLiteral = (content, marker, replacement) => content.replace(marker, () => replacement);

let html = read('src/frontend/html-shell.html');
html = replaceLiteral(html, '{{BOOT_HEAD_SCRIPT}}', indent(bootSection('head'), 8));
html = replaceLiteral(html, '{{STYLES}}', indent(read('src/frontend/styles.css'), 8));
html = replaceLiteral(html, '{{BOOT_BODY_SCRIPT}}', indent(bootSection('body'), 8));
html = replaceLiteral(html, '{{FRONTEND_SCRIPT}}', indent(frontendScript, 8));
html = replaceLiteral(html, '{{BOOT_FALLBACK_SCRIPT}}', indent(bootSection('fallback'), 8));

const htmlContentLiteral = JSON.stringify(html);

const workerFiles = [
  'constants.js',
  'routes.js',
  'telegram.js',
  'public-share.js',
  'rendering.js',
  'auth.js',
  'updater.js',
  'config-store.js',
  'utils.js',
  'logs.js',
  'url-safety.js',
  'emby-api.js',
  'probe.js'
];

const stripHeaderComment = (content) => content.replace(/^\s*\/\*[\s\S]*?\*\/\r?\n?/, '');
const ensureObjectFragmentComma = (content, file) => {
  const trimmed = content.trim();
  if (!trimmed) return '';
  if (trimmed.endsWith(',')) return indent(trimmed, 2);
  throw new Error(`Worker fragment must end with a comma: src/worker/${file}`);
};
const workerBody = workerFiles
  .map((file) => ensureObjectFragmentComma(stripHeaderComment(read(`src/worker/${file}`)), file))
  .filter(Boolean)
  .join('\n\n');

const notesLiteral = updateNotes.map((note) => `      ${jsonString(note)}`).join(',\n');

const output = `/**
 * Emby 集群探针
 *
 * This file is generated from src/ by scripts/build.cjs.
 * Do not edit emby.js directly; edit src/ and run npm run build.
 */

const HTML_CONTENT = ${htmlContentLiteral};

export default {
  APP_VERSION: ${jsonString(version)},
  APP_UPDATE_NOTES: [
${notesLiteral}
  ],
${workerBody}
};
`;

write('emby.js', output);
console.log(`Generated emby.js (${output.length} bytes) from src/`);

const fs = require('fs');
const path = require('path');

class FileKVNamespace {
  constructor(filePath) {
    this.filePath = filePath;
    this.state = { entries: {} };
    this.loaded = false;
    this.writeQueue = Promise.resolve();
  }

  async ensureLoaded() {
    if (this.loaded) return;
    await fs.promises.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      const raw = await fs.promises.readFile(this.filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.entries && typeof parsed.entries === 'object') {
        this.state = { entries: parsed.entries };
      }
    } catch (error) {
      if (error && error.code !== 'ENOENT') throw error;
    }
    this.loaded = true;
    this.cleanupExpired();
  }

  cleanupExpired() {
    const now = Date.now();
    let changed = false;
    for (const [key, entry] of Object.entries(this.state.entries)) {
      if (!entry || (entry.expiresAt && entry.expiresAt <= now)) {
        delete this.state.entries[key];
        changed = true;
      }
    }
    return changed;
  }

  async flush() {
    const payload = JSON.stringify(this.state);
    const tempPath = `${this.filePath}.tmp`;
    this.writeQueue = this.writeQueue.then(async () => {
      await fs.promises.writeFile(tempPath, payload, 'utf8');
      await fs.promises.rename(tempPath, this.filePath);
    });
    return this.writeQueue;
  }

  async get(key) {
    await this.ensureLoaded();
    const changed = this.cleanupExpired();
    if (changed) await this.flush();
    const entry = this.state.entries[String(key)];
    return entry ? String(entry.value) : null;
  }

  async put(key, value, options = {}) {
    await this.ensureLoaded();
    const expiresAt = Number.isFinite(Number(options.expirationTtl)) && Number(options.expirationTtl) > 0
      ? Date.now() + (Number(options.expirationTtl) * 1000)
      : 0;
    this.state.entries[String(key)] = {
      value: String(value),
      expiresAt
    };
    await this.flush();
  }

  async delete(key) {
    await this.ensureLoaded();
    delete this.state.entries[String(key)];
    await this.flush();
  }

  async list(options = {}) {
    await this.ensureLoaded();
    const changed = this.cleanupExpired();
    if (changed) await this.flush();

    const prefix = String(options.prefix || '');
    const allKeys = Object.keys(this.state.entries)
      .filter((name) => name.startsWith(prefix))
      .sort();
    const start = Number.isFinite(Number(options.cursor)) ? Math.max(0, Number(options.cursor)) : 0;
    const limit = Number.isFinite(Number(options.limit)) && Number(options.limit) > 0
      ? Math.min(1000, Math.floor(Number(options.limit)))
      : 1000;
    const items = allKeys.slice(start, start + limit);
    const nextIndex = start + items.length;
    return {
      keys: items.map((name) => {
        const entry = this.state.entries[name];
        return {
          name,
          expiration: entry && entry.expiresAt ? Math.ceil(entry.expiresAt / 1000) : null
        };
      }),
      list_complete: nextIndex >= allKeys.length,
      cursor: nextIndex >= allKeys.length ? '' : String(nextIndex)
    };
  }
}

module.exports = { FileKVNamespace };

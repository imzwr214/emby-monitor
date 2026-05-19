/*
 * 通用工具。
 *
 * 负责 base64 转换、图标库提取等跨模块工具。
 * `extractIcons()` 需要兼容 JSON 对象、数组和文本 URL 列表。
 */
  bytesToBase64(bytes) {
      if (!bytes || typeof bytes.length !== 'number') return '';
      if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64');
      let binary = '';
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, Array.prototype.slice.call(bytes, i, i + chunkSize));
      }
      if (typeof btoa === 'function') return btoa(binary);
      return '';
  },
  extractIcons(input) {
      const icons = {};
      const imagePattern = /\.(png|jpe?g|webp|gif|svg|ico)$/i;
      const imageLikeHostPattern = /(icon|logo|image|img|avatar|favicon|cdn|githubusercontent|jsdelivr|cloudinary|alicdn|qlogo|hdslb)/i;
      const usedUrls = new Set();
      const makeUniqueKey = (key) => {
          const base = String(key || '图标').replace(/\.(png|jpe?g|webp|gif|svg|ico)$/i, '').replace(/[?#].*$/, '').trim().slice(0, 80) || '图标';
          let finalKey = base;
          let count = 2;
          while (Object.prototype.hasOwnProperty.call(icons, finalKey)) { finalKey = base.slice(0, 72) + '_' + count; count += 1; }
          return finalKey;
      };
      const isImageLikeUrl = (iconUrl, key) => {
          const pathname = iconUrl.pathname.toLowerCase(); const search = iconUrl.search.toLowerCase(); const keyText = String(key || '').toLowerCase();
          if (imagePattern.test(pathname)) return true;
          if (/(format|type|ext|mime|content-type)=.*(png|jpg|jpeg|webp|gif|svg|ico)/i.test(search)) return true;
          if (/(icon|logo|image|img|avatar|favicon|src|url|href)/i.test(keyText)) return true;
          if (imageLikeHostPattern.test(iconUrl.hostname + pathname)) return true;
          return false;
      };
      const addIcon = (key, value) => {
          if (typeof value !== 'string') return;
          const iconUrl = this.parsePublicHttpUrl(value);
          if (!iconUrl) return;
          const urlText = iconUrl.toString();
          if (usedUrls.has(urlText)) return;
          if (!isImageLikeUrl(iconUrl, key)) return;
          usedUrls.add(urlText);
          const fallbackName = decodeURIComponent(iconUrl.pathname.split('/').filter(Boolean).pop() || '图标_' + (Object.keys(icons).length + 1));
          icons[makeUniqueKey(key || fallbackName)] = urlText;
      };

      const walk = (value, keyHint = '') => {
          if (typeof value === 'string') { addIcon(keyHint, value); return; }
          if (Array.isArray(value)) { value.forEach((item, index) => walk(item, keyHint || ('图标_' + (index + 1)))); return; }
          if (value && typeof value === 'object') {
              const nameHint = value.name || value.title || value.label || value.key || value.id || keyHint;
              for (const [key, child] of Object.entries(value)) {
                  const lowerKey = key.toLowerCase();
                  const nextHint = ['url', 'src', 'href', 'icon', 'logo', 'image', 'img', 'avatar', 'favicon'].includes(lowerKey) ? nameHint : key;
                  walk(child, nextHint);
              }
          }
      };

      walk(input);
      return icons;
  },

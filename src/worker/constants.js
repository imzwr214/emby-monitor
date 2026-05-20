/*
 * Worker 常量片段。
 *
 * 负责更新仓库默认值、历史保留长度、离线通知延迟和 App 图标 SVG。
 * 版本号和更新说明不要写在这里，统一由 `src/app-meta.json` 生成。
 */
  UPDATE_REPO_OWNER: 'pototazhang',
  UPDATE_REPO_NAME: 'emby-js',
  UPDATE_BRANCH: 'main',
  UPDATE_FILE: 'emby.js',
  PROBE_CONCURRENCY_LIMIT: 4,
  OFFLINE_CONFIRMATION_THRESHOLD: 3,
  OFFLINE_CONFIRMATION_WINDOW_MS: 15 * 60 * 1000,
  PROBE_FAILURE_SUPPRESSION_RATIO: 0.5,
  HISTORY_LIMIT: 7 * 24 * 60,
  OFFLINE_NOTIFY_DELAY_MS: 5 * 60 * 1000,
  APP_ICON_SVG: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><defs><linearGradient id="bg" x1="32" y1="24" x2="224" y2="232" gradientUnits="userSpaceOnUse"><stop stop-color="#3b82f6"/><stop offset="1" stop-color="#10b981"/></linearGradient><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#0f172a" flood-opacity=".22"/></filter></defs><rect width="256" height="256" rx="56" fill="#dce8fb"/><circle cx="68" cy="58" r="66" fill="#bfdbfe" opacity=".65"/><circle cx="198" cy="196" r="78" fill="#a7f3d0" opacity=".55"/><g filter="url(#s)"><rect x="48" y="58" width="160" height="58" rx="18" fill="url(#bg)"/><rect x="48" y="140" width="160" height="58" rx="18" fill="url(#bg)" opacity=".92"/><circle cx="78" cy="87" r="8" fill="white"/><circle cx="78" cy="169" r="8" fill="white"/><path d="M106 86h66M106 168h66" stroke="white" stroke-width="12" stroke-linecap="round" opacity=".86"/></g></svg>',

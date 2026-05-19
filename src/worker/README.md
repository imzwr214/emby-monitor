# Worker source

这里是 Cloudflare Worker 后端源码片段，构建后会拼进根目录 `emby.js` 的同一个 `export default { ... }` 对象中。

- `routes.js`：HTTP API 和 scheduled 入口。
- `auth.js`：后台 Token 鉴权和 JSON 响应。
- `config-store.js`：KV 主配置、revision、字段规范化。
- `public-share.js`：公开页、分享 token、访问统计、卡片 token。
- `telegram.js`：Telegram 配置、资料读取、消息发送和通知文案。
- `updater.js`：一键自更新。
- `emby-api.js`：Emby/Jellyfin 登录和媒体库数量读取。
- `probe.js`：在线探测、fallback、媒体统计刷新和批量探测逻辑。
- `rendering.js`：公开页 HTML 与 SVG 卡片渲染。
- `url-safety.js`：外部 URL 安全边界。
- `utils.js`：通用工具。
- `constants.js`：Worker 常量。

维护注意：第一轮拆分仍保留对象方法片段，最终由构建脚本拼成一个 Worker 对象，避免破坏大量 `this.xxx()` 调用。KV key、API 路径、自更新 marker 和 URL 安全边界都是线上协议，不能随意改。

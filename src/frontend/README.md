# Frontend source

这里是后台页面的源码片段，构建后会被内联到根目录 `emby.js` 的 `HTML_CONTENT` 中。

- `html-shell.html`：HTML 外壳、CDN 依赖、root 容器和脚本插槽。
- `styles.css`：页面全局样式和移动端布局。
- `boot.js`：白屏、CDN、JSX 和 React 启动失败诊断。
- `icons.jsx`：内置 SVG 图标。
- `status-bars.jsx`：服务器历史状态条。
- `app.jsx`：React 主应用和页面业务逻辑。

维护注意：当前线上页面仍使用 React 18.2 CDN 和浏览器端 Babel。不要因为 `package.json` 中的 React 开发依赖版本较新就直接升级 CDN；升级 React 或去掉 Babel 需要单独回归。

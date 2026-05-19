# AI 必读

每次 AI 读取或修改本仓库时，必须先阅读本文件。

## 版本号检查要求

本仓库采用 `src/` 多文件源码加根目录 `emby.js` 生成产物的维护方式。不要直接手改根目录 `emby.js`；改动源码后运行构建生成它。

每次完成修复、优化、功能更新或任何会影响线上行为的代码修改后，必须先更新 `src/app-meta.json`：

- `version` 是唯一版本源。
- `updateNotes` 必须包含本次主要改动。

随后运行：

```bash
npm run build
npm run verify
```

提交或推送前至少确认：

- `npm run check` 通过。
- 生成产物中前端 `const APP_VERSION` 和 Worker `APP_VERSION:` 与 `src/app-meta.json` 一致。
- 生成产物中 `APP_UPDATE_NOTES` 已包含本次主要改动。
- `wrangler.toml` 的 `main = "emby.js"` 没有改变。
- 不改 API 路径、KV key、自更新 marker、React CDN 版本和 URL 安全边界，除非任务明确要求并已做回归。

## 构建脚本注意事项

`scripts/build.cjs` 会把前端 JSX 拼进 HTML，再写入根目录 `emby.js`。向 HTML 模板注入源码、样式或脚本时，必须使用函数式替换，例如：

```js
content.replace(marker, () => replacement)
```

不要使用 `content.replace(marker, replacement)` 注入源码字符串。普通字符串 replacement 会解释 `$&`、`$'`、`$1` 等特殊序列；前端正则或字符串里出现 `$` 时，生成的 `emby.js` 可能被静默改坏，最终线上报 `Unexpected token ')'` 这类页面脚本错误。

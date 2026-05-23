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

## Emby 最近播放时间查询链路

排查“最近播放时间”时，按下面链路走，不要只看续播接口或顶层 `DatePlayed`。

1. 先登录拿 `AccessToken` 和 `User.Id`：

```bash
curl -sk -X POST \
  -H 'X-Emby-Authorization: MediaBrowser Client="Forward", Device="Forward", DeviceId="forward", Version="1.0"' \
  --data-urlencode 'Username=<username>' \
  --data-urlencode 'Pw=<password>' \
  '<server>/emby/Users/AuthenticateByName'
```

2. 查最近播放候选列表，按 `DatePlayed` 倒序：

```bash
curl -sk -G \
  -H 'X-Emby-Token: <access_token>' \
  --data-urlencode 'Recursive=true' \
  --data-urlencode 'Fields=UserData,DatePlayed,LastPlayedDate' \
  --data-urlencode 'SortBy=DatePlayed' \
  --data-urlencode 'SortOrder=Descending' \
  --data-urlencode 'Limit=10' \
  --data-urlencode 'IncludeItemTypes=Movie,Episode,Video' \
  '<server>/emby/Users/<user_id>/Items'
```

3. 对列表首条再单独查详情，读取 `UserData.LastPlayedDate`：

```bash
curl -sk -G \
  -H 'X-Emby-Token: <access_token>' \
  --data-urlencode 'Fields=DatePlayed,UserData' \
  '<server>/emby/Users/<user_id>/Items/<item_id>'
```

4. 续播接口只用于辅助判断未播完项目，不等同于最近播放历史：

```bash
curl -sk -G \
  -H 'X-Emby-Token: <access_token>' \
  --data-urlencode 'Limit=10' \
  --data-urlencode 'IncludeItemTypes=Movie,Episode' \
  --data-urlencode 'Fields=BasicSyncInfo,DatePlayed,UserData,LastPlayedDate' \
  '<server>/emby/Users/<user_id>/Items/Resume'
```

容易出错的点：

- `AuthenticateByName` 必须带 `X-Emby-Authorization`，否则有些服务端会报 `Value cannot be null. (Parameter 'appName')`。
- 如果用户指定播放器标识，例如 `Forward`，`Client`、`Device`、`DeviceId` 要跟着改；不要硬编码成 `Codex` 或其它名字。
- `/Items/Resume` 返回的是续播项，可能不是全站最近播放项；要用 `/Items` + `SortBy=DatePlayed` 找最近播放候选。
- 列表响应里顶层 `DatePlayed`、`LastPlayedDate` 可能是 `null`，甚至 `UserData.LastPlayedDate` 也可能没展开；需要再对首条 `Items/<item_id>` 查详情。
- 单条详情里可靠字段通常是 `UserData.LastPlayedDate`，UTC 时间要按展示需求转换到 `Asia/Shanghai`。
- `PlayCount` 在列表和详情里可能不一致，判断最近播放时间不要依赖列表里的 `PlayCount`。
- 代码里不要使用全局 `CURRENT_SERVER_URL` 拼接口；优先用当前会话或服务器对象的真实 `base_url`，避免多服务器场景串台。
- 日志和最终回复不要泄露 `AccessToken`、用户名密码或完整敏感凭据。

近三次实测经验：

- `https://link00.okemby.org:8443` 接受 `Forward` 客户端标识；`/Items` 顶层时间为空，首条详情的 `UserData.LastPlayedDate` 才是可用时间。
- `https://mwp.bydsb.cc.cd` 会返回 `Forbidden: App Blocked` 拦截 `Forward` 和 Web 标识，但接受 `Emby for Android` 风格请求头；后续 `/Items` 请求也必须继续带同一套客户端头和 token。
- `https://emby.nas.edu.kg` 的 `Forward` 请求触发 Cloudflare 拦截，`Emby for Android` 可以登录和查询；`/Items/Resume` 首位可作为续播参考，但列表仍不展开 `UserData.LastPlayedDate`，最终必须查单条详情确认。
- 项目里的最近播放抓取逻辑必须支持客户端标识回退：优先 `Forward`，失败后尝试 `Emby for Android`，并把成功的客户端 profile 保存到 `mediaStats.clientProfile`，后续统计和最近播放请求复用它。
- 最近播放是媒体库账号的通用运行字段，不能只放在 `keepAlive.lastPlayedAt`；保号功能可以复用它，但卡片展示应读取 `mediaStats.lastPlayedAt`。

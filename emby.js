/**
 * Emby 集群探针
 *
 * This file is generated from src/ by scripts/build.cjs.
 * Do not edit emby.js directly; edit src/ and run npm run build.
 */

const HTML_CONTENT = "<!--\r\n  前端 HTML 外壳。\r\n\r\n  负责页面基础 head、CDN 依赖、root 容器和脚本插槽。当前运行时仍使用 React 18.2 CDN 与浏览器端 Babel，\r\n  不要因为 package.json 中的 React 开发依赖版本不同而直接升级线上 CDN。\r\n-->\r\n<!DOCTYPE html>\r\n<html lang=\"zh-CN\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\r\n    <meta name=\"theme-color\" content=\"#dce8fb\">\r\n    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\r\n    <meta name=\"apple-mobile-web-app-title\" content=\"Emby 探针\">\r\n    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"default\">\r\n    <link rel=\"manifest\" href=\"/manifest.webmanifest\">\r\n    <link rel=\"icon\" href=\"/app-icon.svg\" type=\"image/svg+xml\">\r\n    <link rel=\"apple-touch-icon\" href=\"/app-icon.svg\">\r\n    <title>Emby 集群探针大盘</title>\r\n    <script>\r\n        function showBootError(message) {\r\n            var el = document.getElementById('boot-error');\r\n            var root = document.getElementById('root');\r\n            if (root) {\r\n                root.innerHTML = '';\r\n            }\r\n            if (el) {\r\n                el.style.display = 'block';\r\n                el.style.position = 'fixed';\r\n                el.style.left = '50%';\r\n                el.style.top = '40px';\r\n                el.style.transform = 'translateX(-50%)';\r\n                el.style.zIndex = '99999';\r\n                el.style.width = 'calc(100% - 32px)';\r\n                el.textContent = message;\r\n            }\r\n        }\r\n    </script>\r\n    <script>\r\n        try {\r\n            if (localStorage.getItem('reduce_effects') === '1') {\r\n                document.documentElement.classList.add('performance-lite');\r\n            }\r\n        } catch (e) {}\r\n    </script>\r\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js\" onerror=\"showBootError('React CDN 加载失败')\"></script>\r\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js\" onerror=\"showBootError('ReactDOM CDN 加载失败')\"></script>\r\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js\" onerror=\"showBootError('Babel CDN 加载失败')\"></script>\r\n    <script src=\"https://cdn.tailwindcss.com\" onerror=\"showBootError('Tailwind CDN 加载失败')\"></script>\r\n    <style>\r\n        /*\r\n         * 前端全局样式。\r\n         *\r\n         * 负责页面背景、玻璃拟物面板、卡片、弹窗、移动端布局等视觉样式。\r\n         * 后续改 UI 外观优先看这里；动态业务状态仍在 React 组件里维护。\r\n         */\r\n        html { background: #dde8f8; }\r\n        body {\r\n            background: #dde8f8;\r\n            color: #334155;\r\n            font-family: system-ui;\r\n            margin: 0;\r\n            min-height: 100vh;\r\n        }\r\n        \r\n        .bg-canvas {\r\n            position: fixed;\r\n            inset: 0;\r\n            z-index: 0;\r\n            background: linear-gradient(135deg, #e8eeff 0%, #dce8fb 30%, #ede4fb 60%, #e0effe 100%);\r\n            overflow: hidden;\r\n        }\r\n        .bg-canvas::after {\r\n            content: '';\r\n            position: absolute;\r\n            inset: 0;\r\n            background-image: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\");\r\n            pointer-events: none;\r\n            opacity: 0.6;\r\n        }\r\n        .orb {\r\n            position: absolute;\r\n            border-radius: 50%;\r\n            filter: blur(80px);\r\n            opacity: 0.55;\r\n            animation: orb-drift linear infinite;\r\n        }\r\n        .orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, #a5c4fd, #c4b5fd); top: -15%; left: -10%; animation-duration: 28s; }\r\n        .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, #fde68a, #fca5a5); top: 40%; right: -8%; animation-duration: 22s; animation-delay: -8s; }\r\n        .orb-3 { width: 450px; height: 450px; background: radial-gradient(circle, #6ee7f7, #a5f3cc); bottom: -10%; left: 25%; animation-duration: 32s; animation-delay: -14s; }\r\n        .orb-4 { width: 350px; height: 350px; background: radial-gradient(circle, #fbb6f0, #c4b5fd); top: 20%; left: 40%; animation-duration: 25s; animation-delay: -4s; opacity: 0.35; }\r\n        @keyframes orb-drift {\r\n            0% { transform: translate(0, 0) scale(1); }\r\n            25% { transform: translate(40px, -30px) scale(1.05); }\r\n            50% { transform: translate(-20px, 50px) scale(0.97); }\r\n            75% { transform: translate(-50px, -20px) scale(1.03); }\r\n            100% { transform: translate(0, 0) scale(1); }\r\n        }\r\n        \r\n        /* 自定义高级动画与玻璃拟物样式 */\r\n        @keyframes breath-dot-online {\r\n            0%, 100% { box-shadow: 0 0 6px rgba(16, 185, 129, 0.4), 0 0 0 0 rgba(16, 185, 129, 0.2); }\r\n            50% { box-shadow: 0 0 12px rgba(16, 185, 129, 0.8), 0 0 0 6px rgba(16, 185, 129, 0); }\r\n        }\r\n        @keyframes breath-dot-offline {\r\n            0%, 100% { box-shadow: 0 0 6px rgba(244, 63, 94, 0.5), 0 0 0 0 rgba(244, 63, 94, 0.2); }\r\n            50% { box-shadow: 0 0 14px rgba(244, 63, 94, 0.9), 0 0 0 6px rgba(244, 63, 94, 0); }\r\n        }\r\n        @keyframes breath-glow-online {\r\n            0%, 100% { opacity: 0.15; transform: scale(1); }\r\n            50% { opacity: 0.3; transform: scale(1.1); }\r\n        }\r\n        @keyframes breath-glow-offline {\r\n            0%, 100% { opacity: 0.15; transform: scale(1); }\r\n            50% { opacity: 0.35; transform: scale(1.15); }\r\n        }\r\n        @keyframes pulse-updating {\r\n            0%, 100% { opacity: 1; }\r\n            50% { opacity: 0.5; }\r\n        }\r\n        \r\n        .dot-online { background-color: #10b981; animation: breath-dot-online 2.5s ease-in-out infinite; }\r\n        .dot-offline { background-color: #f43f5e; animation: breath-dot-offline 2s ease-in-out infinite; }\r\n        .dot-updating { background-color: #3b82f6; animation: pulse-updating 1.5s infinite; }\r\n        .glow-online { background-color: #10b981; animation: breath-glow-online 2.5s ease-in-out infinite; }\r\n        .glow-offline { background-color: #f43f5e; animation: breath-glow-offline 2s ease-in-out infinite; }\r\n        \r\n        .performance-lite .bg-canvas::after {\r\n            opacity: 0.18;\r\n        }\r\n        .performance-lite .orb {\r\n            display: none !important;\r\n        }\r\n        .performance-lite .dot-online,\r\n        .performance-lite .dot-offline,\r\n        .performance-lite .dot-updating,\r\n        .performance-lite .glow-online,\r\n        .performance-lite .glow-offline,\r\n        .performance-lite .animate-spin {\r\n            animation: none !important;\r\n        }\r\n        .performance-lite .dot-online,\r\n        .performance-lite .dot-offline,\r\n        .performance-lite .dot-updating {\r\n            box-shadow: none !important;\r\n        }\r\n        .performance-lite .nav-header,\r\n        .performance-lite .glass-panel,\r\n        .performance-lite .dashboard-shell,\r\n        .performance-lite .dashboard-row,\r\n        .performance-lite .status-chart-shell,\r\n        .performance-lite .server-card,\r\n        .performance-lite .mobile-sheet,\r\n        .performance-lite .mobile-form-sheet,\r\n        .performance-lite .mobile-privacy-menu,\r\n        .performance-lite .tab-nav,\r\n        .performance-lite .dashboard-node-panel,\r\n        .performance-lite .mobile-control-row .glass-panel,\r\n        .performance-lite .mobile-control-row > button,\r\n        .performance-lite .mobile-filter-group button {\r\n            background: rgba(255, 255, 255, 0.92) !important;\r\n            backdrop-filter: none !important;\r\n            -webkit-backdrop-filter: none !important;\r\n            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;\r\n        }\r\n        .performance-lite .mobile-modal-backdrop {\r\n            backdrop-filter: none !important;\r\n            -webkit-backdrop-filter: none !important;\r\n        }\r\n        \r\n        .app-shell { position: relative; z-index: 1; }\r\n        \r\n        .nav-header {\r\n            padding: 14px;\r\n            border-radius: 30px;\r\n            background:\r\n                linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.34)),\r\n                radial-gradient(circle at 8% 12%, rgba(96,165,250,0.16), transparent 34%),\r\n                radial-gradient(circle at 92% 82%, rgba(16,185,129,0.12), transparent 36%);\r\n            backdrop-filter: blur(24px) saturate(178%);\r\n            -webkit-backdrop-filter: blur(24px) saturate(178%);\r\n            border: 1px solid rgba(255,255,255,0.82);\r\n            box-shadow: 0 18px 44px rgba(80,100,160,0.14), inset 0 1px 0 rgba(255,255,255,0.95);\r\n            transform: translateZ(0);\r\n            will-change: transform, opacity;\r\n        }\r\n        .tab-nav-center {\r\n            background: transparent;\r\n            border: 0;\r\n            box-shadow: none;\r\n        }\r\n        \r\n        .glass-panel {\r\n            background: rgba(255, 255, 255, 0.78);\r\n            backdrop-filter: blur(24px);\r\n            -webkit-backdrop-filter: blur(24px);\r\n            border: 1px solid rgba(148, 163, 184, 0.22);\r\n            box-shadow: 0 16px 40px -18px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.92);\r\n            transform: translateZ(0);\r\n            will-change: transform, opacity;\r\n        }\r\n        .brand-title {\r\n            background: linear-gradient(100deg, #0f172a 0%, #0369a1 48%, #059669 100%);\r\n            -webkit-background-clip: text;\r\n            background-clip: text;\r\n            color: transparent;\r\n            text-shadow: 0 18px 34px rgba(14, 116, 144, 0.12);\r\n        }\r\n        .brand-icon-shell {\r\n            background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,249,255,0.74));\r\n            border: 1px solid rgba(255,255,255,0.96);\r\n            box-shadow: 0 18px 36px -24px rgba(15, 23, 42, 0.56), inset 0 1px 0 rgba(255,255,255,0.95);\r\n        }\r\n        .tab-nav {\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 4px;\r\n            padding: 4px;\r\n            background: rgba(255,255,255,0.45);\r\n            backdrop-filter: blur(16px);\r\n            -webkit-backdrop-filter: blur(16px);\r\n            border: 1px solid rgba(255,255,255,0.75);\r\n            border-radius: 30px;\r\n            box-shadow: 0 2px 12px rgba(80,100,160,0.08), 0 1px 0 rgba(255,255,255,0.9) inset;\r\n        }\r\n        .tab-btn {\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 7px;\r\n            padding: 7px 18px;\r\n            border-radius: 24px;\r\n            border: none;\r\n            font-size: 13px;\r\n            font-weight: 600;\r\n            cursor: pointer;\r\n            transition: all 0.2s;\r\n            color: #9199b0;\r\n            background: transparent;\r\n            white-space: nowrap;\r\n        }\r\n        .mobile-tab-short {\r\n            display: none;\r\n        }\r\n        .tab-btn:hover { color: #5a6073; background: rgba(255,255,255,0.5); }\r\n        .tab-btn.active {\r\n            background: rgba(255,255,255,0.92);\r\n            color: #1a1d2e;\r\n            box-shadow: 0 2px 12px rgba(80,100,160,0.12), 0 1px 0 rgba(255,255,255,0.95) inset;\r\n        }\r\n        .tab-dot {\r\n            width: 7px;\r\n            height: 7px;\r\n            border-radius: 50%;\r\n            flex-shrink: 0;\r\n        }\r\n        .dashboard-shell {\r\n            background: rgba(255,255,255,0.34);\r\n            backdrop-filter: blur(24px) saturate(180%);\r\n            -webkit-backdrop-filter: blur(24px) saturate(180%);\r\n            border: 1px solid rgba(255,255,255,0.72);\r\n            box-shadow: 0 22px 64px -42px rgba(15, 23, 42, 0.42), inset 0 1px 0 rgba(255,255,255,0.86);\r\n            transform: translateZ(0);\r\n            will-change: transform, opacity;\r\n        }\r\n        .dashboard-row {\r\n            background: linear-gradient(180deg, rgba(255,255,255,0.72), rgba(248,250,255,0.48));\r\n            backdrop-filter: blur(20px) saturate(170%);\r\n            -webkit-backdrop-filter: blur(20px) saturate(170%);\r\n            border: 1px solid rgba(255,255,255,0.82);\r\n            box-shadow: 0 12px 34px -26px rgba(15, 23, 42, 0.28), inset 0 1px 0 rgba(255,255,255,0.88);\r\n            position: relative;\r\n            overflow: hidden;\r\n        }\r\n        .dashboard-row::before {\r\n            content: '';\r\n            position: absolute;\r\n            inset: 0;\r\n            height: 58%;\r\n            background: linear-gradient(180deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0) 100%);\r\n            pointer-events: none;\r\n        }\r\n        .dashboard-card::before {\r\n            display: none;\r\n        }\r\n        .dashboard-row-online {\r\n            background: linear-gradient(135deg, rgba(16,185,129,0.11), rgba(255,255,255,0.52) 42%, rgba(52,211,153,0.05));\r\n            border-color: rgba(16,185,129,0.2);\r\n        }\r\n        .dashboard-row-offline {\r\n            background: linear-gradient(135deg, rgba(244,63,94,0.12), rgba(255,255,255,0.52) 42%, rgba(251,113,133,0.05));\r\n            border-color: rgba(244,63,94,0.22);\r\n        }\r\n        .dashboard-row-updating {\r\n            background: linear-gradient(135deg, rgba(59,130,246,0.11), rgba(255,255,255,0.52) 42%, rgba(96,165,250,0.05));\r\n            border-color: rgba(59,130,246,0.2);\r\n        }\r\n        .dashboard-row-unknown {\r\n            background: linear-gradient(135deg, rgba(100,116,139,0.08), rgba(255,255,255,0.52) 42%, rgba(148,163,184,0.04));\r\n            border-color: rgba(148,163,184,0.2);\r\n        }\r\n        .dashboard-node-panel {\r\n            background: rgba(255,255,255,0.42);\r\n            border: 1px solid rgba(255,255,255,0.72);\r\n            box-shadow: inset 0 1px 0 rgba(255,255,255,0.78);\r\n        }\r\n        .status-chart-shell {\r\n            background: linear-gradient(180deg, rgba(255,255,255,0.62), rgba(248,250,252,0.42));\r\n            backdrop-filter: blur(12px) saturate(150%);\r\n            -webkit-backdrop-filter: blur(12px) saturate(150%);\r\n            border: 1px solid rgba(255,255,255,0.78);\r\n            box-shadow: inset 0 1px 0 rgba(255,255,255,0.86), inset 0 -1px 0 rgba(148,163,184,0.16);\r\n        }\r\n        .glass-input {\r\n            background: rgba(255, 255, 255, 0.88);\r\n            border: 1px solid rgba(203, 213, 225, 0.92);\r\n            transition: all 0.2s ease;\r\n            color: #334155;\r\n        }\r\n        .glass-input:focus {\r\n            background: #fff;\r\n            border-color: #3b82f6;\r\n            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\r\n        }\r\n        .server-card {\r\n            background: linear-gradient(180deg, rgba(255,255,255,0.76), rgba(246,250,255,0.6));\r\n            backdrop-filter: blur(24px) saturate(180%);\r\n            -webkit-backdrop-filter: blur(24px) saturate(180%);\r\n            border: 1px solid rgba(255,255,255,0.9);\r\n            box-shadow: 0 18px 44px -26px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.94);\r\n            position: relative;\r\n            overflow: hidden;\r\n            transform: translateZ(0);\r\n            will-change: transform, opacity;\r\n        }\r\n        .server-card::before {\r\n            content: '';\r\n            position: absolute;\r\n            inset: 0;\r\n            background: linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.18) 48%, transparent 100%);\r\n            pointer-events: none;\r\n        }\r\n        .server-card-head {\r\n            position: relative;\r\n            padding: 16px 20px;\r\n            margin: -24px -24px 16px;\r\n            border: 1px solid rgba(255,255,255,0.58);\r\n            border-bottom: 1px solid rgba(255,255,255,0.38);\r\n            border-radius: 32px 32px 18px 18px;\r\n            overflow: hidden;\r\n        }\r\n        .server-card-head::before {\r\n            content: '';\r\n            position: absolute;\r\n            inset: 0;\r\n            background: linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 100%);\r\n            pointer-events: none;\r\n        }\r\n        .server-card-head > * { position: relative; z-index: 1; }\r\n        .server-card-head-online {\r\n            background: linear-gradient(135deg, rgba(16,185,129,0.16), rgba(52,211,153,0.06));\r\n            border-color: rgba(16,185,129,0.22);\r\n        }\r\n        .server-card-head-offline {\r\n            background: linear-gradient(135deg, rgba(244,63,94,0.18), rgba(251,113,133,0.07));\r\n            border-color: rgba(244,63,94,0.24);\r\n        }\r\n        .server-card-head-updating {\r\n            background: linear-gradient(135deg, rgba(59,130,246,0.16), rgba(96,165,250,0.06));\r\n            border-color: rgba(59,130,246,0.22);\r\n        }\r\n        .server-card-head-unknown {\r\n            background: linear-gradient(135deg, rgba(100,116,139,0.12), rgba(148,163,184,0.05));\r\n            border-color: rgba(148,163,184,0.2);\r\n        }\r\n        .server-card-section {\r\n            background: rgba(255,255,255,0.36);\r\n            border: 1px solid rgba(255,255,255,0.72);\r\n            box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);\r\n        }\r\n        .server-card-metrics { margin-bottom: 14px; }\r\n        .server-card-media { margin-top: auto; }\r\n        .server-card-footer {\r\n            margin-top: 16px;\r\n            padding-top: 12px;\r\n            border-top: 1px solid rgba(148,163,184,0.18);\r\n        }\r\n        .overview-stat {\r\n            border: 1.5px solid rgba(255,255,255,0.75);\r\n            box-shadow: 0 8px 32px rgba(80,100,160,0.1), 0 1.5px 0 rgba(255,255,255,0.9) inset;\r\n        }\r\n        .overview-stat::before {\r\n            content: '';\r\n            position: absolute;\r\n            inset: 0;\r\n            height: 58%;\r\n            background: linear-gradient(180deg, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0) 100%);\r\n            pointer-events: none;\r\n        }\r\n        .overview-stat-online {\r\n            background: linear-gradient(135deg, rgba(16,185,129,0.13), rgba(52,211,153,0.06));\r\n            border-color: rgba(16,185,129,0.24);\r\n        }\r\n        .overview-stat-online:hover { box-shadow: 0 12px 36px rgba(16,185,129,0.16), 0 1.5px 0 rgba(255,255,255,0.9) inset; }\r\n        .overview-stat-offline {\r\n            background: linear-gradient(135deg, rgba(244,63,94,0.12), rgba(251,113,133,0.06));\r\n            border-color: rgba(244,63,94,0.22);\r\n        }\r\n        .overview-stat-offline:hover { box-shadow: 0 12px 36px rgba(244,63,94,0.16), 0 1.5px 0 rgba(255,255,255,0.9) inset; }\r\n        .overview-stat-uptime {\r\n            background: linear-gradient(135deg, rgba(59,126,255,0.13), rgba(96,165,250,0.06));\r\n            border-color: rgba(59,126,255,0.24);\r\n        }\r\n        .overview-stat-uptime:hover { box-shadow: 0 12px 36px rgba(59,126,255,0.16), 0 1.5px 0 rgba(255,255,255,0.9) inset; }\r\n        .overview-stat-alert {\r\n            background: linear-gradient(135deg, rgba(139,92,246,0.13), rgba(167,139,250,0.06));\r\n            border-color: rgba(139,92,246,0.24);\r\n        }\r\n        .overview-stat-alert:hover { box-shadow: 0 12px 36px rgba(139,92,246,0.16), 0 1.5px 0 rgba(255,255,255,0.9) inset; }\r\n        .mobile-control-row { display: contents; }\r\n        @media (min-width: 1024px) {\r\n            .growth-dashboard {\r\n                gap: 14px;\r\n            }\r\n            .growth-dashboard .growth-list {\r\n                gap: 8px;\r\n            }\r\n            .growth-dashboard .growth-rank-row {\r\n                padding: 14px 18px;\r\n                gap: 16px;\r\n                min-height: 78px;\r\n                border-radius: 22px;\r\n            }\r\n            .growth-dashboard .growth-rank-row:hover {\r\n                background: linear-gradient(180deg, rgba(255,255,255,0.76), rgba(248,250,252,0.5));\r\n                box-shadow: 0 18px 42px -30px rgba(15,23,42,0.28), inset 0 1px 0 rgba(255,255,255,0.9);\r\n            }\r\n            .growth-dashboard .growth-server-cell {\r\n                min-width: 0;\r\n            }\r\n            .growth-dashboard .growth-rank-badge {\r\n                width: 46px;\r\n                height: 46px;\r\n                border-radius: 18px;\r\n            }\r\n            .growth-dashboard .growth-metric-card {\r\n                min-width: 0;\r\n                align-self: center;\r\n            }\r\n            .growth-dashboard .growth-total-cell {\r\n                min-width: 0;\r\n            }\r\n            .growth-dashboard .growth-total-pill {\r\n                min-width: 104px;\r\n            }\r\n        }\r\n        @media (max-width: 640px) {\r\n            body { -webkit-tap-highlight-color: transparent; }\r\n            .app-shell {\r\n                min-height: 100svh;\r\n                padding-top: env(safe-area-inset-top);\r\n                padding-bottom: env(safe-area-inset-bottom);\r\n            }\r\n            .orb { filter: blur(58px); opacity: 0.42; }\r\n            .orb-1 { width: 360px; height: 360px; top: -10%; left: -35%; }\r\n            .orb-2 { width: 320px; height: 320px; top: 24%; right: -38%; }\r\n            .orb-3 { width: 300px; height: 300px; bottom: 6%; left: 18%; }\r\n            .orb-4 { display: none; }\r\n            .mobile-page {\r\n                padding: 14px 14px calc(24px + env(safe-area-inset-bottom));\r\n                max-width: none;\r\n            }\r\n            .mobile-header {\r\n                margin-bottom: 14px;\r\n                gap: 12px;\r\n                padding: 13px;\r\n                border-radius: 28px;\r\n                background:\r\n                    linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.36)),\r\n                    radial-gradient(circle at 12% 18%, rgba(96,165,250,0.22), transparent 36%),\r\n                    radial-gradient(circle at 88% 82%, rgba(16,185,129,0.16), transparent 38%);\r\n                backdrop-filter: blur(24px) saturate(175%);\r\n                -webkit-backdrop-filter: blur(24px) saturate(175%);\r\n                border: 1px solid rgba(255,255,255,0.82);\r\n                box-shadow: 0 14px 36px rgba(80,100,160,0.13), 0 1px 0 rgba(255,255,255,0.95) inset;\r\n                overflow: hidden;\r\n            }\r\n            .mobile-title-row {\r\n                width: 100%;\r\n                display: flex;\r\n                align-items: center;\r\n                gap: 10px;\r\n            }\r\n            .mobile-title-row .brand-icon-shell {\r\n                width: 46px;\r\n                height: 46px;\r\n                border-radius: 17px;\r\n                flex-shrink: 0;\r\n            }\r\n            .mobile-title-row .brand-icon-shell svg {\r\n                width: 24px;\r\n                height: 24px;\r\n            }\r\n            .mobile-title-row h1 {\r\n                font-size: 1.42rem;\r\n                line-height: 1.12;\r\n                min-width: 0;\r\n                gap: 10px;\r\n            }\r\n            .mobile-title-row .brand-title {\r\n                white-space: normal;\r\n                overflow-wrap: anywhere;\r\n            }\r\n            .mobile-subtitle {\r\n                margin-top: 6px;\r\n                font-size: 11px;\r\n                letter-spacing: 0.14em;\r\n                padding-left: 0;\r\n            }\r\n            .mobile-header-toggle {\r\n                margin-left: 56px;\r\n                min-height: 34px;\r\n                background:\r\n                    linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.34)),\r\n                    url(\"data:image/svg+xml,%3Csvg width='26' height='26' viewBox='0 0 26 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230f172a' stroke-opacity='.06' stroke-width='1'%3E%3Cpath d='M0 13h26M13 0v26'/%3E%3C/g%3E%3C/svg%3E\");\r\n                backdrop-filter: blur(18px) saturate(170%);\r\n                -webkit-backdrop-filter: blur(18px) saturate(170%);\r\n                box-shadow: 0 8px 18px rgba(80,100,160,0.1), inset 0 1px 0 rgba(255,255,255,0.92);\r\n            }\r\n            .mobile-header-caret {\r\n                transform-origin: center;\r\n            }\r\n            .mobile-header-body {\r\n                overflow: hidden;\r\n                transition: max-height 0.28s ease, opacity 0.22s ease, transform 0.28s ease, margin-top 0.28s ease;\r\n            }\r\n            .mobile-header-collapsed .mobile-header-body {\r\n                max-height: 0;\r\n                opacity: 0;\r\n                transform: translateY(-6px);\r\n                pointer-events: none;\r\n                margin-top: -8px;\r\n                padding-top: 0;\r\n                padding-bottom: 0;\r\n                border-width: 0;\r\n            }\r\n            .mobile-header-open .mobile-header-body {\r\n                max-height: 520px;\r\n                opacity: 1;\r\n                transform: translateY(0);\r\n            }\r\n            .mobile-actions {\r\n                width: 100%;\r\n                display: grid;\r\n                grid-template-columns: repeat(2, minmax(0, 1fr));\r\n                gap: 9px;\r\n                align-items: center;\r\n                padding: 9px;\r\n                border-radius: 23px;\r\n                background: rgba(255,255,255,0.36);\r\n                border: 1px solid rgba(255,255,255,0.76);\r\n                box-shadow: inset 0 1px 0 rgba(255,255,255,0.86);\r\n            }\r\n            .mobile-icon-group {\r\n                grid-column: 1 / -1;\r\n                display: flex;\r\n                justify-content: flex-end;\r\n                gap: 8px;\r\n                margin-right: 0;\r\n            }\r\n            .mobile-actions button {\r\n                min-height: 44px;\r\n            }\r\n            .mobile-actions > button {\r\n                color: #334155 !important;\r\n                background:\r\n                    linear-gradient(180deg, rgba(255,255,255,0.74), rgba(255,255,255,0.34)),\r\n                    radial-gradient(circle at 18% 18%, rgba(56,189,248,0.2), transparent 42%),\r\n                    radial-gradient(circle at 88% 78%, rgba(16,185,129,0.16), transparent 40%) !important;\r\n                border: 1px solid rgba(255,255,255,0.78) !important;\r\n                box-shadow: 0 10px 24px rgba(80,100,160,0.12), inset 0 1px 0 rgba(255,255,255,0.92) !important;\r\n                backdrop-filter: blur(18px) saturate(170%);\r\n                -webkit-backdrop-filter: blur(18px) saturate(170%);\r\n            }\r\n            .mobile-icon-group button {\r\n                width: 42px;\r\n                height: 42px;\r\n                min-height: 42px;\r\n                border-radius: 15px;\r\n                background: rgba(255,255,255,0.72);\r\n            }\r\n            .mobile-privacy-menu {\r\n                width: min(86vw, 340px);\r\n                z-index: 70;\r\n                padding: 18px;\r\n                border-radius: 28px;\r\n            }\r\n            .mobile-privacy-menu button {\r\n                width: 100%;\r\n                height: auto;\r\n                min-height: 56px;\r\n                border-radius: 18px;\r\n                background: transparent;\r\n                justify-content: flex-start;\r\n                padding: 12px 14px;\r\n            }\r\n            .mobile-privacy-menu button > div {\r\n                min-width: 0;\r\n            }\r\n            .mobile-privacy-backdrop {\r\n                position: fixed;\r\n                inset: 0;\r\n                z-index: 0;\r\n                background: rgba(15,23,42,0.22);\r\n                backdrop-filter: blur(8px);\r\n                -webkit-backdrop-filter: blur(8px);\r\n            }\r\n            .mobile-primary-btn,\r\n            .mobile-refresh-btn {\r\n                justify-content: center;\r\n                padding: 0 10px;\r\n                height: 46px;\r\n                border-radius: 17px;\r\n                font-size: 12px;\r\n                font-weight: 900;\r\n                width: 100%;\r\n                text-align: center;\r\n            }\r\n            .mobile-primary-btn { font-size: 12px; }\r\n            .mobile-primary-btn svg {\r\n                width: 15px;\r\n                height: 15px;\r\n            }\r\n            .mobile-primary-btn::after {\r\n                content: none;\r\n                font-size: 12px;\r\n                font-weight: 900;\r\n                line-height: 1;\r\n            }\r\n            .mobile-refresh-btn span {\r\n                width: auto;\r\n                min-width: 0;\r\n                font-size: 12px;\r\n                display: inline-flex;\r\n                align-items: center;\r\n                justify-content: center;\r\n                line-height: 1;\r\n            }\r\n            .mobile-stats-strip {\r\n                display: grid;\r\n                grid-template-columns: repeat(2, minmax(0, 1fr));\r\n                gap: 10px;\r\n                overflow: visible;\r\n                padding: 0;\r\n                margin: 0 0 14px;\r\n            }\r\n            .mobile-stats-strip::-webkit-scrollbar,\r\n            .mobile-control-row::-webkit-scrollbar { display: none; }\r\n            .mobile-stat-card {\r\n                min-width: 0;\r\n                padding: 12px;\r\n                border-radius: 22px;\r\n                gap: 9px;\r\n                isolation: isolate;\r\n                background: rgba(255,255,255,0.5);\r\n                border-width: 1px;\r\n                box-shadow: 0 10px 26px rgba(80,100,160,0.1), inset 0 1px 0 rgba(255,255,255,0.9);\r\n            }\r\n            .mobile-stat-card > .absolute,\r\n            .mobile-stat-card::before { display: none; }\r\n            .mobile-stat-card.overview-stat-online {\r\n                background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(255,255,255,0.56) 54%, rgba(255,255,255,0.36));\r\n                border-color: rgba(16,185,129,0.2);\r\n            }\r\n            .mobile-stat-card.overview-stat-offline {\r\n                background: linear-gradient(135deg, rgba(244,63,94,0.19), rgba(255,255,255,0.56) 54%, rgba(255,255,255,0.36));\r\n                border-color: rgba(244,63,94,0.2);\r\n            }\r\n            .mobile-stat-card.overview-stat-uptime {\r\n                background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(255,255,255,0.56) 54%, rgba(255,255,255,0.36));\r\n                border-color: rgba(59,130,246,0.2);\r\n            }\r\n            .mobile-stat-card.overview-stat-alert {\r\n                background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(255,255,255,0.56) 54%, rgba(255,255,255,0.36));\r\n                border-color: rgba(139,92,246,0.2);\r\n            }\r\n            .mobile-stat-card .stat-icon-shell {\r\n                width: 36px;\r\n                height: 36px;\r\n                border-radius: 14px;\r\n                background: rgba(255,255,255,0.68);\r\n            }\r\n            .mobile-stat-card .stat-icon-shell svg {\r\n                width: 19px;\r\n                height: 19px;\r\n            }\r\n            .mobile-stat-card .stat-value {\r\n                font-size: 17px;\r\n                line-height: 1;\r\n            }\r\n            .mobile-stat-card .stat-label {\r\n                font-size: 11px;\r\n                letter-spacing: 0.08em;\r\n            }\r\n            .mobile-action-bar {\r\n                margin-bottom: 14px;\r\n                gap: 10px;\r\n                padding: 0;\r\n                border-radius: 0;\r\n                background: transparent;\r\n                border: 0;\r\n                box-shadow: none;\r\n                align-items: center;\r\n            }\r\n            .mobile-controls {\r\n                width: 100%;\r\n                display: flex;\r\n                flex-direction: column;\r\n                gap: 9px;\r\n            }\r\n            .mobile-control-row {\r\n                display: flex;\r\n                flex-wrap: nowrap;\r\n                gap: 6px;\r\n                overflow-x: auto;\r\n                padding: 0 28px 0 0;\r\n                border-radius: 0;\r\n                background: transparent;\r\n                border: 0;\r\n                box-shadow: none;\r\n                -webkit-overflow-scrolling: touch;\r\n                -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);\r\n                mask-image: linear-gradient(to right, black 85%, transparent 100%);\r\n            }\r\n            .mobile-control-row.has-range {\r\n                display: flex;\r\n                flex-wrap: nowrap;\r\n            }\r\n            .mobile-control-row.no-range {\r\n                display: flex;\r\n                flex-wrap: nowrap;\r\n            }\r\n            .mobile-control-row .glass-panel,\r\n            .mobile-control-row > button {\r\n                display: flex;\r\n                flex-shrink: 1;\r\n            }\r\n            .mobile-control-row .glass-panel {\r\n                border-radius: 999px;\r\n                width: auto;\r\n                justify-content: center;\r\n                background: rgba(255,255,255,0.46);\r\n                border: 1px solid rgba(255,255,255,0.72);\r\n                backdrop-filter: blur(16px) saturate(160%);\r\n                -webkit-backdrop-filter: blur(16px) saturate(160%);\r\n                box-shadow: 0 7px 18px rgba(80,100,160,0.07), inset 0 1px 0 rgba(255,255,255,0.78);\r\n            }\r\n            .mobile-filter-group {\r\n                width: auto;\r\n                display: inline-flex !important;\r\n                flex-wrap: nowrap;\r\n                gap: 6px;\r\n                padding: 0;\r\n                border-radius: 999px;\r\n                justify-content: center;\r\n                background: transparent !important;\r\n                border: 0 !important;\r\n                box-shadow: none !important;\r\n                backdrop-filter: none;\r\n                -webkit-backdrop-filter: none;\r\n            }\r\n            .mobile-range-group {\r\n                flex: 0 0 auto;\r\n                order: 1;\r\n            }\r\n            .mobile-status-group {\r\n                flex: 0 0 auto;\r\n                order: 2;\r\n            }\r\n            .mobile-filter-group button {\r\n                flex: 0 0 auto;\r\n                min-width: 0;\r\n                min-height: 36px;\r\n                padding-left: 9px;\r\n                padding-right: 9px;\r\n                border-radius: 999px;\r\n                background: rgba(255,255,255,0.46);\r\n                border: 1px solid rgba(255,255,255,0.72);\r\n                backdrop-filter: blur(16px) saturate(160%);\r\n                -webkit-backdrop-filter: blur(16px) saturate(160%);\r\n                box-shadow: 0 7px 18px rgba(80,100,160,0.07), inset 0 1px 0 rgba(255,255,255,0.78);\r\n            }\r\n            .mobile-sort-button {\r\n                width: auto;\r\n                display: inline-flex !important;\r\n                justify-content: center;\r\n                min-height: 36px;\r\n                order: 3;\r\n                padding-left: 10px;\r\n                padding-right: 10px;\r\n            }\r\n            .mobile-control-row.has-range .mobile-range-group,\r\n            .mobile-control-row.has-range .mobile-status-group,\r\n            .mobile-control-row.has-range .mobile-sort-button {\r\n                flex: 0 0 auto;\r\n            }\r\n            .mobile-control-row .glass-panel button {\r\n                flex: 1;\r\n                min-height: 36px;\r\n            }\r\n            .mobile-control-row > button {\r\n                width: 100%;\r\n                justify-content: center;\r\n                min-height: 40px;\r\n                border-radius: 999px;\r\n                background: rgba(255,255,255,0.46);\r\n                border: 1px solid rgba(255,255,255,0.72);\r\n                backdrop-filter: blur(16px) saturate(160%);\r\n                -webkit-backdrop-filter: blur(16px) saturate(160%);\r\n                box-shadow: 0 7px 18px rgba(80,100,160,0.07), inset 0 1px 0 rgba(255,255,255,0.78);\r\n            }\r\n            .mobile-search {\r\n                width: 100%;\r\n                border-radius: 20px;\r\n                box-shadow: 0 8px 22px rgba(80,100,160,0.07);\r\n            }\r\n            .mobile-search input {\r\n                min-height: 44px;\r\n                border-radius: 18px;\r\n                background: rgba(255,255,255,0.68);\r\n                border-color: rgba(255,255,255,0.86);\r\n            }\r\n            .mobile-server-grid {\r\n                display: flex;\r\n                flex-direction: column;\r\n                gap: 14px;\r\n            }\r\n            .server-card.mobile-card {\r\n                padding: 16px;\r\n                border-radius: 28px;\r\n                background-image:\r\n                    linear-gradient(180deg, rgba(255,255,255,0.72), rgba(246,250,255,0.54)),\r\n                    url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230f172a' stroke-opacity='.045' stroke-width='1'%3E%3Cpath d='M8 18h20v12h16v24M12 54h18M42 10v18h20M54 28v16h10M24 8v10M8 36h12'/%3E%3Ccircle cx='28' cy='30' r='2' fill='%230f172a' fill-opacity='.04' stroke='none'/%3E%3Ccircle cx='44' cy='54' r='2' fill='%230f172a' fill-opacity='.04' stroke='none'/%3E%3C/g%3E%3C/svg%3E\");\r\n                backdrop-filter: blur(12px) saturate(168%);\r\n                -webkit-backdrop-filter: blur(12px) saturate(168%);\r\n            }\r\n            .mobile-card .server-card-head {\r\n                margin: -16px -16px 14px;\r\n                padding: 14px;\r\n                border-radius: 28px 28px 18px 18px;\r\n                flex-direction: column;\r\n                gap: 12px;\r\n            }\r\n            .mobile-card .server-card-head > .flex:first-child {\r\n                width: 100%;\r\n                gap: 12px;\r\n            }\r\n            .mobile-card .server-card-head > .flex:first-child > div:first-child {\r\n                width: 48px;\r\n                height: 48px;\r\n                border-radius: 17px;\r\n            }\r\n            .mobile-card .server-card-head h3 {\r\n                font-size: 17px;\r\n                line-height: 1.18;\r\n                white-space: normal;\r\n                display: -webkit-box;\r\n                -webkit-line-clamp: 2;\r\n                -webkit-box-orient: vertical;\r\n            }\r\n            .mobile-card .server-card-head p {\r\n                max-width: 100%;\r\n                font-size: 11px;\r\n            }\r\n            .mobile-card .server-card-head > div:last-child {\r\n                align-self: flex-start;\r\n            }\r\n            .mobile-card .server-card-metrics {\r\n                padding: 14px;\r\n                margin-bottom: 12px;\r\n                border-radius: 20px;\r\n            }\r\n            .mobile-card .server-card-metrics span.text-3xl {\r\n                font-size: 1.55rem;\r\n            }\r\n            .mobile-card .server-card-media {\r\n                padding: 13px;\r\n                border-radius: 20px;\r\n            }\r\n            .mobile-card .server-card-media .grid {\r\n                grid-auto-flow: column;\r\n                grid-auto-columns: minmax(80px, 1fr);\r\n                grid-template-columns: none;\r\n                gap: 0;\r\n                overflow-x: auto;\r\n                -webkit-overflow-scrolling: touch;\r\n                scrollbar-width: none;\r\n            }\r\n            .mobile-card .server-card-media .grid::-webkit-scrollbar {\r\n                display: none;\r\n            }\r\n            .mobile-card .server-card-footer {\r\n                margin-top: 10px;\r\n                padding-top: 8px;\r\n                align-items: center;\r\n                gap: 8px;\r\n                flex-direction: row;\r\n                flex-wrap: nowrap;\r\n            }\r\n            .mobile-card .server-card-footer > div:first-child {\r\n                flex: 0 0 auto;\r\n                min-width: 0;\r\n                white-space: nowrap;\r\n            }\r\n            .mobile-card-actions {\r\n                opacity: 1;\r\n                width: auto;\r\n                margin-left: auto;\r\n                display: grid;\r\n                grid-template-columns: repeat(3, minmax(0, 1fr));\r\n                gap: 6px;\r\n            }\r\n            .mobile-card-actions button {\r\n                min-height: 34px;\r\n                border-radius: 11px;\r\n                font-size: 12px;\r\n                font-weight: 800;\r\n                padding-left: 10px;\r\n                padding-right: 10px;\r\n            }\r\n            .dashboard-shell.mobile-dashboard {\r\n                padding: 10px;\r\n                border-radius: 26px;\r\n                gap: 10px;\r\n            }\r\n            .growth-dashboard .growth-header-row {\r\n                padding: 12px;\r\n                gap: 12px;\r\n            }\r\n            .growth-dashboard .growth-header-row .grid {\r\n                grid-template-columns: repeat(2, minmax(0, 1fr));\r\n            }\r\n            .growth-dashboard .growth-summary-grid {\r\n                grid-template-columns: repeat(3, minmax(0, 1fr));\r\n                gap: 10px;\r\n            }\r\n            .growth-dashboard .growth-summary-card {\r\n                padding: 12px;\r\n                border-radius: 20px;\r\n            }\r\n            .growth-dashboard .growth-summary-card .text-2xl {\r\n                font-size: 1.18rem;\r\n                line-height: 1.05;\r\n            }\r\n            .growth-dashboard .growth-summary-card .text-[10px] {\r\n                font-size: 11px;\r\n                letter-spacing: 0.08em;\r\n            }\r\n            .growth-dashboard .growth-list {\r\n                gap: 10px;\r\n            }\r\n            .growth-dashboard .growth-rank-row {\r\n                padding: 12px;\r\n                gap: 10px;\r\n                grid-template-columns: minmax(0, 1fr) auto;\r\n                align-items: start;\r\n            }\r\n            .growth-dashboard .growth-rank-main {\r\n                gap: 10px;\r\n                align-items: flex-start;\r\n                grid-column: 1;\r\n                grid-row: 1;\r\n            }\r\n            .growth-dashboard .growth-rank-badge {\r\n                width: 36px;\r\n                height: 36px;\r\n                border-radius: 14px;\r\n            }\r\n            .growth-dashboard .growth-server-icon {\r\n                width: 42px;\r\n                height: 42px;\r\n                border-radius: 15px;\r\n            }\r\n            .growth-dashboard .growth-server-name .text-lg {\r\n                font-size: 15px;\r\n                line-height: 1.2;\r\n            }\r\n            .growth-dashboard .growth-server-name .text-[11px] {\r\n                font-size: 11px;\r\n            }\r\n            .growth-dashboard .growth-metric-grid {\r\n                grid-template-columns: repeat(3, minmax(0, 1fr));\r\n                gap: 8px;\r\n                grid-column: 1 / -1;\r\n                grid-row: 2;\r\n            }\r\n            .growth-dashboard .growth-metric-card {\r\n                padding: 10px;\r\n                border-radius: 16px;\r\n            }\r\n            .growth-dashboard .growth-metric-card .text-sm {\r\n                font-size: 12px;\r\n            }\r\n            .growth-dashboard .growth-metric-card .text-[11px] {\r\n                font-size: 11px;\r\n            }\r\n            .growth-dashboard .growth-total-cell {\r\n                text-align: right;\r\n                grid-column: 2;\r\n                grid-row: 1;\r\n            }\r\n            .growth-dashboard .growth-total-pill {\r\n                width: auto;\r\n                min-width: 0;\r\n                justify-content: center;\r\n                padding: 8px 10px;\r\n                font-size: 0.95rem;\r\n                min-height: 38px;\r\n                border-radius: 14px;\r\n            }\r\n            .growth-dashboard .growth-total-cell .text-[10px] {\r\n                font-size: 11px;\r\n                letter-spacing: 0.06em;\r\n            }\r\n            .mobile-dashboard .dashboard-row {\r\n                padding: 11px;\r\n                border-radius: 24px;\r\n                gap: 10px;\r\n                background: linear-gradient(180deg, rgba(255,255,255,0.58), rgba(255,255,255,0.34));\r\n                border-color: rgba(255,255,255,0.78);\r\n            }\r\n            .mobile-dashboard .dashboard-row::before { display: none; }\r\n            .mobile-dashboard .dashboard-row-online {\r\n                background: linear-gradient(135deg, rgba(16,185,129,0.17), rgba(255,255,255,0.52) 48%, rgba(255,255,255,0.34));\r\n            }\r\n            .mobile-dashboard .dashboard-row-offline {\r\n                background: linear-gradient(135deg, rgba(244,63,94,0.17), rgba(255,255,255,0.52) 48%, rgba(255,255,255,0.34));\r\n            }\r\n            .mobile-dashboard .dashboard-row-updating {\r\n                background: linear-gradient(135deg, rgba(59,130,246,0.17), rgba(255,255,255,0.52) 48%, rgba(255,255,255,0.34));\r\n            }\r\n            .mobile-dashboard .dashboard-node-panel {\r\n                padding: 11px;\r\n                border-radius: 19px;\r\n                gap: 11px;\r\n                background: rgba(255,255,255,0.44);\r\n            }\r\n            .mobile-dashboard .dashboard-node-panel > .absolute { display: none; }\r\n            .mobile-dashboard .dashboard-node-panel > div:nth-child(2) {\r\n                width: 44px;\r\n                height: 44px;\r\n                border-radius: 15px;\r\n            }\r\n            .mobile-dashboard .dashboard-node-panel .font-black {\r\n                font-size: 15px;\r\n            }\r\n            .mobile-dashboard .status-chart-shell {\r\n                min-height: 4.65rem;\r\n                border-radius: 19px;\r\n                padding: 9px 10px;\r\n                background: rgba(255,255,255,0.48);\r\n                border-color: rgba(255,255,255,0.78);\r\n            }\r\n            .mobile-modal {\r\n                align-items: flex-end;\r\n                padding: 0;\r\n            }\r\n            .mobile-modal-backdrop {\r\n                background: rgba(15,23,42,0.24);\r\n            }\r\n            .mobile-sheet {\r\n                width: 100%;\r\n                max-width: none;\r\n                max-height: calc(100vh - 18px);\r\n                border-radius: 28px 28px 0 0;\r\n                padding: 28px 18px 18px;\r\n                overflow: hidden;\r\n                display: flex;\r\n                flex-direction: column;\r\n                min-height: 0;\r\n            }\r\n            .mobile-sheet::before {\r\n                content: '';\r\n                position: absolute;\r\n                top: 10px;\r\n                left: 50%;\r\n                width: 58px;\r\n                height: 6px;\r\n                border-radius: 999px;\r\n                transform: translateX(-50%);\r\n                background:\r\n                    linear-gradient(90deg, transparent 0 8px, rgba(15,23,42,0.18) 8px 10px, transparent 10px 18px),\r\n                    linear-gradient(180deg, rgba(255,255,255,0.82), rgba(148,163,184,0.28));\r\n                box-shadow: inset 0 1px 1px rgba(255,255,255,0.96), inset 0 -1px 0 rgba(15,23,42,0.14), 0 5px 14px rgba(15,23,42,0.12);\r\n                opacity: 0.86;\r\n                pointer-events: none;\r\n            }\r\n            .mobile-sheet h2 {\r\n                font-size: 20px;\r\n                margin-bottom: 16px;\r\n                padding-right: 34px;\r\n            }\r\n            .mobile-sheet .space-y-4 {\r\n                padding-right: 2px;\r\n            }\r\n            .mobile-sheet textarea {\r\n                min-height: 104px;\r\n            }\r\n            .mobile-sheet .grid-cols-\\\\[80px_1fr_80px\\\\] {\r\n                grid-template-columns: 70px minmax(0,1fr) 64px;\r\n                gap: 7px;\r\n            }\r\n            .mobile-form-sheet {\r\n                display: flex;\r\n                flex-direction: column;\r\n                height: calc(100vh - 18px);\r\n                min-height: 0;\r\n            }\r\n            .mobile-form-body {\r\n                flex: 1 1 auto;\r\n                min-height: 0;\r\n                overflow-y: auto;\r\n                padding-right: 2px;\r\n                -webkit-overflow-scrolling: touch;\r\n            }\r\n            .mobile-form-footer {\r\n                flex: none;\r\n                margin-top: 18px;\r\n                padding-top: 18px;\r\n                border-top: 1px solid rgba(226,232,240,0.8);\r\n                background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.42));\r\n            }\r\n            .mobile-icon-sheet {\r\n                height: calc(100vh - 18px);\r\n            }\r\n            .mobile-icon-sheet .grid {\r\n                grid-template-columns: repeat(3, minmax(0, 1fr));\r\n                gap: 10px;\r\n                max-height: calc(100vh - 180px);\r\n            }\r\n        }\r\n        \r\n        @media (min-width: 641px) {\r\n            .mobile-modal {\r\n                align-items: center;\r\n                padding: 16px;\r\n            }\r\n            .mobile-sheet {\r\n                max-height: calc(100vh - 32px);\r\n                overflow: hidden;\r\n                display: flex;\r\n                flex-direction: column;\r\n                min-height: 0;\r\n            }\r\n            .mobile-form-sheet {\r\n                height: auto;\r\n                max-height: calc(100vh - 32px);\r\n            }\r\n            .mobile-form-body {\r\n                flex: 1 1 auto;\r\n                min-height: 0;\r\n                overflow-y: auto;\r\n                padding-right: 4px;\r\n                -webkit-overflow-scrolling: touch;\r\n            }\r\n            .mobile-form-footer {\r\n                flex: none;\r\n                margin-top: 20px;\r\n                padding-top: 20px;\r\n                border-top: 1px solid rgba(226,232,240,0.8);\r\n                background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.42));\r\n            }\r\n        }\r\n        ::-webkit-scrollbar { width: 6px; }\r\n        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }\r\n    </style>\r\n</head>\r\n<body>\r\n    <div id=\"root\"><div style=\"min-height:100vh;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:700;\">页面加载中...</div></div>\r\n    <div id=\"boot-error\" style=\"display:none;max-width:760px;margin:48px auto;padding:20px;border:1px solid #7f1d1d;border-radius:16px;background:#1e293b;color:#fecaca;font-family:system-ui;white-space:pre-wrap;\"></div>\r\n    <script>\r\n        window.addEventListener('error', (event) => {\r\n            if (event.message === 'Script error.') return;\r\n            showBootError('页面脚本错误：' + (event.message || 'Unknown error') + (event.filename ? '\\\\n' + event.filename + ':' + event.lineno : ''));\r\n        });\r\n        window.addEventListener('DOMContentLoaded', function() {\r\n            if (window.Babel && window.Babel.transform) {\r\n                var scripts = document.querySelectorAll('script[type=\"text/babel\"]');\r\n                scripts.forEach(function(script) {\r\n                    try {\r\n                        window.Babel.transform(script.textContent || '', { presets: ['react'] });\r\n                    } catch(e) {\r\n                        showBootError('JSX 编译失败：' + (e.message || e.toString()));\r\n                    }\r\n                });\r\n            }\r\n        });\r\n        window.addEventListener('unhandledrejection', (event) => {\r\n            showBootError('页面异步错误：' + ((event.reason && (event.reason.message || event.reason.toString())) || 'Unknown rejection'));\r\n        });\r\n        setTimeout(function() {\r\n            var root = document.getElementById('root');\r\n            var bootError = document.getElementById('boot-error');\r\n            if (root && root.textContent.indexOf('页面加载中') !== -1 && bootError && bootError.style.display === 'none') {\r\n                showBootError('前端没有启动：' + (window.Babel ? 'Babel 已加载但 JSX 脚本未执行。' : 'Babel CDN 未加载。') + '请清理缓存后重新加载，或检查浏览器控制台。');\r\n            }\r\n        }, 3000);\r\n    </script>\r\n    <script type=\"text/babel\" data-presets=\"react\">\r\n        const { useState, useEffect, useRef, useMemo } = React;\n        const APP_VERSION = \"2026.07.04.1\";\n\n        /*\r\n         * 前端内置 SVG 图标。\r\n         *\r\n         * 负责 Icon 基础组件和 Icons 图标集合。后续只改图标路径或新增内置图标时看这里。\r\n         */\r\n        // --- 内置 SVG 图标 ---\r\n        const Icon = ({ path, className = \"w-4 h-4\", viewBox = \"0 0 24 24\" }) => (\r\n            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox={viewBox} fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\" className={className} dangerouslySetInnerHTML={{ __html: path }} />\r\n        );\r\n        const Icons = {\r\n            Activity: (p) => <Icon {...p} path='<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"></polyline>' />,\r\n            Server: (p) => <Icon {...p} path='<rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect><rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect><line x1=\"6\" y1=\"6\" x2=\"6.01\" y2=\"6\"></line><line x1=\"6\" y1=\"18\" x2=\"6.01\" y2=\"18\"></line>' />,\r\n            Settings: (p) => <Icon {...p} path='<circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"></path>' />,\r\n            Plus: (p) => <Icon {...p} path='<line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>' />,\r\n            Eye: (p) => <Icon {...p} path='<path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>' />,\r\n            EyeOff: (p) => <Icon {...p} path='<path d=\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>' />,\r\n            Glasses: (p) => <Icon {...p} path='<circle cx=\"6\" cy=\"15\" r=\"4\"></circle><circle cx=\"18\" cy=\"15\" r=\"4\"></circle><path d=\"M10 15h4\"></path><path d=\"M2.5 13 5 5\"></path><path d=\"M21.5 13 19 5\"></path>' />,\r\n            RefreshCw: (p) => <Icon {...p} path='<polyline points=\"23 4 23 10 17 10\"></polyline><polyline points=\"1 20 1 14 7 14\"></polyline><path d=\"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15\"></path>' />,\r\n            Film: (p) => <Icon {...p} path='<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"2.18\" ry=\"2.18\"></rect><line x1=\"7\" y1=\"2\" x2=\"7\" y2=\"22\"></line><line x1=\"17\" y1=\"2\" x2=\"17\" y2=\"22\"></line><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"2\" y1=\"7\" x2=\"7\" y2=\"7\"></line><line x1=\"2\" y1=\"17\" x2=\"7\" y2=\"17\"></line><line x1=\"17\" y1=\"17\" x2=\"22\" y2=\"17\"></line><line x1=\"17\" y1=\"7\" x2=\"22\" y2=\"7\"></line>' />,\r\n            Tv: (p) => <Icon {...p} path='<rect x=\"2\" y=\"7\" width=\"20\" height=\"15\" rx=\"2\" ry=\"2\"></rect><polyline points=\"17 2 12 7 7 2\"></polyline>' />,\r\n            PlaySquare: (p) => <Icon {...p} path='<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"2.18\" ry=\"2.18\"></rect><polygon points=\"10 8 16 12 10 16 10 8\"></polygon>' />,\r\n            AlertCircle: (p) => <Icon {...p} path='<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"></line>' />,\r\n            LayoutGrid: (p) => <Icon {...p} path='<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect>' />,\r\n            BarChart3: (p) => <Icon {...p} path='<path d=\"M3 3v18h18\"></path><rect x=\"18\" y=\"13\" width=\"4\" height=\"8\"></rect><rect x=\"12\" y=\"5\" width=\"4\" height=\"16\"></rect><rect x=\"6\" y=\"9\" width=\"4\" height=\"12\"></rect>' />,\r\n            TrendingUp: (p) => <Icon {...p} path='<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\"></polyline><polyline points=\"16 7 22 7 22 13\"></polyline>' />,\r\n            CheckCircle2: (p) => <Icon {...p} path='<path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"></path><polyline points=\"22 4 12 14.01 9 11.01\"></polyline>' />,\r\n            XCircle: (p) => <Icon {...p} path='<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"15\" y1=\"9\" x2=\"9\" y2=\"15\"></line><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"></line>' />,\r\n            ChevronDown: (p) => <Icon {...p} path='<polyline points=\"6 9 12 15 18 9\"></polyline>' />,\r\n            Clock: (p) => <Icon {...p} path='<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>' />,\r\n            ClockOff: (p) => <Icon {...p} path='<path d=\"M21 12a9 9 0 0 0-9-9 8.8 8.8 0 0 0-4 1\"></path><path d=\"M3 3l18 18\"></path><path d=\"M3.6 8A9 9 0 0 0 12 21a8.8 8.8 0 0 0 4-1\"></path><path d=\"M12 7v5l2 2\"></path>' />,\r\n            Cloud: (p) => <Icon {...p} path='<path d=\"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z\"></path>' />,\r\n            X: (p) => <Icon {...p} path='<line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line>' />,\r\n            Copy: (p) => <Icon {...p} path='<rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path>' />,\r\n            Share2: (p) => <Icon {...p} path='<circle cx=\"18\" cy=\"5\" r=\"3\"></circle><circle cx=\"6\" cy=\"12\" r=\"3\"></circle><circle cx=\"18\" cy=\"19\" r=\"3\"></circle><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\"></line><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\"></line>' />,\r\n            Trash2: (p) => <Icon {...p} path='<polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6\"></path><path d=\"M10 11v6\"></path><path d=\"M14 11v6\"></path><path d=\"M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2\"></path>' />,\r\n            ExternalLink: (p) => <Icon {...p} path='<path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line>' />,\r\n            MessageSquare: (p) => <Icon {...p} path='<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"></path>' />,\r\n            ImageIcon: (p) => <Icon {...p} path='<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"></circle><polyline points=\"21 15 16 10 5 21\"></polyline>' />,\r\n            Search: (p) => <Icon {...p} path='<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line>' />,\r\n            Link: (p) => <Icon {...p} path='<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>' />,\r\n            ShieldCheck: (p) => <Icon {...p} path='<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"></path><path d=\"M9 12l2 2 4-4\"></path>' />,\r\n            DownloadCloud: (p) => <Icon {...p} path='<polyline points=\"8 17 12 21 16 17\"></polyline><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\"></line><path d=\"M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29\"></path>' />,\r\n            UploadCloud: (p) => <Icon {...p} path='<polyline points=\"16 16 12 12 8 16\"></polyline><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\"></line><path d=\"M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29\"></path>' />\r\n        };\r\n\n        /*\r\n         * 历史状态条组件。\r\n         *\r\n         * 专业 Uptime 时间分片状态柱：固定高度、等宽切片，绿色代表可用，红色代表离线。\r\n         */\r\n        const StatusBars = ({ history = [], currentStatus = 'unknown' }) => {\r\n            const maxBars = 60;\r\n            const bucketMs = 60 * 1000;\r\n            const [hoveredIndex, setHoveredIndex] = useState(null);\r\n        \r\n            const buckets = useMemo(() => {\r\n                const now = Date.now();\r\n                const end = Math.floor(now / bucketMs) * bucketMs;\r\n                const start = end - ((maxBars - 1) * bucketMs);\r\n                const normalized = Array.from({ length: maxBars }, (_, index) => ({\r\n                    status: null,\r\n                    time: start + (index * bucketMs),\r\n                    count: 0,\r\n                    filled: false\r\n                }));\r\n        \r\n                if (!Array.isArray(history)) return normalized;\r\n        \r\n                const sortedHistory = history\r\n                    .filter((item) => item && typeof item === 'object' && item.time && Number.isFinite(Number(item.time)))\r\n                    .sort((a, b) => Number(a.time) - Number(b.time));\r\n        \r\n                let carryStatus = null;\r\n                sortedHistory.forEach((item) => {\r\n                    const time = Number(item.time);\r\n                    if (time < start) {\r\n                        carryStatus = item.status === 'online' || item.status === 1 || item.value === 1 ? 'online' : 'offline';\r\n                    }\r\n                });\r\n        \r\n                if (carryStatus) {\r\n                    normalized[0] = { ...normalized[0], status: carryStatus, filled: true };\r\n                }\r\n        \r\n                sortedHistory.forEach((item) => {\r\n                    const time = Number(item.time);\r\n                    if (!Number.isFinite(time) || time < start || time > end + bucketMs - 1) return;\r\n                    const index = Math.min(maxBars - 1, Math.max(0, Math.floor((time - start) / bucketMs)));\r\n                    const status = item.status === 'online' || item.status === 1 || item.value === 1 ? 'online' : 'offline';\r\n                    const previous = normalized[index];\r\n                    normalized[index] = {\r\n                        status: previous.status === 'offline' || status === 'offline' ? 'offline' : status,\r\n                        time,\r\n                        count: (previous.count || 0) + 1,\r\n                        filled: false\r\n                    };\r\n                });\r\n        \r\n                for (let index = 1; index < normalized.length; index += 1) {\r\n                    if (normalized[index].status !== null || normalized[index - 1].status === null) continue;\r\n                    normalized[index] = {\r\n                        ...normalized[index],\r\n                        status: normalized[index - 1].status,\r\n                        filled: true\r\n                    };\r\n                }\r\n        \r\n                if (currentStatus === 'online' || currentStatus === 'offline') {\r\n                    normalized[maxBars - 1] = {\r\n                        ...normalized[maxBars - 1],\r\n                        status: currentStatus,\r\n                        time: now,\r\n                        filled: normalized[maxBars - 1].count === 0\r\n                    };\r\n                }\r\n        \r\n                return normalized;\r\n            }, [history, currentStatus]);\r\n        \r\n            const formatHistoryTime = (time) => {\r\n                if (!time) return '暂无记录';\r\n                return new Date(time).toLocaleString('zh-CN', {\r\n                    month: '2-digit',\r\n                    day: '2-digit',\r\n                    hour: '2-digit',\r\n                    minute: '2-digit',\r\n                    second: '2-digit',\r\n                    hour12: false\r\n                });\r\n            };\r\n        \r\n            const getHistoryTitle = (item) => {\r\n                if (!item || item.status === null) return '暂无记录 - ' + formatHistoryTime(item && item.time);\r\n                const status = item.status === 'online' ? '在线' : '离线';\r\n                return formatHistoryTime(item.time) + ' · ' + status;\r\n            };\r\n        \r\n            const getTooltipPosition = (index) => {\r\n                if (index > maxBars - 8) return 'right-0';\r\n                if (index < 8) return 'left-0';\r\n                return 'left-1/2 -translate-x-1/2';\r\n            };\r\n        \r\n            const updateTouchHover = (event) => {\r\n                const touch = event.touches && event.touches[0] ? event.touches[0] : null;\r\n                const container = event.currentTarget;\r\n                if (!touch || !container) return;\r\n                const rect = container.getBoundingClientRect();\r\n                if (!rect.width) return;\r\n                const ratio = Math.min(0.999, Math.max(0, (touch.clientX - rect.left) / rect.width));\r\n                setHoveredIndex(Math.min(maxBars - 1, Math.max(0, Math.floor(ratio * maxBars))));\r\n            };\r\n        \r\n            return (\r\n                <div\r\n                    data-status-bars\r\n                    className=\"flex items-center gap-[3px] h-9 w-full overflow-visible touch-pan-y\"\r\n                    onTouchStart={updateTouchHover}\r\n                    onTouchMove={updateTouchHover}\r\n                    onTouchEnd={() => setHoveredIndex(null)}\r\n                    onTouchCancel={() => setHoveredIndex(null)}\r\n                >\r\n                    {buckets.map((item, index) => {\r\n                        const isOnline = item.status === 'online';\r\n                        const isOffline = item.status === 'offline';\r\n                        const color = isOnline ? 'bg-emerald-500' : isOffline ? 'bg-rose-500' : 'bg-slate-200/70';\r\n                        return (\r\n                            <div\r\n                                key={index}\r\n                                className={\"flex-1 h-full rounded-[3px] opacity-85 hover:opacity-100 hover:scale-y-110 transition-all cursor-crosshair group relative origin-bottom \" + color}\r\n                                title={getHistoryTitle(item)}\r\n                                onMouseEnter={() => setHoveredIndex(index)}\r\n                                onMouseLeave={() => setHoveredIndex(null)}\r\n                            >\r\n                                <div className={\"absolute bottom-full mb-2 px-2 py-1 rounded-md bg-slate-950/90 text-[10px] text-white font-bold whitespace-nowrap shadow-xl pointer-events-none transition-all duration-150 \" + getTooltipPosition(index) + \" \" + (hoveredIndex === index ? \"opacity-100 translate-y-0\" : \"opacity-0 translate-y-1\")}>\r\n                                    {getHistoryTitle(item)}\r\n                                </div>\r\n                            </div>\r\n                        );\r\n                    })}\r\n                </div>\r\n            );\r\n        };\r\n\n        /*\n         * 前端主应用。\n         *\n         * 负责管理后台页面状态、服务器配置表单、媒体库配置、公开分享、图标库、更新检查和 React 挂载。\n         * 第一轮拆分保持原 App 逻辑不变；后续新增前端功能通常先从这里定位入口。\n         */\n        const App = () => {\n            const CONFIG_CACHE_KEY = 'emby_last_good_config';\n            const readCachedConfig = () => {\n                try {\n                    const raw = localStorage.getItem(CONFIG_CACHE_KEY);\n                    if (!raw) return null;\n                    const parsed = JSON.parse(raw);\n                    return parsed && typeof parsed === 'object' ? parsed : null;\n                } catch (e) {\n                    return null;\n                }\n            };\n            const writeCachedConfig = (data) => {\n                try {\n                    if (!data || typeof data !== 'object') return;\n                    localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(data));\n                } catch (e) {}\n            };\n            const cachedConfig = readCachedConfig();\n            const [servers, setServers] = useState(() => Array.isArray(cachedConfig && cachedConfig.servers) ? cachedConfig.servers : []);\n            const [iconLib, setIconLib] = useState(() => (cachedConfig && cachedConfig.icons && typeof cachedConfig.icons === 'object') ? cachedConfig.icons : {});\n            const [isRefreshing, setIsRefreshing] = useState(false);\n            const [refreshMode, setRefreshMode] = useState('');\n            const [refreshingLastPlayedId, setRefreshingLastPlayedId] = useState(null);\n            const [isHeaderOpen, setIsHeaderOpen] = useState(false);\n            const [isSettingsOpen, setIsSettingsOpen] = useState(false);\n            const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n            const [isSavingServer, setIsSavingServer] = useState(false);\n            const [editingServerId, setEditingServerId] = useState(null);\n            const [iconModalTarget, setIconModalTarget] = useState(null);\n            const [shareModalTarget, setShareModalTarget] = useState(null);\n            const [iconInput, setIconInput] = useState('');\n            const [iconSearch, setIconSearch] = useState('');\n            const [privacyMode, setPrivacyMode] = useState(() => {\n                const savedMode = localStorage.getItem('privacy_mode');\n                if (['none', 'url', 'all'].includes(savedMode)) return savedMode;\n                return localStorage.getItem('hide_server_meta') === '1' ? 'all' : 'none';\n            });\n            const [isPrivacyMenuOpen, setIsPrivacyMenuOpen] = useState(false);\n            const [showLastPlayed, setShowLastPlayed] = useState(() => localStorage.getItem('show_last_played') !== '0');\n            const [reduceEffects, setReduceEffects] = useState(() => localStorage.getItem('reduce_effects') === '1');\n            const [availabilityRange, setAvailabilityRange] = useState(() => localStorage.getItem('availability_range') === 'week' ? 'week' : 'day');\n\n            // 搜索与过滤\n            const [searchQuery, setSearchQuery] = useState('');\n            const [statusFilter, setStatusFilter] = useState('all');\n            const [availabilitySort, setAvailabilitySort] = useState(() => localStorage.getItem('availability_sort') || 'none');\n\n            const [addForm, setAddForm] = useState({ name: '', protocol: 'https://', host: '', port: '443' });\n            const [fallbackUrls, setFallbackUrls] = useState([]);\n            const [mediaForm, setMediaForm] = useState({ enabled: false, username: '', password: '' });\n            const [keepAliveForm, setKeepAliveForm] = useState({ enabled: false, periodDays: '', alertDays: '' });\n            const [quickImportText, setQuickImportText] = useState('');\n            const [telegramForm, setTelegramForm] = useState(() => (cachedConfig && cachedConfig.telegram && typeof cachedConfig.telegram === 'object') ? cachedConfig.telegram : { enabled: false, botToken: '', chatId: '' });\n            const [loggingEnabled, setLoggingEnabled] = useState(() => Boolean(cachedConfig && cachedConfig.logging && cachedConfig.logging.enabled));\n            const [runtimeLogs, setRuntimeLogs] = useState([]);\n            const [isLoadingLogs, setIsLoadingLogs] = useState(false);\n            const [isSavingLogging, setIsSavingLogging] = useState(false);\n            const [isExportingData, setIsExportingData] = useState(false);\n            const [isImportingData, setIsImportingData] = useState(false);\n            const [isTestingTelegram, setIsTestingTelegram] = useState(false);\n            const [isLoading, setIsLoading] = useState(true);\n            const [activeTab, setActiveTab] = useState('cards');\n            const [notifyEnabled, setNotifyEnabled] = useState(() => Boolean(cachedConfig && cachedConfig.notifyEnabled));\n            const [growthMetric, setGrowthMetric] = useState(() => localStorage.getItem('growth_metric') || 'total');\n            const [configUpdatedAt, setConfigUpdatedAt] = useState(() => Number(cachedConfig && cachedConfig.updatedAt) || 0);\n            const [configRevision, setConfigRevision] = useState(() => String(cachedConfig && cachedConfig.revision || ''));\n            const [updateInfo, setUpdateInfo] = useState(null);\n            const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);\n            const [isApplyingUpdate, setIsApplyingUpdate] = useState(false);\n            const [accessDenied, setAccessDenied] = useState('');\n            const [publicShareLink, setPublicShareLink] = useState('');\n            const [publicShareExpiresAt, setPublicShareExpiresAt] = useState(0);\n            const [isGeneratingPublicShare, setIsGeneratingPublicShare] = useState(false);\n            const [publicShareIncludeProfile, setPublicShareIncludeProfile] = useState(false);\n            const [publicShareLifetime, setPublicShareLifetime] = useState('hour');\n            const [publicShareHideCounts, setPublicShareHideCounts] = useState(false);\n            const [deletingPublicShareToken, setDeletingPublicShareToken] = useState('');\n            const [publicShareStats, setPublicShareStats] = useState([]);\n            const [isLoadingPublicShareStats, setIsLoadingPublicShareStats] = useState(false);\n            const [cardShareLinks, setCardShareLinks] = useState({});\n            const [generatingCardShareId, setGeneratingCardShareId] = useState(null);\n            const [toastMessage, setToastMessage] = useState('');\n            const [systemDialog, setSystemDialog] = useState(null);\n            const privacyMenuRef = useRef(null);\n            const keepAliveSectionRef = useRef(null);\n            const dataImportInputRef = useRef(null);\n            const configRevisionRef = useRef('');\n            const configUpdatedAtRef = useRef(0);\n            const isRefreshingRef = useRef(false);\n            const serversRef = useRef([]);\n            const stableServersRef = useRef(new Map());\n            const dialogResolveRef = useRef(null);\n\n            const closeSystemDialog = (value) => {\n                const resolve = dialogResolveRef.current;\n                dialogResolveRef.current = null;\n                setSystemDialog(null);\n                if (resolve) resolve(value);\n            };\n\n            const showSystemDialog = (options) => new Promise((resolve) => {\n                dialogResolveRef.current = resolve;\n                setSystemDialog({\n                    type: options.type || 'alert',\n                    title: options.title || '系统提示',\n                    message: options.message || '',\n                    confirmText: options.confirmText || '知道了',\n                    cancelText: options.cancelText || '取消',\n                    inputValue: options.inputValue || '',\n                    inputPlaceholder: options.inputPlaceholder || '',\n                    tone: options.tone || 'info'\n                });\n            });\n\n            const showNotice = (message) => {\n                setToastMessage(String(message || '操作完成'));\n            };\n            const showAlert = (message, options = {}) => showSystemDialog({ ...options, type: 'alert', message });\n            const showConfirm = (message, options = {}) => showSystemDialog({ ...options, type: 'confirm', message, confirmText: options.confirmText || '确认' });\n            const showPrompt = (message, inputValue = '', options = {}) => showSystemDialog({ ...options, type: 'prompt', message, inputValue, confirmText: options.confirmText || '确认' });\n\n            const triggerFileDownload = (content, fileName, mimeType) => {\n                const blobUrl = URL.createObjectURL(new Blob([content], { type: mimeType }));\n                const link = document.createElement('a');\n                link.href = blobUrl;\n                link.download = fileName;\n                document.body.appendChild(link);\n                link.click();\n                link.remove();\n                // Safari 对 blob: 下载接管较慢，立刻 revoke 会触发 WebKitBlobResource 错误。\n                setTimeout(() => URL.revokeObjectURL(blobUrl), 60 * 1000);\n            };\n\n            // API 调用封装\n            const apiFetch = async (path, options = {}) => {\n                const headers = { ...(options.headers || {}) };\n                const adminToken = localStorage.getItem('emby_admin_token') || '';\n                if (adminToken) headers.Authorization = 'Bearer ' + adminToken;\n                return fetch(path, { ...options, headers });\n            };\n\n            const apiFetchWithTimeout = async (path, options = {}, timeoutMs = 10000) => {\n                const controller = new AbortController();\n                const timer = setTimeout(() => controller.abort(), timeoutMs);\n                try {\n                    return await apiFetch(path, { ...options, signal: controller.signal });\n                } finally {\n                    clearTimeout(timer);\n                }\n            };\n\n            const getStableServerSnapshot = (serverId, fallback = null) => {\n                const key = String(serverId || '');\n                if (!key) return fallback;\n                const stable = stableServersRef.current.get(key);\n                if (stable) return stable;\n                if (!fallback) return null;\n                if (fallback.status && fallback.status !== 'updating') return fallback;\n                return { ...fallback, status: 'unknown', latency: 0 };\n            };\n\n            const fetchConfigData = async (options = {}) => {\n                try {\n                    if (options.skipDuringRefresh && isRefreshingRef.current) return;\n                    const res = await apiFetch('/api/config', { cache: 'no-store' });\n                    if (res.status === 401 || res.status === 403) {\n                        if (options.silentAuth) return;\n                        const errorData = await res.json().catch(() => ({}));\n                        if (errorData.error === 'ADMIN_TOKEN_REQUIRED') {\n                            setAccessDenied('未配置 ADMIN_TOKEN，后台已被锁定。请先在 Cloudflare Worker 环境变量中设置 ADMIN_TOKEN。');\n                            setIsLoading(false);\n                            return;\n                        }\n                        const token = await showPrompt('请输入管理 Token', '', { title: '后台认证', inputPlaceholder: '管理 Token' });\n                        if (token) {\n                            localStorage.setItem('emby_admin_token', token);\n                            return fetchConfigData(options);\n                        }\n                        setAccessDenied('未提供管理 Token，已阻止进入后台。');\n                        setIsLoading(false);\n                        return;\n                    }\n                    if (!res.ok) {\n                        const errorData = await res.json().catch(() => ({}));\n                        showNotice('配置读取失败：' + (errorData.error || errorData.message || res.status));\n                        return;\n                    }\n                    const data = await res.json();\n                    if (options.skipDuringRefresh && isRefreshingRef.current) return;\n                    if (Array.isArray(data.servers)) {\n                        if (data.servers.length === 0 && serversRef.current.length > 0 && !options.allowEmptyServers) {\n                            showNotice('配置响应为空，已保留当前列表');\n                            return;\n                        }\n                        setServers(data.servers);\n                    } else {\n                        showNotice('配置响应异常，已保留当前列表');\n                        return;\n                    }\n                    const nextUpdatedAt = Number(data.updatedAt) || 0;\n                    const nextRevision = data.revision || '';\n                    setConfigUpdatedAt(nextUpdatedAt);\n                    setConfigRevision(nextRevision);\n                    configUpdatedAtRef.current = nextUpdatedAt;\n                    configRevisionRef.current = nextRevision;\n                    setNotifyEnabled(Boolean(data.notifyEnabled));\n                    setTelegramForm(data.telegram || { enabled: false, botToken: '', chatId: '' });\n                    setLoggingEnabled(Boolean(data.logging && data.logging.enabled));\n                    if (data.icons) {\n                        setIconLib(data.icons);\n                        setIconInput(localStorage.getItem('last_icon_input') || \"\");\n                    }\n                    writeCachedConfig(data);\n                    if (!options.skipUpdateCheck) checkForUpdate(false);\n                } catch(e) {\n                    console.error(\"读取配置失败\", e);\n                    if (cachedConfig && Array.isArray(cachedConfig.servers)) {\n                        setServers(cachedConfig.servers);\n                        if (cachedConfig.icons) setIconLib(cachedConfig.icons);\n                        if (cachedConfig.telegram) setTelegramForm(cachedConfig.telegram);\n                        if (cachedConfig.logging) setLoggingEnabled(Boolean(cachedConfig.logging.enabled));\n                        if (Number.isFinite(Number(cachedConfig.updatedAt))) {\n                            setConfigUpdatedAt(Number(cachedConfig.updatedAt));\n                            configUpdatedAtRef.current = Number(cachedConfig.updatedAt);\n                        }\n                        if (cachedConfig.revision) {\n                            setConfigRevision(String(cachedConfig.revision));\n                            configRevisionRef.current = String(cachedConfig.revision);\n                        }\n                        setNotifyEnabled(Boolean(cachedConfig.notifyEnabled));\n                        showNotice('配置读取失败，已使用本地缓存');\n                    }\n                }\n            };\n\n            useEffect(() => { fetchConfigData().finally(() => setIsLoading(false)); }, []);\n            useEffect(() => {\n                serversRef.current = servers;\n                const nextStable = new Map(stableServersRef.current);\n                servers.forEach((server) => {\n                    if (!server || server.id === undefined || server.id === null) return;\n                    if (server.status === 'updating') return;\n                    nextStable.set(String(server.id), server);\n                });\n                stableServersRef.current = nextStable;\n            }, [servers]);\n            useEffect(() => {\n                const timer = setInterval(() => {\n                    if (document.visibilityState === 'visible') {\n                        fetchConfigData({ skipUpdateCheck: true, silentAuth: true, skipDuringRefresh: true });\n                    }\n                }, 60 * 1000);\n                return () => clearInterval(timer);\n            }, []);\n            useEffect(() => { configRevisionRef.current = configRevision; }, [configRevision]);\n            useEffect(() => { configUpdatedAtRef.current = configUpdatedAt; }, [configUpdatedAt]);\n            useEffect(() => { if (iconModalTarget) setIconSearch(''); }, [iconModalTarget]);\n            useEffect(() => {\n                localStorage.setItem('privacy_mode', privacyMode);\n                localStorage.setItem('hide_server_meta', privacyMode === 'all' ? '1' : '0');\n            }, [privacyMode]);\n            useEffect(() => {\n                if (!toastMessage) return;\n                const timer = setTimeout(() => setToastMessage(''), 1800);\n                return () => clearTimeout(timer);\n            }, [toastMessage]);\n            useEffect(() => {\n                if (shareModalTarget === 'public') fetchPublicShareStats();\n            }, [shareModalTarget]);\n            useEffect(() => {\n                const onPointerDown = (event) => {\n                    if (!isPrivacyMenuOpen) return;\n                    if (event.target && event.target.closest && event.target.closest('[data-privacy-dialog=\"true\"]')) return;\n                    if (privacyMenuRef.current && !privacyMenuRef.current.contains(event.target)) setIsPrivacyMenuOpen(false);\n                };\n                const onKeyDown = (event) => {\n                    if (event.key === 'Escape') setIsPrivacyMenuOpen(false);\n                };\n                document.addEventListener('pointerdown', onPointerDown);\n                document.addEventListener('keydown', onKeyDown);\n                return () => {\n                    document.removeEventListener('pointerdown', onPointerDown);\n                    document.removeEventListener('keydown', onKeyDown);\n                };\n            }, [isPrivacyMenuOpen]);\n            useEffect(() => { localStorage.setItem('availability_range', availabilityRange); }, [availabilityRange]);\n            useEffect(() => { localStorage.setItem('availability_sort', availabilitySort); }, [availabilitySort]);\n            useEffect(() => { localStorage.setItem('growth_metric', growthMetric); }, [growthMetric]);\n            useEffect(() => { localStorage.setItem('show_last_played', showLastPlayed ? '1' : '0'); }, [showLastPlayed]);\n            useEffect(() => {\n                localStorage.setItem('reduce_effects', reduceEffects ? '1' : '0');\n                document.documentElement.classList.toggle('performance-lite', reduceEffects);\n                if (document.body) document.body.classList.toggle('performance-lite', reduceEffects);\n            }, [reduceEffects]);\n\n            const syncToCloud = async (newServers, newIcons, nextTelegram = telegramForm, options = {}) => {\n                const serverById = new Map(servers.map(s => [s.id, s]));\n                const mergedServers = newServers.map((server) => {\n                    const existing = serverById.get(server.id);\n                    if (existing && existing.mediaStats && !server.mediaStats) return { ...server, mediaStats: existing.mediaStats };\n                    return server;\n                });\n                const saveConfig = async (serversToSave, iconsToSave, telegramToSave, baseRevision) => {\n                    const nextUpdatedAt = Date.now();\n                    setConfigUpdatedAt(nextUpdatedAt);\n                    configUpdatedAtRef.current = nextUpdatedAt;\n                    const res = await apiFetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ servers: serversToSave, icons: iconsToSave, telegram: telegramToSave, logging: { enabled: loggingEnabled }, updatedAt: nextUpdatedAt, baseRevision }) });\n                    const saveResult = await res.json().catch(() => ({}));\n                    return { res, saveResult, nextUpdatedAt };\n                };\n                setServers(mergedServers);\n                setIconLib(newIcons || {});\n                setTelegramForm(nextTelegram);\n                let { res, saveResult, nextUpdatedAt } = await saveConfig(mergedServers, newIcons, nextTelegram, configRevisionRef.current);\n                if (!res.ok && res.status === 409 && options.addServerOnConflict) {\n                    const latestRes = await apiFetch('/api/config');\n                    if (!latestRes.ok) throw new Error('配置已被其它页面修改，请刷新后再保存');\n                    const latestConfig = await latestRes.json();\n                    const latestServers = Array.isArray(latestConfig.servers) ? latestConfig.servers : [];\n                    const retryServers = latestServers.some(server => server.id === options.addServerOnConflict.id) ? latestServers : [...latestServers, options.addServerOnConflict];\n                    const retryIcons = latestConfig.icons || {};\n                    const retryTelegram = latestConfig.telegram || nextTelegram;\n                    const latestUpdatedAt = Number(latestConfig.updatedAt) || configUpdatedAtRef.current;\n                    const latestRevision = latestConfig.revision || '';\n                    setConfigUpdatedAt(latestUpdatedAt);\n                    setConfigRevision(latestRevision);\n                    configUpdatedAtRef.current = latestUpdatedAt;\n                    configRevisionRef.current = latestRevision;\n                    setServers(retryServers);\n                    setIconLib(retryIcons);\n                    setTelegramForm(retryTelegram);\n                    ({ res, saveResult, nextUpdatedAt } = await saveConfig(retryServers, retryIcons, retryTelegram, latestRevision));\n                }\n                if (!res.ok) {\n                    if (res.status === 409) {\n                        await fetchConfigData();\n                        throw new Error('配置已被其它页面修改，请检查最新配置后重新保存');\n                    }\n                    throw new Error('配置保存失败');\n                }\n                const nextRevision = saveResult.revision || '';\n                setConfigRevision(nextRevision);\n                configRevisionRef.current = nextRevision;\n                writeCachedConfig({ ...saveResult, servers: mergedServers, icons: newIcons, telegram: nextTelegram, logging: { enabled: loggingEnabled }, updatedAt: nextUpdatedAt, revision: nextRevision, notifyEnabled });\n                return nextUpdatedAt;\n            };\n\n            const manualPing = async (currentServers = servers, requestUpdatedAt = configUpdatedAt, options = {}) => {\n                if (isRefreshing || !currentServers.length) return;\n                const nextRefreshMode = 'probe';\n                isRefreshingRef.current = true;\n                setIsRefreshing(true);\n                setRefreshMode(nextRefreshMode);\n                try {\n                    let cursor = 0;\n                    let updatedData = null;\n                    const batchSize = 3;\n                    const originalById = new Map(currentServers.map((server) => [String(server.id), getStableServerSnapshot(server.id, server) || server]));\n                    let skippedCount = 0;\n                    do {\n                        const pendingIds = new Set(\n                            currentServers.slice(cursor, cursor + batchSize).map((server) => server.id)\n                        );\n                        if (pendingIds.size) {\n                            setServers((current) => current.map((server) => pendingIds.has(server.id) ? { ...server, status: 'updating', latency: 0 } : server));\n                        }\n                        let res;\n                        try {\n                            res = await apiFetchWithTimeout('/api/ping-all', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ forceMedia: false, refreshLastPlayed: false, cursor }) }, 15000);\n                            if (!res.ok) {\n                                const errorData = await res.json().catch(() => ({}));\n                                throw new Error(errorData.error || errorData.message || '测速接口异常');\n                            }\n                        } catch(e) {\n                            if (e && e.name === 'AbortError') skippedCount += pendingIds.size || 1;\n                            setServers((current) => current.map((server) => {\n                                if (!pendingIds.has(server.id)) return server;\n                                const previous = originalById.get(String(server.id)) || getStableServerSnapshot(server.id, server) || server;\n                                return { ...server, status: previous.status || 'unknown', latency: previous.latency || 0 };\n                            }));\n                            updatedData = { hasMore: cursor + batchSize < currentServers.length, nextCursor: cursor + batchSize };\n                            cursor = updatedData.nextCursor || 0;\n                            continue;\n                        }\n                        updatedData = await res.json();\n                        setServers((current) => {\n                            if (!Array.isArray(updatedData.servers)) return current;\n                            if (updatedData.servers.length === 0 && current.length > 0) return current;\n                            const updatedById = new Map(updatedData.servers.map((server) => [String(server.id), server]));\n                            const seen = new Set();\n                            const merged = current.map((server) => {\n                                const key = String(server.id);\n                                seen.add(key);\n                                return updatedById.get(key) || server;\n                            });\n                            for (const server of updatedData.servers) {\n                                if (!seen.has(String(server.id))) merged.push(server);\n                            }\n                            return merged;\n                        });\n                        setIconLib(updatedData.icons);\n                        setTelegramForm(updatedData.telegram || telegramForm);\n                        if (updatedData.logging) setLoggingEnabled(Boolean(updatedData.logging.enabled));\n                        const nextUpdatedAt = Number(updatedData.updatedAt) || configUpdatedAtRef.current;\n                        const nextRevision = updatedData.revision || configRevisionRef.current;\n                        setConfigUpdatedAt(nextUpdatedAt);\n                        setConfigRevision(nextRevision);\n                        configUpdatedAtRef.current = nextUpdatedAt;\n                        configRevisionRef.current = nextRevision;\n                        setNotifyEnabled(Boolean(updatedData.notifyEnabled));\n                        writeCachedConfig(updatedData);\n                        cursor = updatedData.nextCursor || 0;\n                    } while (updatedData && updatedData.hasMore);\n                    if (skippedCount) showNotice('已跳过 ' + skippedCount + ' 个超时节点');\n                } catch(e) {\n                    showNotice(e.message || \"测速接口异常\");\n                } finally {\n                    isRefreshingRef.current = false;\n                    setIsRefreshing(false);\n                    setRefreshMode('');\n                }\n            };\n\n            const pingSingleServer = async (serverId, forceMedia = false, refreshLastPlayed = false) => {\n                if (!serverId) return;\n                const previousById = new Map(serversRef.current.map((server) => [String(server.id), getStableServerSnapshot(server.id, server) || server]));\n                setServers((current) => current.map((server) => String(server.id) === String(serverId) ? { ...server, status: 'updating', latency: 0 } : server));\n                try {\n                    const res = await apiFetch('/api/ping-single', {\n                        method: 'POST',\n                        headers: { 'Content-Type': 'application/json' },\n                        body: JSON.stringify({ serverId, forceMedia: Boolean(forceMedia), refreshLastPlayed: Boolean(refreshLastPlayed) })\n                    });\n                    const responseText = await res.text();\n                    let data = {};\n                    try { data = responseText ? JSON.parse(responseText) : {}; } catch(parseError) { data = {}; }\n                    if (!res.ok || !data.ok) throw new Error(data.error || data.message || responseText.slice(0, 160) || ('单体测速失败 HTTP ' + res.status));\n                    if (data.server) {\n                        setServers((current) => current.map((server) => String(server.id) === String(serverId) ? data.server : server));\n                    } else if (Array.isArray(data.servers)) {\n                        setServers((current) => {\n                            if (data.servers.length === 0 && current.length > 0) return current;\n                            return data.servers;\n                        });\n                    }\n                    writeCachedConfig(data);\n                    if (data.icons) setIconLib(data.icons);\n                    if (data.telegram) setTelegramForm(data.telegram);\n                    if (data.logging) setLoggingEnabled(Boolean(data.logging.enabled));\n                    const nextUpdatedAt = Number(data.updatedAt) || configUpdatedAtRef.current;\n                    const nextRevision = data.revision || configRevisionRef.current;\n                    setConfigUpdatedAt(nextUpdatedAt);\n                    setConfigRevision(nextRevision);\n                    configUpdatedAtRef.current = nextUpdatedAt;\n                    configRevisionRef.current = nextRevision;\n                    setNotifyEnabled(Boolean(data.notifyEnabled));\n                } catch(e) {\n                    setServers((current) => current.map((server) => {\n                        if (String(server.id) !== String(serverId)) return server;\n                        return previousById.get(String(serverId)) || getStableServerSnapshot(serverId, server) || { ...server, status: 'unknown', latency: 0 };\n                    }));\n                    showNotice(e.message || '单体测速失败');\n                }\n            };\n\n            const refreshSingleLastPlayed = async (serverId) => {\n                if (!serverId || refreshingLastPlayedId) return;\n                const previousById = new Map(serversRef.current.map((server) => [String(server.id), getStableServerSnapshot(server.id, server) || server]));\n                setRefreshingLastPlayedId(serverId);\n                try {\n                    const res = await apiFetchWithTimeout('/api/ping-single', {\n                        method: 'POST',\n                        headers: { 'Content-Type': 'application/json' },\n                        body: JSON.stringify({ serverId, forceMedia: false, refreshLastPlayed: true })\n                    }, 25000);\n                    const responseText = await res.text();\n                    let data = {};\n                    try { data = responseText ? JSON.parse(responseText) : {}; } catch(parseError) { data = {}; }\n                    if (!res.ok || !data.ok) throw new Error(data.error || data.message || responseText.slice(0, 160) || ('上次播放刷新失败 HTTP ' + res.status));\n                    if (data.server) {\n                        setServers((current) => current.map((server) => String(server.id) === String(serverId) ? data.server : server));\n                    }\n                    if (data.icons) setIconLib(data.icons);\n                    if (data.telegram) setTelegramForm(data.telegram);\n                    if (data.logging) setLoggingEnabled(Boolean(data.logging.enabled));\n                    const nextUpdatedAt = Number(data.updatedAt) || configUpdatedAtRef.current;\n                    const nextRevision = data.revision || configRevisionRef.current;\n                    setConfigUpdatedAt(nextUpdatedAt);\n                    setConfigRevision(nextRevision);\n                    configUpdatedAtRef.current = nextUpdatedAt;\n                    configRevisionRef.current = nextRevision;\n                    setNotifyEnabled(Boolean(data.notifyEnabled));\n                } catch(e) {\n                    setServers((current) => current.map((server) => {\n                        if (String(server.id) !== String(serverId)) return server;\n                        return previousById.get(String(serverId)) || getStableServerSnapshot(serverId, server) || server;\n                    }));\n                    showNotice(e.message || '上次播放刷新失败');\n                } finally {\n                    setRefreshingLastPlayedId(null);\n                }\n            };\n\n            const getProxyImgSrc = (u) => {\n                if (!u) return \"\";\n                if (u.startsWith('data:')) return u;\n                return \"/proxy-img?url=\" + encodeURIComponent(u);\n            };\n\n            const getSafeIconLib = () => (typeof iconLib === 'object' && iconLib !== null && !Array.isArray(iconLib)) ? iconLib : {};\n            const getShareBaseUrl = () => window.location.origin;\n            const getPublicUrl = () => publicShareLink || (getShareBaseUrl() + '/public');\n            const formatStatTime = (value) => {\n                const time = Number(value) || 0;\n                return time ? new Date(time).toLocaleString('zh-CN', { hour12: false }) : '--';\n            };\n            const formatCheckTime = (value) => {\n                const time = Number(value) || 0;\n                return time ? new Date(time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--';\n            };\n            const formatLastPlayedTime = (value) => {\n                const time = Number(value) || 0;\n                if (!time) return '未知';\n                return new Date(time).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });\n            };\n            const getLastPlayedSourceLabel = (source) => ({\n                'user-usage-stats': '播放记录',\n                'playback-reporting': '插件记录',\n                'emby-userdata': 'Emby 记录',\n                'user-activity': '活动记录',\n                'activity-log': '活动日志'\n            }[String(source || '')] || '');\n            const formatShareExpires = (value) => {\n                const time = Number(value) || 0;\n                return time ? new Date(time).toLocaleString('zh-CN', { hour12: false }) : '永久有效';\n            };\n            const copyText = async (text, label = '内容') => {\n                try {\n                    await navigator.clipboard.writeText(text);\n                    setToastMessage(label + '已复制');\n                } catch(e) {\n                    await showPrompt('浏览器阻止了自动复制，请手动复制下面的内容。', text, { title: '复制 ' + label, confirmText: '完成' });\n                }\n            };\n            const normalizeTextForMatch = (value) => String(value || '').normalize('NFKC').toLowerCase();\n            const getDisplayIcon = (server) => {\n                if (server.customIcon) return server.customIcon;\n                if (!server.name) return null;\n                const n = normalizeTextForMatch(server.name);\n                const safeIcons = getSafeIconLib();\n                for (let k in safeIcons) { if (n.includes(normalizeTextForMatch(k))) return safeIcons[k]; }\n                return null;\n            };\n\n            const generatePublicShareLink = async () => {\n                setIsGeneratingPublicShare(true);\n                try {\n                    const res = await apiFetch('/api/public/share-token', {\n                        method: 'POST',\n                        headers: { 'Content-Type': 'application/json' },\n                        body: JSON.stringify({ includeTelegramProfile: publicShareIncludeProfile, lifetime: publicShareLifetime, hideCounts: publicShareHideCounts })\n                    });\n                    const data = await res.json().catch(() => ({}));\n                    if (!res.ok || !data.ok || !data.url) throw new Error(data.error || '生成公开链接失败');\n                    setPublicShareLink(data.url);\n                    setPublicShareExpiresAt(Number(data.expiresAt) || 0);\n                    await fetchPublicShareStats();\n                } catch(e) {\n                    showNotice(e.message || '生成公开链接失败');\n                } finally {\n                    setIsGeneratingPublicShare(false);\n                }\n            };\n\n            const deletePublicShareLink = async (token) => {\n                if (!token) return;\n                if (!await showConfirm('删除这个公开页链接？删除后访问会立即失效。', { title: '删除公开链接', tone: 'danger', confirmText: '删除' })) return;\n                setDeletingPublicShareToken(token);\n                try {\n                    const res = await apiFetch('/api/public/share-token/' + encodeURIComponent(token), { method: 'DELETE' });\n                    const data = await res.json().catch(() => ({}));\n                    if (!res.ok || !data.ok) throw new Error(data.error || '删除公开链接失败');\n                    setPublicShareStats((items) => items.filter((item) => item.token !== token));\n                    if (publicShareLink && publicShareLink.endsWith('/public/' + token)) {\n                        setPublicShareLink('');\n                        setPublicShareExpiresAt(0);\n                    }\n                } catch(e) {\n                    showNotice(e.message || '删除公开链接失败');\n                } finally {\n                    setDeletingPublicShareToken('');\n                }\n            };\n\n            const fetchPublicShareStats = async () => {\n                setIsLoadingPublicShareStats(true);\n                try {\n                    const res = await apiFetch('/api/public/share-stats');\n                    const data = await res.json().catch(() => ({}));\n                    if (!res.ok || !Array.isArray(data.items)) throw new Error(data.error || '读取公开页统计失败');\n                    setPublicShareStats(data.items);\n                } catch(e) {\n                    console.error(e);\n                } finally {\n                    setIsLoadingPublicShareStats(false);\n                }\n            };\n\n            const generateCardShareLink = async (serverId) => {\n                setGeneratingCardShareId(serverId);\n                try {\n                    const res = await apiFetch('/api/card/share-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ serverId }) });\n                    const data = await res.json().catch(() => ({}));\n                    if (!res.ok || !data.ok || !data.url) throw new Error(data.error || '生成卡片图片失败');\n                    setCardShareLinks((current) => ({ ...current, [serverId]: { url: data.url, expiresAt: Number(data.expiresAt) || 0 } }));\n                } catch(e) {\n                    showNotice(e.message || '生成卡片图片失败');\n                } finally {\n                    setGeneratingCardShareId(null);\n                }\n            };\n\n            const getHistoryStatus = (item) => {\n                if (typeof item === 'number') return item ? 'online' : 'offline';\n                if (item && typeof item === 'object') return item.status === 'online' ? 'online' : 'offline';\n                return 'unknown';\n            };\n\n            const getAvailabilityStats = (server, range = availabilityRange) => {\n                const now = Date.now();\n                const rangeMs = range === 'week' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;\n                const history = Array.isArray(server.history) ? server.history.filter(item => item && typeof item === 'object' && item.time && item.time >= now - rangeMs) : [];\n                const valid = history.filter(item => getHistoryStatus(item) !== 'unknown');\n                const online = valid.filter(item => getHistoryStatus(item) === 'online').length;\n                const offline = valid.reduce((count, item, index) => {\n                    if (getHistoryStatus(item) !== 'offline') return count;\n                    const previous = valid[index - 1];\n                    return !previous || getHistoryStatus(previous) !== 'offline' ? count + 1 : count;\n                }, 0);\n                return {\n                    total: valid.length,\n                    online,\n                    offline,\n                    uptime: valid.length ? ((online / valid.length) * 100).toFixed(1) : '---'\n                };\n            };\n            const getKeepAliveButtonState = (server) => {\n                const keepAlive = server && server.mediaStats ? server.mediaStats.keepAlive : null;\n                if (!keepAlive || !keepAlive.enabled) {\n                    return { text: '保号', className: 'bg-slate-100 text-slate-500 hover:bg-slate-200' };\n                }\n                const periodDays = Math.max(1, Number(keepAlive.periodDays) || 30);\n                const lastPlayedAt = Number(keepAlive.lastPlayedAt) || 0;\n                if (!lastPlayedAt) {\n                    return { text: '保号', className: 'bg-amber-50 text-amber-600 hover:bg-amber-100' };\n                }\n                const inactiveDays = Math.max(0, Math.floor((Date.now() - lastPlayedAt) / (24 * 60 * 60 * 1000)));\n                const remainingDays = periodDays - inactiveDays;\n                if (remainingDays < 0) return { text: '!逾期', className: 'bg-rose-50 text-rose-600 hover:bg-rose-100' };\n                if (remainingDays <= 3) return { text: '!' + remainingDays + '天', className: 'bg-orange-50 text-orange-600 hover:bg-orange-100' };\n                return { text: remainingDays + '天', className: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' };\n            };\n            const stripProtocol = (value) => {\n                const text = String(value || '');\n                const lower = text.toLowerCase();\n                if (lower.startsWith('http://')) return text.slice(7);\n                if (lower.startsWith('https://')) return text.slice(8);\n                return text;\n            };\n            const cleanPortInput = (value) => value.split('').filter(ch => ch >= '0' && ch <= '9').join('').slice(0, 5);\n            const cleanPositiveIntInput = (value) => value.split('').filter(ch => ch >= '0' && ch <= '9').join('').replace(/^0+/, '').slice(0, 4);\n\n            const resetServerForm = () => {\n                setAddForm({ name: '', protocol: 'https://', host: '', port: '443' });\n                setFallbackUrls([]);\n                setMediaForm({ enabled: false, username: '', password: '' });\n                setKeepAliveForm({ enabled: false, periodDays: '', alertDays: '' });\n                setQuickImportText('');\n                setEditingServerId(null);\n            };\n\n            const splitServerUrl = (value) => {\n                let raw = String(value || '').trim();\n                const lowerRaw = raw.toLowerCase();\n                if (!lowerRaw.startsWith('http://') && !lowerRaw.startsWith('https://')) raw = 'https://' + raw;\n                try {\n                    const parsed = new URL(raw);\n                    return { protocol: parsed.protocol === 'http:' ? 'http://' : 'https://', host: parsed.hostname, port: parsed.port || (parsed.protocol === 'http:' ? '80' : '443') };\n                } catch(e) {\n                    return { protocol: 'https://', host: value || '', port: '443' };\n                }\n            };\n\n            const updateHostFromInput = (value) => {\n                const parsed = splitServerUrl(value);\n                setAddForm({...addForm, protocol: parsed.protocol, host: parsed.host, port: parsed.port});\n            };\n\n            const normalizeFallbackUrlInput = (value) => {\n                let raw = String(value || '').trim();\n                if (!raw) return '';\n                const lowerRaw = raw.toLowerCase();\n                if (!lowerRaw.startsWith('http://') && !lowerRaw.startsWith('https://')) raw = 'https://' + raw;\n                try {\n                    const parsed = new URL(raw);\n                    parsed.hash = '';\n                    const normalized = parsed.toString();\n                    return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;\n                } catch(e) {\n                    return raw.endsWith('/') ? raw.slice(0, -1) : raw;\n                }\n            };\n\n            const normalizeFallbackUrlsForSave = (mainUrl) => {\n                const seen = new Set([String(mainUrl || '').toLowerCase()]);\n                const clean = [];\n                for (const value of fallbackUrls) {\n                    const normalized = normalizeFallbackUrlInput(value);\n                    const key = normalized.toLowerCase();\n                    if (!normalized || seen.has(key)) continue;\n                    seen.add(key);\n                    clean.push(normalized);\n                    if (clean.length >= 8) break;\n                }\n                return clean;\n            };\n\n            const updateFallbackUrl = (index, value) => {\n                setFallbackUrls((current) => current.map((item, i) => i === index ? value : item));\n            };\n\n            const addFallbackUrl = () => {\n                setFallbackUrls((current) => current.length >= 8 ? current : current.concat(''));\n            };\n\n            const removeFallbackUrl = (index) => {\n                setFallbackUrls((current) => current.filter((_, i) => i !== index));\n            };\n\n            const extractFieldFromText = (lines, labels, skipPattern) => {\n                const labelPattern = labels.join('|');\n                const directPattern = new RegExp('^(?:' + labelPattern + ')\\\\\\\\s*(?:[|:：=\\\\\\\\-]+)?\\\\\\\\s*(.+)$', 'i');\n                for (const line of lines) {\n                    const clean = line.replace(/^[\\\\s·•*\\\\-_|▎]+/, '').trim();\n                    if (!clean || (skipPattern && skipPattern.test(clean))) continue;\n                    const directMatch = clean.match(directPattern);\n                    if (directMatch && directMatch[1]) return directMatch[1].trim();\n                    for (const label of labels) {\n                        const index = clean.toLowerCase().indexOf(label.toLowerCase());\n                        if (index < 0) continue;\n                        const rest = clean.slice(index + label.length).replace(/^[\\\\s|:：=\\\\-]+/, '').trim();\n                        if (rest) return rest;\n                    }\n                }\n                return '';\n            };\n\n            const parseQuickImportTextLegacy = (value) => {\n                const text = String(value || '');\n                const lines = text.split(/\\r?\\n/);\n                const urlMatch = text.match(/https?:\\/\\/[^\\s\"'<>，。；、）)】]+/i);\n                const rawUrl = urlMatch ? urlMatch[0].replace(/[.,;，。；]+$/, '') : '';\n                return {\n                    username: extractFieldFromText(lines, ['用户名称', '用户名', '账号', '账户', 'user name', 'username', 'user'], /安全密码|到期|线路|服务器/i),\n                    password: extractFieldFromText(lines, ['用户密码', '登录密码', '密码', 'password', 'pass'], /安全密码|安全码|pin|到期|线路|服务器/i),\n                    url: rawUrl\n                };\n            };\n\n            const normalizeQuickImportSecret = (value) => {\n                const text = String(value || '').trim();\n                return /^(空|无|沒有|没有|none|null|nil|n\\/a|no|empty)$/i.test(text) ? '' : text;\n            };\n\n            const cleanQuickImportLabel = (value) => {\n                return String(value || '')\n                    .replace(/^[\\s▎·•*_\\-|↓↑]+/, '')\n                    .replace(/[：:]\\s*$/, '')\n                    .trim()\n                    .slice(0, 80);\n            };\n\n            const normalizeQuickImportUrlWithPort = (rawUrl, portValue) => {\n                try {\n                    const parsed = new URL(rawUrl);\n                    const port = cleanPortInput(String(portValue || ''));\n                    if (port && !parsed.port) parsed.port = port;\n                    parsed.hash = '';\n                    const normalized = parsed.toString();\n                    return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;\n                } catch(e) {\n                    return rawUrl;\n                }\n            };\n\n            const extractQuickImportUrls = (lines) => {\n                const results = [];\n                const urlPattern = /https?:\\/\\/[^\\s\"'<>，。；、）)】\\]]+/ig;\n                for (let index = 0; index < lines.length; index += 1) {\n                    const line = String(lines[index] || '');\n                    const matches = [...line.matchAll(urlPattern)];\n                    for (const match of matches) {\n                        const rawUrl = match[0].replace(/[.,;，。；]+$/, '');\n                        const afterUrl = line.slice(match.index + match[0].length);\n                        const sameLinePort = (afterUrl.match(/(?:\\u7aef\\u53e3|port)\\s*[\\uff1a:|\\-]?\\s*(\\d{1,5})/i) || afterUrl.match(/^\\s+(\\d{1,5})(?:\\s|$)/) || [])[1] || '';\n                        const nextLine = String(lines[index + 1] || '');\n                        const nextLinePort = (/^\\s*(?:\\u7aef\\u53e3|port)\\s*[\\uff1a:|\\-]?\\s*(\\d{1,5})\\s*$/i.exec(nextLine) || [])[1] || '';\n                        const port = sameLinePort || nextLinePort;\n                        const label = cleanQuickImportLabel(line.slice(0, match.index));\n                        results.push({ url: normalizeQuickImportUrlWithPort(rawUrl, port), label });\n                    }\n                }\n                return results;\n            };\n\n            const extractQuickImportPassword = (text, lines) => {\n                for (const line of lines) {\n                    const clean = String(line || '').trim();\n                    if (!clean || !(/password|pass/i.test(clean) || clean.includes('\\u5bc6\\u7801'))) continue;\n                    const colonIndex = Math.max(clean.lastIndexOf(':'), clean.lastIndexOf('\\uff1a'));\n                    if (colonIndex >= 0) {\n                        return { value: normalizeQuickImportSecret(clean.slice(colonIndex + 1)), found: true };\n                    }\n                }\n                const directMatch = String(text || '').match(/(?:password|pass)\\s*[:|\\-]?\\s*([^\\r\\n]+)/i);\n                if (directMatch && directMatch[1] !== undefined) return { value: normalizeQuickImportSecret(directMatch[1]), found: true };\n                return { value: '', found: false };\n            };\n\n            const parseQuickImportText = (value) => {\n                const text = String(value || '');\n                const lines = text.split(/\\r?\\n/);\n                const urls = extractQuickImportUrls(lines);\n                const username = extractFieldFromText(lines, ['用户名', '用户名称', '账号', '账户', 'user name', 'username', 'user'], /安全密码|到期|线路|服务器/i);\n                const parsedPassword = extractQuickImportPassword(text, lines);\n                const hasPasswordField = parsedPassword.found;\n                return {\n                    username,\n                    password: parsedPassword.value,\n                    hasPasswordField,\n                    url: urls[0] ? urls[0].url : '',\n                    name: urls[0] ? urls[0].label : '',\n                    fallbackUrls: urls.slice(1).map((item) => item.url).slice(0, 8)\n                };\n            };\n\n            const applyQuickImportText = () => {\n                const value = quickImportText.trim();\n                if (!value) return showNotice('请先粘贴包含服务器、用户名或密码的信息');\n                const parsed = parseQuickImportText(value);\n                const hasRecognizedField = Boolean(parsed.url || parsed.username || parsed.hasPasswordField);\n                if (!hasRecognizedField) return showNotice('没有识别到服务器地址、用户名或密码');\n                if (parsed.url) {\n                    const parsedUrl = splitServerUrl(parsed.url);\n                    setAddForm((current) => ({ ...current, name: current.name || parsedUrl.host, protocol: parsedUrl.protocol, host: parsedUrl.host, port: parsedUrl.port }));\n                    setFallbackUrls(parsed.fallbackUrls || []);\n                } else if (parsed.username) {\n                    setAddForm((current) => ({ ...current, name: current.name || parsed.username }));\n                }\n                if (parsed.url || parsed.username || parsed.hasPasswordField) {\n                    setMediaForm((current) => ({ ...current, enabled: true, username: parsed.username || current.username || 'imzwr', password: parsed.hasPasswordField ? parsed.password : current.password }));\n                }\n            };\n\n            const toggleProtocol = () => {\n                const nextProtocol = addForm.protocol === 'https://' ? 'http://' : 'https://';\n                const defaultPort = nextProtocol === 'https://' ? '443' : '80';\n                setAddForm({...addForm, protocol: nextProtocol, port: (!addForm.port || addForm.port === '443' || addForm.port === '80') ? defaultPort : addForm.port});\n            };\n\n            const buildServerUrlFromForm = () => {\n                let host = addForm.host.trim();\n                const lowerHost = host.toLowerCase();\n                if (lowerHost.startsWith('http://')) host = host.slice(7);\n                if (lowerHost.startsWith('https://')) host = host.slice(8);\n                const slashIndex = host.indexOf('/');\n                if (slashIndex >= 0) host = host.slice(0, slashIndex);\n                const colonIndex = host.lastIndexOf(':');\n                const hasPort = colonIndex > 0 && !host.includes(']') && host.slice(colonIndex + 1).split('').every(ch => ch >= '0' && ch <= '9');\n                const hostParts = hasPort ? [host, host.slice(0, colonIndex), host.slice(colonIndex + 1)] : null;\n                const finalHost = hostParts ? hostParts[1] : host;\n                const port = (hostParts ? hostParts[2] : addForm.port).trim();\n                if (!finalHost) return '';\n                return addForm.protocol + finalHost + (port ? ':' + port : '');\n            };\n\n            const openAddServerModal = () => { resetServerForm(); setIsAddModalOpen(true); };\n            const openEditServerModal = (server, focusKeepAlive = false) => {\n                const parsed = splitServerUrl(server.url || '');\n                const keepAlive = server.mediaStats && server.mediaStats.keepAlive ? server.mediaStats.keepAlive : {};\n                setEditingServerId(server.id);\n                setAddForm({ name: server.name || '', protocol: parsed.protocol, host: parsed.host, port: parsed.port });\n                setFallbackUrls(Array.isArray(server.fallbackUrls) ? server.fallbackUrls.slice(0, 4) : []);\n                setMediaForm({\n                    enabled: Boolean(server.mediaStats && server.mediaStats.enabled),\n                    username: server.mediaStats ? server.mediaStats.username || '' : '',\n                    password: server.mediaStats ? server.mediaStats.password || '' : ''\n                });\n                setKeepAliveForm({\n                    enabled: Boolean(keepAlive.enabled),\n                    periodDays: keepAlive.enabled && keepAlive.periodDays ? String(keepAlive.periodDays) : '',\n                    alertDays: keepAlive.enabled && keepAlive.alertDays ? String(keepAlive.alertDays) : ''\n                });\n                setIsAddModalOpen(true);\n                if (focusKeepAlive) {\n                    setTimeout(() => {\n                        if (keepAliveSectionRef.current) keepAliveSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });\n                    }, 80);\n                }\n            };\n\n            const handleSaveServer = async () => {\n                if(!addForm.name || !addForm.host) return showNotice(\"请填写名称和地址\");\n                if (isSavingServer || isRefreshing) return;\n                setIsSavingServer(true);\n                try {\n                let finalUrl = buildServerUrlFromForm();\n                if (finalUrl.endsWith('/')) finalUrl = finalUrl.slice(0, -1);\n                const cleanFallbackUrls = normalizeFallbackUrlsForSave(finalUrl);\n                const keepAlivePeriodDays = Number(keepAliveForm.periodDays);\n                const keepAliveAlertDays = keepAliveForm.alertDays ? Number(keepAliveForm.alertDays) : Math.max(1, keepAlivePeriodDays - 3);\n                if (keepAliveForm.enabled) {\n                    if (!mediaForm.enabled) throw new Error('开启保号前请先启用媒体库资源统计并填写账号');\n                    if (!Number.isInteger(keepAlivePeriodDays) || keepAlivePeriodDays <= 1) throw new Error('活跃周期必须是大于 1 的正整数');\n                    if (!Number.isInteger(keepAliveAlertDays) || keepAliveAlertDays <= 0) throw new Error('提前提醒天数必须是正整数');\n                    if (keepAliveAlertDays >= keepAlivePeriodDays) throw new Error('提前提醒天数必须小于活跃周期');\n                }\n\n                const buildMediaStats = (existing) => {\n                    const previousMedia = existing && existing.mediaStats ? existing.mediaStats : {};\n                    const credentialsChanged = previousMedia.username !== mediaForm.username.trim() || previousMedia.password !== mediaForm.password;\n                    const previousKeepAlive = previousMedia.keepAlive || {};\n                    return {\n                        enabled: mediaForm.enabled, username: mediaForm.enabled ? mediaForm.username.trim() : '', password: mediaForm.enabled ? mediaForm.password : '',\n                        deviceId: previousMedia.deviceId || ('forward-' + Date.now().toString(36)),\n                        accessToken: mediaForm.enabled && !credentialsChanged ? (previousMedia.accessToken || '') : '',\n                        userId: mediaForm.enabled && !credentialsChanged ? (previousMedia.userId || '') : '',\n                        clientProfile: mediaForm.enabled && !credentialsChanged ? (previousMedia.clientProfile || '') : '',\n                        lastCheck: mediaForm.enabled && !credentialsChanged ? (previousMedia.lastCheck || 0) : 0,\n                        lastError: '', counts: mediaForm.enabled && !credentialsChanged ? (previousMedia.counts || null) : null,\n                        lastPlayedAt: mediaForm.enabled && !credentialsChanged ? (previousMedia.lastPlayedAt || 0) : 0,\n                        lastPlayedCheck: mediaForm.enabled && !credentialsChanged ? (previousMedia.lastPlayedCheck || 0) : 0,\n                        lastPlayedError: '',\n                        lastPlayedItem: mediaForm.enabled && !credentialsChanged ? (previousMedia.lastPlayedItem || null) : null,\n                        previousCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.previousCounts || null) : null,\n                        delta24h: mediaForm.enabled && !credentialsChanged ? (previousMedia.delta24h || null) : null,\n                        todayCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.todayCounts || null) : null,\n                        yesterdayCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.yesterdayCounts || null) : null,\n                        dailyDelta: mediaForm.enabled && !credentialsChanged ? (previousMedia.dailyDelta || null) : null,\n                        dailyKey: mediaForm.enabled && !credentialsChanged ? (previousMedia.dailyKey || '') : '',\n                        keepAlive: {\n                            enabled: Boolean(keepAliveForm.enabled),\n                            periodDays: keepAliveForm.enabled ? keepAlivePeriodDays : 30,\n                            alertDays: keepAliveForm.enabled ? keepAliveAlertDays : 27,\n                            lastPlayedAt: keepAliveForm.enabled && !credentialsChanged ? (previousKeepAlive.lastPlayedAt || 0) : 0,\n                            lastCheckedAt: keepAliveForm.enabled && !credentialsChanged ? (previousKeepAlive.lastCheckedAt || 0) : 0,\n                            alertSentAt: keepAliveForm.enabled && !credentialsChanged ? (previousKeepAlive.alertSentAt || 0) : 0\n                        }\n                    };\n                };\n\n                let updatedServers;\n                let newServer = null;\n                if (editingServerId) {\n                    updatedServers = servers.map((server) => {\n                        if (server.id !== editingServerId) return server;\n                        const previousFallbackUrls = Array.isArray(server.fallbackUrls) ? server.fallbackUrls : [];\n                        const fallbackChanged = JSON.stringify(previousFallbackUrls) !== JSON.stringify(cleanFallbackUrls);\n                        const urlChanged = server.url !== finalUrl || fallbackChanged;\n                        return { ...server, name: addForm.name, url: finalUrl, fallbackUrls: cleanFallbackUrls, status: urlChanged ? 'unknown' : server.status, latency: urlChanged ? 0 : server.latency, consecutiveFailures: urlChanged ? 0 : (Number(server.consecutiveFailures) || 0), mediaStats: buildMediaStats(server) };\n                    });\n                } else {\n                    newServer = {\n                        id: Date.now(), name: addForm.name, url: finalUrl, fallbackUrls: cleanFallbackUrls, customIcon: null, status: 'unknown',\n                        totalChecks: 0, successfulChecks: 0, uptime: \"0.0\", latency: 0, lastCheck: 0, consecutiveFailures: 0, history: [], mediaStats: buildMediaStats(null)\n                    };\n                    updatedServers = [...servers, newServer];\n                }\n\n                await syncToCloud(updatedServers, iconLib, telegramForm, newServer ? { addServerOnConflict: newServer } : {});\n                const targetServerId = newServer ? newServer.id : editingServerId;\n                setIsAddModalOpen(false); resetServerForm(); setActiveTab('cards');\n                await pingSingleServer(targetServerId, true, true);\n                } catch(e) {\n                    console.error('保存服务器失败', e);\n                    showNotice(e.message || '服务器保存失败，请稍后重试');\n                } finally {\n                    setIsSavingServer(false);\n                }\n            };\n\n            const handleSaveTelegram = async () => {\n                const nextTelegram = { enabled: Boolean(telegramForm.enabled), botToken: telegramForm.botToken.trim(), chatId: telegramForm.chatId.trim() };\n                try {\n                    setTelegramForm(nextTelegram);\n                    await syncToCloud(servers, iconLib, nextTelegram);\n                    setNotifyEnabled(nextTelegram.enabled && nextTelegram.botToken && nextTelegram.chatId);\n                    showNotice(\"Telegram 配置已保存\");\n                } catch(e) { showNotice(\"Telegram 配置保存失败\"); }\n            };\n\n            const handleTestTelegram = async () => {\n                const nextTelegram = { enabled: Boolean(telegramForm.enabled), botToken: telegramForm.botToken.trim(), chatId: telegramForm.chatId.trim() };\n                if (!nextTelegram.enabled || !nextTelegram.botToken || !nextTelegram.chatId) {\n                    showNotice('请先启用并填写 Bot Token 和 Chat ID');\n                    return;\n                }\n                setIsTestingTelegram(true);\n                try {\n                    const r = await apiFetch('/api/telegram/test', {\n                        method: 'POST',\n                        headers: { 'Content-Type': 'application/json' },\n                        body: JSON.stringify({ telegram: nextTelegram })\n                    });\n                    const data = await r.json().catch(() => ({}));\n                    if (!r.ok || !data.ok) throw new Error(data.error || '测试通知发送失败');\n                    showNotice('测试通知已发送，请检查 Telegram 是否收到消息');\n                } catch(e) {\n                    showNotice('测试通知发送失败：' + (e.message || '请检查 Bot Token / Chat ID'));\n                } finally {\n                    setIsTestingTelegram(false);\n                }\n            };\n\n            const handleSyncIcons = async () => {\n                if(!iconInput.includes('http')) return showNotice(\"请输入 JSON 链接\");\n                try {\n                    const r = await apiFetch(\"/api/fetch-icons?url=\" + encodeURIComponent(iconInput));\n                    if (!r.ok) throw new Error(await r.text() || '图标库拉取失败');\n                    const icons = await r.json();\n                    if (!icons || typeof icons !== 'object' || Array.isArray(icons) || Object.keys(icons).length === 0) throw new Error('没有从该 JSON 中识别到图片链接');\n                    setIconLib(icons); localStorage.setItem('last_icon_input', iconInput);\n                    await syncToCloud(servers, icons);\n                    showNotice(\"图标库拉取并提取成功！\");\n                } catch(e) { showNotice(\"解析失败：\" + (e.message || \"请检查 JSON 链接格式。\")); }\n            };\n\n            const checkForUpdate = async (showResult = true) => {\n                setIsCheckingUpdate(true);\n                try {\n                    const r = await apiFetch('/api/update/check');\n                    if (r.status === 401) { if (showResult) showNotice('请先输入正确的管理 Token'); return; }\n                    const data = await r.json();\n                    setUpdateInfo(data);\n                    if (showResult) {\n                        const notes = Array.isArray(data.releaseNotes) && data.releaseNotes.length ? '\\n\\n更新内容：\\n' + data.releaseNotes.map(note => '- ' + note).join('\\n') : '';\n                        await showAlert(data.hasUpdate ? ('发现新版本：' + data.latestVersion + notes) : '当前已经是最新版本', { title: '更新检查' });\n                    }\n                } catch(e) {\n                    if (showResult) showNotice('检查更新失败：' + (e.message || '网络异常'));\n                } finally { setIsCheckingUpdate(false); }\n            };\n\n            const applyUpdate = async () => {\n                if (!updateInfo || !updateInfo.hasUpdate) return showNotice('当前没有可更新版本');\n                if (!updateInfo.canUpdate) {\n                    if (updateInfo.updateMode === 'docker') {\n                        return showAlert('当前 Docker 部署没有开启容器自更新。请确认已挂载 /var/run/docker.sock，并配置 DOCKER_SELF_UPDATE_ENABLED 与 DOCKER_UPDATE_IMAGE。', { title: '无法自更新' });\n                    }\n                    return showAlert('当前 Worker 没有配置自更新环境变量，请按 README 配置 CF_ACCOUNT_ID、CF_WORKER_NAME、CF_API_TOKEN 和 UPDATE_ENABLED', { title: '无法自更新' });\n                }\n                const confirmMessage = updateInfo.updateMode === 'docker'\n                    ? ('确认更新到 ' + updateInfo.latestVersion + '？程序会拉取新镜像并自动重建当前容器，页面会短暂断开，但 /data 中的数据不会丢失。')\n                    : ('确认更新到 ' + updateInfo.latestVersion + '？更新会覆盖当前 Worker 代码，但不会清空 KV 配置。');\n                if (!await showConfirm(confirmMessage, { title: '确认更新', confirmText: '更新' })) return;\n                setIsApplyingUpdate(true);\n                try {\n                    const r = await apiFetch('/api/update/apply', { method: 'POST' });\n                    const data = await r.json().catch(() => ({}));\n                    if (!r.ok || !data.ok) throw new Error(data.error || '更新失败');\n                    const notes = Array.isArray(data.releaseNotes) && data.releaseNotes.length ? '\\n\\n更新内容：\\n' + data.releaseNotes.map(note => '- ' + note).join('\\n') : '';\n                    if (data.updateMode === 'docker') {\n                        await showAlert((data.alreadyRunning ? '已有更新任务正在执行。' : '更新任务已启动。') + ' 容器会在后台拉取新镜像并自动重启，页面将在稍后刷新。' + notes, { title: 'Docker 更新' });\n                        setTimeout(() => location.reload(), Number(data.reloadDelayMs) || 12000);\n                    } else {\n                        await showAlert('更新完成，页面即将刷新' + notes, { title: '更新完成' });\n                        setTimeout(() => location.reload(), 1200);\n                    }\n                } catch(e) {\n                    showNotice('更新失败：' + (e.message || (updateInfo && updateInfo.updateMode === 'docker' ? 'Docker API 调用异常' : 'Cloudflare API 调用异常')));\n                } finally { setIsApplyingUpdate(false); }\n            };\n\n            const fetchRuntimeLogs = async () => {\n                setIsLoadingLogs(true);\n                try {\n                    const r = await apiFetch('/api/logs');\n                    const data = await r.json().catch(() => ({}));\n                    if (!r.ok || !data.ok) throw new Error(data.error || '日志读取失败');\n                    setRuntimeLogs(Array.isArray(data.logs) ? data.logs : []);\n                } catch(e) {\n                    showNotice('日志读取失败：' + (e.message || '请稍后重试'));\n                } finally {\n                    setIsLoadingLogs(false);\n                }\n            };\n\n            const saveLoggingSetting = async () => {\n                setIsSavingLogging(true);\n                try {\n                    const r = await apiFetch('/api/logging', {\n                        method: 'POST',\n                        headers: { 'Content-Type': 'application/json' },\n                        body: JSON.stringify({ enabled: loggingEnabled })\n                    });\n                    const data = await r.json().catch(() => ({}));\n                    if (!r.ok || !data.ok) throw new Error(data.error || '日志设置保存失败');\n                    setLoggingEnabled(Boolean(data.logging && data.logging.enabled));\n                    if (data.revision) {\n                        setConfigRevision(data.revision);\n                        configRevisionRef.current = data.revision;\n                    }\n                    if (Number(data.updatedAt)) {\n                        setConfigUpdatedAt(Number(data.updatedAt));\n                        configUpdatedAtRef.current = Number(data.updatedAt);\n                    }\n                    await fetchRuntimeLogs();\n                } catch(e) {\n                    showNotice('日志设置保存失败：' + (e.message || '请稍后重试'));\n                } finally {\n                    setIsSavingLogging(false);\n                }\n            };\n\n            const downloadRuntimeLogs = async () => {\n                try {\n                    const r = await apiFetch('/api/logs?format=text');\n                    if (!r.ok) throw new Error(await r.text() || '日志下载失败');\n                    const text = await r.text();\n                    triggerFileDownload(text, 'emby-runtime-logs-' + new Date().toISOString().replace(/[:.]/g, '-') + '.txt', 'text/plain;charset=utf-8');\n                } catch(e) {\n                    showNotice('日志下载失败：' + (e.message || '请稍后重试'));\n                }\n            };\n\n            const clearRuntimeLogs = async () => {\n                if (!await showConfirm('确认清空运行日志？', { title: '清空日志', tone: 'danger', confirmText: '清空' })) return;\n                setIsLoadingLogs(true);\n                try {\n                    const r = await apiFetch('/api/logs', { method: 'DELETE' });\n                    const data = await r.json().catch(() => ({}));\n                    if (!r.ok || !data.ok) throw new Error(data.error || '日志清空失败');\n                    setRuntimeLogs(Array.isArray(data.logs) ? data.logs : []);\n                } catch(e) {\n                    showNotice('日志清空失败：' + (e.message || '请稍后重试'));\n                } finally {\n                    setIsLoadingLogs(false);\n                }\n            };\n\n            const exportDataSnapshot = async () => {\n                setIsExportingData(true);\n                try {\n                    const r = await apiFetch('/api/data/export');\n                    if (!r.ok) throw new Error(await r.text() || '导出失败');\n                    const text = await r.text();\n                    triggerFileDownload(text, 'emby-kv-snapshot-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json', 'application/json;charset=utf-8');\n                    showNotice('迁移数据已导出');\n                } catch (e) {\n                    showNotice('导出失败：' + (e.message || '请稍后重试'));\n                } finally {\n                    setIsExportingData(false);\n                }\n            };\n\n            const triggerDataImport = async () => {\n                if (isImportingData) return;\n                if (!await showConfirm('导入会覆盖当前全部 KV 数据，包括节点配置、历史、运行日志和分享记录。建议先导出当前数据备份。', { title: '导入迁移数据', tone: 'danger', confirmText: '继续导入' })) return;\n                if (dataImportInputRef.current) {\n                    dataImportInputRef.current.value = '';\n                    dataImportInputRef.current.click();\n                }\n            };\n\n            const handleDataImportFile = async (event) => {\n                const file = event && event.target && event.target.files ? event.target.files[0] : null;\n                if (!file) return;\n                setIsImportingData(true);\n                try {\n                    const text = await file.text();\n                    const snapshot = JSON.parse(text);\n                    const r = await apiFetch('/api/data/import', {\n                        method: 'POST',\n                        headers: { 'Content-Type': 'application/json' },\n                        body: JSON.stringify({ snapshot, replace: true })\n                    });\n                    const data = await r.json().catch(() => ({}));\n                    if (!r.ok || !data.ok) throw new Error(data.error || '导入失败');\n                    if (data.config && data.config.revision) {\n                        setConfigRevision(String(data.config.revision));\n                        configRevisionRef.current = String(data.config.revision);\n                    }\n                    if (data.config && Number.isFinite(Number(data.config.updatedAt))) {\n                        const nextUpdatedAt = Number(data.config.updatedAt) || 0;\n                        setConfigUpdatedAt(nextUpdatedAt);\n                        configUpdatedAtRef.current = nextUpdatedAt;\n                    }\n                    if (data.config && data.config.telegram) setTelegramForm(data.config.telegram);\n                    if (data.config && data.config.logging) setLoggingEnabled(Boolean(data.config.logging.enabled));\n                    if (data.config) setNotifyEnabled(Boolean(data.config.notifyEnabled));\n                    await fetchConfigData({ allowEmptyServers: true, skipUpdateCheck: true });\n                    await fetchRuntimeLogs();\n                    showNotice('导入完成：' + (data.imported || 0) + ' 条，跳过 ' + (data.skipped || 0) + ' 条');\n                } catch (e) {\n                    showNotice('导入失败：' + (e.message || '文件格式错误'));\n                } finally {\n                    if (event && event.target) event.target.value = '';\n                    setIsImportingData(false);\n                }\n            };\n\n            const systemDialogOverlay = systemDialog && (() => {\n                const isDanger = systemDialog.tone === 'danger';\n                const iconClass = isDanger ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100';\n                const confirmClass = isDanger ? 'bg-rose-600 hover:bg-rose-500 shadow-[0_8px_20px_rgba(225,29,72,0.2)]' : 'bg-slate-900 hover:bg-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.18)]';\n                return (\n                    <div className=\"mobile-modal fixed inset-0 z-[90] flex items-center justify-center p-4\" role=\"dialog\" aria-modal=\"true\">\n                        <div className=\"mobile-modal-backdrop absolute inset-0 bg-slate-900/25 backdrop-blur-sm transition-opacity\" onClick={() => closeSystemDialog(systemDialog.type === 'alert' ? true : false)}></div>\n                        <form\n                            className=\"mobile-sheet relative w-full max-w-md glass-panel bg-white/90 rounded-[2rem] shadow-2xl p-6 border border-white animate-in zoom-in-95 duration-200\"\n                            onSubmit={(event) => {\n                                event.preventDefault();\n                                closeSystemDialog(systemDialog.type === 'prompt' ? systemDialog.inputValue : true);\n                            }}\n                        >\n                            <div className=\"flex items-start gap-4\">\n                                <div className={\"w-11 h-11 rounded-2xl border flex items-center justify-center flex-shrink-0 \" + iconClass}>\n                                    {isDanger ? <Icons.AlertCircle className=\"w-5 h-5\" /> : <Icons.MessageSquare className=\"w-5 h-5\" />}\n                                </div>\n                                <div className=\"min-w-0 flex-1\">\n                                    <h2 className=\"text-lg font-black text-slate-800 leading-tight pr-8\">{systemDialog.title}</h2>\n                                    <div className=\"mt-2 text-sm font-semibold leading-6 text-slate-600 whitespace-pre-wrap break-words\">{systemDialog.message}</div>\n                                </div>\n                            </div>\n                            {systemDialog.type === 'prompt' && (\n                                <input\n                                    autoFocus\n                                    value={systemDialog.inputValue}\n                                    placeholder={systemDialog.inputPlaceholder}\n                                    onChange={(event) => setSystemDialog((current) => current ? { ...current, inputValue: event.target.value } : current)}\n                                    className=\"mt-5 w-full glass-input px-4 py-3 rounded-2xl text-sm font-semibold outline-none\"\n                                />\n                            )}\n                            <div className=\"mt-6 flex justify-end gap-2\">\n                                {systemDialog.type !== 'alert' && (\n                                    <button type=\"button\" onClick={() => closeSystemDialog(false)} className=\"px-4 py-2.5 rounded-xl bg-white/80 text-slate-500 hover:text-slate-800 border border-slate-200 text-sm font-black transition-colors\">\n                                        {systemDialog.cancelText}\n                                    </button>\n                                )}\n                                <button type=\"submit\" className={\"px-4 py-2.5 rounded-xl text-white text-sm font-black transition-colors \" + confirmClass}>\n                                    {systemDialog.confirmText}\n                                </button>\n                            </div>\n                        </form>\n                    </div>\n                );\n            })();\n\n            if (accessDenied) return <div className=\"flex items-center justify-center min-h-screen p-6 text-center\"><div className=\"max-w-lg w-full glass-panel bg-white/80 rounded-[2rem] p-8 shadow-2xl border border-white\"><div className=\"text-rose-600 font-black text-lg mb-2\">访问被拒绝</div><div className=\"text-slate-600 text-sm font-semibold whitespace-pre-wrap\">{accessDenied}</div></div>{systemDialogOverlay}</div>;\n            if (isLoading) return <div className=\"flex items-center justify-center min-h-screen text-slate-500 font-bold\">读取云端配置中...{systemDialogOverlay}</div>;\n\n            // 动态数据计算\n            const onlineCount = servers.filter(s => s.status === 'online').length;\n            const offlineCount = servers.filter(s => s.status === 'offline').length;\n            const validUptimeServers = servers.filter(s => getAvailabilityStats(s).uptime !== '---');\n            const avgUptime = validUptimeServers.length > 0\n                ? (validUptimeServers.reduce((acc, s) => acc + parseFloat(getAvailabilityStats(s).uptime), 0) / validUptimeServers.length).toFixed(1)\n                : '0.0';\n            const notifyLabel = notifyEnabled ? '已开启' : '未开启';\n            const hideServerName = privacyMode === 'all';\n            const hideServerUrl = privacyMode === 'url' || privacyMode === 'all';\n            const privacyLabel = privacyMode === 'all' ? '全部隐藏' : privacyMode === 'url' ? '隐藏地址' : '正常显示';\n            const privacyOptions = [\n                { mode: 'none', label: '正常显示', desc: '显示名称和地址' },\n                { mode: 'url', label: '只隐藏地址', desc: '保留名称和图标' },\n                { mode: 'all', label: '全部隐藏', desc: '隐藏名称、地址和图标' }\n            ];\n\n            const safeIconEntries = Object.entries(getSafeIconLib());\n            const iconSearchTerm = normalizeTextForMatch(iconSearch.trim());\n            const filteredIconEntries = iconSearchTerm\n                ? safeIconEntries.filter(([key, url]) => normalizeTextForMatch(key + ' ' + url).includes(iconSearchTerm))\n                : safeIconEntries;\n\n            const normalizedSearchQuery = normalizeTextForMatch(searchQuery);\n            const baseFilteredServers = servers.filter(s => {\n                const matchSearch = normalizeTextForMatch(s.name).includes(normalizedSearchQuery) || normalizeTextForMatch(s.url).includes(normalizedSearchQuery);\n                const matchStatus = statusFilter === 'all' || s.status === statusFilter;\n                return matchSearch && matchStatus;\n            });\n            const getAvailabilityScore = (server) => {\n                const uptime = getAvailabilityStats(server).uptime;\n                return uptime === '---' ? null : parseFloat(uptime);\n            };\n            const sortServers = (list) => {\n                if (availabilitySort === 'none') return list;\n                const rank = { offline: 0, updating: 1, unknown: 2, online: 3 };\n                return [...list].sort((a, b) => {\n                    if (availabilitySort === 'asc' || availabilitySort === 'desc') {\n                        const aScore = getAvailabilityScore(a);\n                        const bScore = getAvailabilityScore(b);\n                        const aVal = aScore === null ? (availabilitySort === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY) : aScore;\n                        const bVal = bScore === null ? (availabilitySort === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY) : bScore;\n                        if (aVal !== bVal) return availabilitySort === 'asc' ? aVal - bVal : bVal - aVal;\n                    }\n                    const aRank = rank[a.status] !== undefined ? rank[a.status] : 2;\n                    const bRank = rank[b.status] !== undefined ? rank[b.status] : 2;\n                    const statusDiff = aRank - bRank;\n                    if (statusDiff !== 0) return statusDiff;\n                    return (b.latency || 0) - (a.latency || 0);\n                });\n            };\n            const filteredServers = sortServers(baseFilteredServers);\n            const sortedServers = filteredServers;\n            const availabilitySortArrow = availabilitySort === 'asc' ? '↑' : availabilitySort === 'desc' ? '↓' : '';\n            const nextAvailabilitySort = () => setAvailabilitySort(availabilitySort === 'none' ? 'asc' : availabilitySort === 'asc' ? 'desc' : 'none');\n            const growthMetricOptions = [\n                { key: 'total', label: '总增长', icon: Icons.TrendingUp },\n                { key: 'movie', label: '电影', icon: Icons.Film },\n                { key: 'series', label: '剧集', icon: Icons.Tv },\n                { key: 'episode', label: '单集', icon: Icons.PlaySquare }\n            ];\n            const getMediaDeltaValue = (server, key) => {\n                const media = server && server.mediaStats ? server.mediaStats : {};\n                const delta = media.dailyDelta || media.delta24h || {};\n                const movie = Number.isFinite(Number(delta.movie)) ? Number(delta.movie) : 0;\n                const series = Number.isFinite(Number(delta.series)) ? Number(delta.series) : 0;\n                const episode = Number.isFinite(Number(delta.episode)) ? Number(delta.episode) : 0;\n                if (key === 'movie') return movie;\n                if (key === 'series') return series;\n                if (key === 'episode') return episode;\n                return movie + series + episode;\n            };\n            const getMediaCountValue = (server, key) => {\n                const counts = server && server.mediaStats && server.mediaStats.counts ? server.mediaStats.counts : {};\n                const movie = Number.isFinite(Number(counts.movie)) ? Number(counts.movie) : 0;\n                const series = Number.isFinite(Number(counts.series)) ? Number(counts.series) : 0;\n                const episode = Number.isFinite(Number(counts.episode)) ? Number(counts.episode) : 0;\n                if (key === 'movie') return movie;\n                if (key === 'series') return series;\n                if (key === 'episode') return episode;\n                return movie + series + episode;\n            };\n            const formatSignedCount = (value) => {\n                const count = Number.isFinite(Number(value)) ? Number(value) : 0;\n                return (count > 0 ? '+' : '') + String(count);\n            };\n            const mediaGrowthRows = filteredServers\n                .filter((server) => server.mediaStats && server.mediaStats.enabled && server.mediaStats.counts)\n                .map((server) => {\n                    const media = server.mediaStats || {};\n                    const delta = media.dailyDelta || media.delta24h || {};\n                    return {\n                        server,\n                        sortValue: getMediaDeltaValue(server, growthMetric),\n                        currentValue: getMediaCountValue(server, growthMetric),\n                        deltas: {\n                            movie: Number.isFinite(Number(delta.movie)) ? Number(delta.movie) : 0,\n                            series: Number.isFinite(Number(delta.series)) ? Number(delta.series) : 0,\n                            episode: Number.isFinite(Number(delta.episode)) ? Number(delta.episode) : 0\n                        }\n                    };\n                })\n                .sort((a, b) => {\n                    if (b.sortValue !== a.sortValue) return b.sortValue - a.sortValue;\n                    return getMediaCountValue(b.server, growthMetric) - getMediaCountValue(a.server, growthMetric);\n                });\n            const mediaGrowthTotal = mediaGrowthRows.reduce((sum, row) => sum + row.sortValue, 0);\n\n            return (\n                <div className=\"app-shell min-h-screen relative overflow-x-hidden\">\n                    {systemDialogOverlay}\n                    {toastMessage && (\n                        <div className=\"fixed right-4 bottom-4 z-[70] max-w-[calc(100vw-2rem)] px-4 py-3 rounded-2xl bg-slate-900/90 text-white text-sm font-bold shadow-2xl border border-white/10 backdrop-blur-md flex items-center gap-2\">\n                            <Icons.CheckCircle2 className=\"w-4 h-4 flex-shrink-0 text-emerald-300\" />\n                            <span className=\"break-words\">{toastMessage}</span>\n                        </div>\n                    )}\n                    <div className=\"bg-canvas\" aria-hidden=\"true\">\n                        <div className=\"orb orb-1\"></div>\n                        <div className=\"orb orb-2\"></div>\n                        <div className=\"orb orb-3\"></div>\n                        <div className=\"orb orb-4\"></div>\n                    </div>\n\n                    <div className=\"mobile-page w-full max-w-[1600px] mx-auto px-4 py-8 md:px-8 md:py-12 relative z-10\">\n                        <header className=\"nav-header flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr] items-center gap-4 lg:gap-6 sticky top-2 lg:top-4 z-50 mb-6 lg:mb-10 w-full\">\n                            <div className={\"order-1 lg:order-1 items-center gap-3 justify-self-start min-w-0 w-full lg:w-auto \" + (isHeaderOpen ? 'flex' : 'hidden lg:flex')}>\n                                <div className=\"brand-icon-shell w-14 h-14 rounded-[1.1rem] backdrop-blur-sm flex items-center justify-center flex-shrink-0\">\n                                    <Icons.Cloud className=\"w-8 h-8 text-sky-500 drop-shadow-sm\" />\n                                </div>\n                                <div className=\"min-w-0 truncate text-left\">\n                                    <h1 className=\"text-2xl xl:text-3xl font-black tracking-tight flex items-center gap-3 min-w-0\">\n                                        <span className=\"brand-title truncate\">Emby 服务器探针</span>\n                                    </h1>\n                                    <p className=\"mobile-subtitle text-[11px] text-slate-500 font-bold tracking-widest mt-2 uppercase flex items-center gap-2\">\n                                        <span className=\"w-2 h-2 rounded-full dot-online flex-shrink-0\"></span>\n                                        <span className=\"truncate\">Emby server probe</span>\n                                    </p>\n                                </div>\n                            </div>\n\n                            <div className={\"order-2 lg:order-3 items-center justify-start lg:justify-end w-full lg:w-auto gap-2 flex-wrap lg:flex-nowrap lg:justify-self-end \" + (isHeaderOpen ? 'flex' : 'hidden lg:flex')}>\n                                <div className=\"mobile-icon-group flex items-center gap-2 flex-shrink-0\">\n                                    <div className=\"relative\" ref={privacyMenuRef}>\n                                        <button\n                                            onClick={() => setIsPrivacyMenuOpen(!isPrivacyMenuOpen)}\n                                            title={\"隐私显示：\" + privacyLabel}\n                                            className={\"whitespace-nowrap flex-shrink-0 w-11 h-11 rounded-[14px] transition-all flex items-center justify-center shadow-sm border border-slate-200/70 \" + (privacyMode !== 'none' ? \"bg-slate-200 text-slate-700 shadow-inner\" : \"bg-white/70 text-slate-500 hover:text-slate-800 hover:bg-white\")}\n                                        >\n                                            {privacyMode !== 'none' ? <Icons.EyeOff className=\"w-5 h-5\" /> : <Icons.Eye className=\"w-5 h-5\" />}\n                                        </button>\n                                        {isPrivacyMenuOpen && (\n                                            <div className=\"hidden md:block absolute right-0 top-12 z-40 w-44 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-xl p-1.5\">\n                                                {privacyOptions.map((option) => (\n                                                    <button\n                                                        key={option.mode}\n                                                        onClick={() => { setPrivacyMode(option.mode); setIsPrivacyMenuOpen(false); }}\n                                                        className={\"w-full text-left rounded-xl px-3 py-2 transition-all \" + (privacyMode === option.mode ? \"bg-white text-slate-900 shadow-sm\" : \"text-slate-500 hover:bg-white/60 hover:text-slate-800\")}\n                                                    >\n                                                        <div className=\"text-xs font-black\">{option.label}</div>\n                                                        <div className=\"text-[10px] font-bold opacity-60 mt-0.5\">{option.desc}</div>\n                                                    </button>\n                                                ))}\n                                            </div>\n                                        )}\n                                    </div>\n                                    <button\n                                        onClick={() => { setIsSettingsOpen(true); fetchRuntimeLogs(); }}\n                                        title=\"系统设置\"\n                                        className=\"whitespace-nowrap flex-shrink-0 relative w-11 h-11 rounded-[14px] bg-white/70 border border-slate-200/70 text-slate-500 hover:text-blue-600 hover:bg-white transition-all flex items-center justify-center shadow-sm\"\n                                    >\n                                        <Icons.Settings className=\"w-5 h-5\" />\n                                        {updateInfo && updateInfo.hasUpdate && <span className=\"absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_0_2px_rgba(255,255,255,0.92)]\"></span>}\n                                    </button>\n                                    <button\n                                        onClick={() => setShowLastPlayed((current) => !current)}\n                                        title={showLastPlayed ? '隐藏上次播放时间' : '显示上次播放时间'}\n                                        className={\"whitespace-nowrap flex-shrink-0 relative w-11 h-11 rounded-[14px] transition-all flex items-center justify-center shadow-sm border border-slate-200/70 \" + (showLastPlayed ? 'bg-white text-slate-700 hover:text-slate-900 hover:bg-white' : 'bg-slate-200 text-slate-500 hover:text-slate-700')}\n                                    >\n                                        {showLastPlayed ? <Icons.Clock className=\"w-5 h-5\" /> : <Icons.ClockOff className=\"w-5 h-5\" />}\n                                    </button>\n                                    <button\n                                        onClick={() => setShareModalTarget('public')}\n                                        title=\"公开页\"\n                                        className=\"whitespace-nowrap flex-shrink-0 w-11 h-11 rounded-[14px] bg-white/70 border border-slate-200/70 text-slate-500 hover:text-blue-600 hover:bg-white transition-all flex items-center justify-center shadow-sm\"\n                                    >\n                                        <Icons.Share2 className=\"w-5 h-5\" />\n                                    </button>\n                                </div>\n\n                                <button onClick={openAddServerModal} disabled={isRefreshing || isSavingServer} className=\"whitespace-nowrap flex-shrink-0 w-full sm:w-auto mobile-primary-btn px-5 py-2.5 h-11 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-60 disabled:cursor-not-allowed rounded-[14px] text-sm font-bold shadow-[0_4px_14px_0_rgba(16,185,129,0.28)] transition-all flex items-center gap-2\">\n                                    <Icons.Plus className=\"w-4 h-4\" /> 添加服务器\n                                </button>\n                                <button\n                                    onClick={() => manualPing(servers, configUpdatedAt, { forceMedia: false, refreshLastPlayed: false })}\n                                    disabled={isRefreshing}\n                                    className=\"whitespace-nowrap flex-shrink-0 w-full sm:w-auto mobile-refresh-btn px-4 py-2.5 h-11 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60 rounded-[14px] text-sm font-bold shadow-[0_6px_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2\"\n                                >\n                                    <Icons.RefreshCw className={\"w-4 h-4 \" + (refreshMode === 'probe' ? 'animate-spin' : '')} />\n                                    <span className=\"inline-flex items-center justify-center tabular-nums\">\n                                        {refreshMode === 'probe' ? '刷新中...' : '刷新状态'}\n                                    </span>\n                                </button>\n                            </div>\n\n                            <div\n                                className=\"order-3 lg:hidden flex items-center justify-center py-2 w-full cursor-pointer opacity-60 hover:opacity-100 transition-opacity\"\n                                onClick={() => setIsHeaderOpen(!isHeaderOpen)}\n                            >\n                                <div className=\"flex-1 h-px bg-slate-300/40\"></div>\n                                <Icons.ChevronDown className={\"w-4 h-4 mx-2 text-slate-400 transition-transform duration-300 \" + (isHeaderOpen ? \"rotate-180\" : \"\")} />\n                                <div className=\"flex-1 h-px bg-slate-300/40\"></div>\n                            </div>\n\n                            <div className=\"order-4 lg:order-2 flex justify-center w-full lg:w-auto justify-self-center\">\n                                <div className=\"p-1.5 rounded-[20px] flex gap-1 items-center w-full lg:w-auto\">\n                                    <button\n                                        onClick={() => setActiveTab('cards')}\n                                        className={\"flex-1 lg:flex-none whitespace-nowrap flex-shrink-0 justify-center px-4 sm:px-6 lg:px-8 py-2.5 rounded-full text-sm font-black transition-all flex items-center gap-2 \" + (activeTab === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-white/45')}\n                                    >\n                                        <Icons.LayoutGrid className=\"w-4 h-4\" />\n                                        看板\n                                    </button>\n                                    <button\n                                        onClick={() => setActiveTab('growth')}\n                                        className={\"flex-1 lg:flex-none whitespace-nowrap flex-shrink-0 justify-center px-4 sm:px-6 lg:px-8 py-2.5 rounded-full text-sm font-black transition-all flex items-center gap-2 \" + (activeTab === 'growth' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-white/45')}\n                                    >\n                                        <Icons.TrendingUp className=\"w-4 h-4\" />\n                                        资源增长榜\n                                    </button>\n                                    <button\n                                        onClick={() => setActiveTab('dashboard')}\n                                        className={\"flex-1 lg:flex-none whitespace-nowrap flex-shrink-0 justify-center px-4 sm:px-6 lg:px-8 py-2.5 rounded-full text-sm font-black transition-all flex items-center gap-2 \" + (activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-white/45')}\n                                    >\n                                        <Icons.Activity className=\"w-4 h-4\" />\n                                        历史大盘\n                                    </button>\n                                </div>\n                            </div>\n                        </header>\n\n                        {/* Overview Stats */}\n                        {activeTab === 'cards' && (\n                        <div className=\"mobile-stats-strip grid grid-cols-2 md:grid-cols-4 gap-4 mb-10\">\n                            {[\n                                { label: '在线服务器', value: onlineCount + \"/\" + servers.length, icon: Icons.CheckCircle2, color: 'text-emerald-500', glow: 'glow-online', cardClass: 'overview-stat-online' },\n                                { label: '当前离线', value: offlineCount, icon: Icons.XCircle, color: 'text-rose-500', glow: 'glow-offline', cardClass: 'overview-stat-offline' },\n                                { label: (availabilityRange === 'week' ? '7天' : '24H') + ' 可用率', value: avgUptime + \"%\", icon: Icons.BarChart3, color: 'text-blue-500', glow: 'bg-blue-500/20', cardClass: 'overview-stat-uptime' },\n                                { label: '报警通知', value: notifyLabel, icon: Icons.AlertCircle, color: 'text-purple-500', glow: 'bg-purple-500/20', cardClass: 'overview-stat-alert' },\n                            ].map((item, idx) => (\n                                <div key={idx} className={\"mobile-stat-card overview-stat \" + item.cardClass + \" p-6 rounded-[2rem] flex items-center gap-5 relative overflow-hidden group hover:-translate-y-0.5 transition-transform\"}>\n                                    <div className={\"absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl \" + item.glow}></div>\n                                    <div className={\"stat-icon-shell w-12 h-12 rounded-2xl bg-white/60 border border-white flex items-center justify-center shadow-sm relative z-10 \" + item.color}>\n                                        <item.icon className=\"w-6 h-6\" />\n                                    </div>\n                                    <div className=\"relative z-10\">\n                                        <div className=\"stat-value text-2xl font-black text-slate-800 tracking-tight\">{item.value}</div>\n                                        <div className=\"stat-label text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest\">{item.label}</div>\n                                    </div>\n                                </div>\n                            ))}\n                        </div>\n                        )}\n\n                        {/* Action Bar: View Toggles & Search */}\n                        {activeTab === 'cards' && (\n                        <div className=\"mobile-action-bar flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6\">\n                            <div className=\"mobile-controls flex flex-wrap items-center gap-3 w-full md:w-auto\">\n                                {/* 时间范围胶囊 (仅看板模式) */}\n                                <div className=\"mobile-control-row has-range\">\n                                    <div className=\"mobile-range-group mobile-filter-group hidden sm:flex glass-panel p-1.5 rounded-[14px]\">\n                                        <button onClick={() => setAvailabilityRange('day')} className={\"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all \" + (availabilityRange === 'day' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>24H</button>\n                                        <button onClick={() => setAvailabilityRange('week')} className={\"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all \" + (availabilityRange === 'week' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>7天</button>\n                                    </div>\n                                {/* 状态筛选胶囊 */}\n                                    <div className=\"mobile-status-group mobile-filter-group hidden sm:flex glass-panel p-1.5 rounded-[14px]\">\n                                        {['all', 'online', 'offline'].map((status) => (\n                                            <button key={status} onClick={() => setStatusFilter(status)} className={\"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all \" + (statusFilter === status ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>\n                                                {status === 'all' ? '全部' : status === 'online' ? '在线' : '离线'}\n                                            </button>\n                                        ))}\n                                    </div>\n                                    <button\n                                        onClick={nextAvailabilitySort}\n                                        className={\"mobile-sort-button hidden sm:flex glass-panel px-3.5 py-2 rounded-[14px] text-[11px] font-bold uppercase tracking-wider transition-all items-center gap-1.5 \" + (availabilitySort === 'none' ? 'text-slate-500 hover:text-slate-700' : 'bg-white/80 text-slate-800 shadow-sm')}\n                                        title=\"点击切换：默认排序 / 可用率升序 / 可用率降序\"\n                                    >\n                                        <Icons.BarChart3 className=\"w-3.5 h-3.5\" />\n                                        <span>排序</span>\n                                        {availabilitySortArrow && <span className=\"text-sm leading-none\">{availabilitySortArrow}</span>}\n                                    </button>\n                                </div>\n                                {/* 搜索框 */}\n                                <div className=\"mobile-search relative w-full sm:w-64\">\n                                    <Icons.Search className=\"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400\" />\n                                    <input\n                                        type=\"text\"\n                                        placeholder=\"搜索服务器名称或地址...\"\n                                        value={searchQuery}\n                                        onChange={(e) => setSearchQuery(e.target.value)}\n                                        className=\"w-full pl-9 pr-4 py-2.5 rounded-[14px] text-sm glass-input text-slate-700 outline-none placeholder:text-slate-400\"\n                                    />\n                                </div>\n                            </div>\n                        </div>\n                        )}\n\n                        {/* 空状态 */}\n                        {activeTab === 'cards' && filteredServers.length === 0 && (\n                            <div className=\"py-20 flex flex-col items-center justify-center text-center\">\n                                <div className=\"w-20 h-20 bg-slate-200/50 rounded-full flex items-center justify-center mb-4\"><Icons.Search className=\"w-8 h-8 text-slate-400\" /></div>\n                                <h3 className=\"text-lg font-bold text-slate-700 mb-1\">未找到匹配的服务器</h3>\n                                <p className=\"text-sm text-slate-500\">尝试更换搜索词或清除筛选条件，或点击右上角添加新服务器。</p>\n                            </div>\n                        )}\n\n                        {/* Cards View */}\n                        {activeTab === 'cards' && filteredServers.length > 0 && (\n                            <div className=\"mobile-server-grid grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6\">\n                                {filteredServers.map((s) => {\n                                    const iconImg = getDisplayIcon(s);\n                                    const isOnline = s.status === 'online';\n                                    const stats = getAvailabilityStats(s);\n                                    const keepAliveButton = getKeepAliveButtonState(s);\n                                    const lastPlayedAt = s.mediaStats && s.mediaStats.enabled ? Number(s.mediaStats.lastPlayedAt) || 0 : 0;\n                                    const keepAliveEnabled = Boolean(s.mediaStats && s.mediaStats.keepAlive && s.mediaStats.keepAlive.enabled);\n                                    const lastPlayedMissing = Boolean(s.mediaStats && s.mediaStats.enabled && keepAliveEnabled && !lastPlayedAt && !s.mediaStats.lastPlayedError);\n                                    const lastPlayedText = lastPlayedAt ? formatLastPlayedTime(lastPlayedAt) : (s.mediaStats && s.mediaStats.enabled && s.mediaStats.lastPlayedError ? '读取失败' : (lastPlayedMissing ? '未读取到播放记录' : '未知'));\n                                    const lastPlayedHint = lastPlayedMissing ? '建议手动刷新或播放一次' : '';\n                                    const lastPlayedSource = getLastPlayedSourceLabel(s.mediaStats && s.mediaStats.lastPlayedItem && s.mediaStats.lastPlayedItem.source);\n                                    const isRefreshingLastPlayed = String(refreshingLastPlayedId || '') === String(s.id);\n                                    const statusColors = {\n                                        online: { text: 'text-emerald-700', bg: 'bg-emerald-500/10', border: 'border-emerald-200', dotClass: 'dot-online', glowClass: 'glow-online' },\n                                        offline: { text: 'text-rose-700', bg: 'bg-rose-500/10', border: 'border-rose-200', dotClass: 'dot-offline', glowClass: 'glow-offline' },\n                                        updating: { text: 'text-blue-700', bg: 'bg-blue-500/10', border: 'border-blue-200', dotClass: 'dot-updating', glowClass: 'bg-blue-400/20' },\n                                    }[s.status] || { text: 'text-slate-600', bg: 'bg-slate-200/50', border: 'border-slate-200', dotClass: 'bg-slate-400', glowClass: 'bg-slate-300/20' };\n\n                                    return (\n                                        <div key={s.id} className=\"mobile-card group server-card p-6 rounded-[2rem] transition-all duration-300 flex flex-col hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 relative\">\n\n                                            {/* 高级卡片呼吸背光 */}\n                                            <div className={\"absolute -right-16 -top-16 w-48 h-48 rounded-full blur-[50px] pointer-events-none \" + statusColors.glowClass}></div>\n\n                                            {/* Header Row */}\n                                            <div className={\"server-card-head flex justify-between items-start server-card-head-\" + (['online', 'offline', 'updating'].includes(s.status) ? s.status : 'unknown')}>\n                                                <div className=\"flex gap-4 items-center\">\n                                                    <div onClick={() => setIconModalTarget(s.id)} className=\"w-14 h-14 rounded-[1.2rem] bg-white/80 border border-white shadow-sm flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:shadow-md transition-shadow cursor-pointer overflow-hidden\" title=\"点击更换图标\">\n                                                        {hideServerName ? <Icons.Server className=\"w-6 h-6\" /> : (iconImg ? <img src={getProxyImgSrc(iconImg)} className=\"w-full h-full object-contain p-2\" onError={(e) => {e.target.style.display='none'}} /> : <span className=\"text-2xl font-black text-slate-700\">{s.name ? s.name[0] : '?'}</span>)}\n                                                    </div>\n                                                    <div className=\"min-w-0\">\n                                                        <h3 className=\"font-black text-xl text-slate-800 truncate tracking-tight\">{hideServerName ? 'Node Hidden' : s.name}</h3>\n                                                        <p className=\"text-[11px] text-slate-400 font-mono mt-1.5 font-semibold truncate bg-white/50 inline-block px-2 py-0.5 rounded-md border border-slate-100\">{hideServerUrl ? 'https://****.****' : stripProtocol(s.url)}</p>\n                                                    </div>\n                                                </div>\n\n                                                <div className={\"flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/50 backdrop-blur-sm shadow-sm \" + statusColors.border + \" \" + statusColors.bg}>\n                                                    <span className={\"w-2.5 h-2.5 rounded-full \" + statusColors.dotClass} />\n                                                    <span className={\"text-[10px] font-black uppercase tracking-wider \" + statusColors.text}>\n                                                        {s.status === 'online' ? '运行中' : s.status === 'offline' ? '已掉线' : '测速中'}\n                                                    </span>\n                                                </div>\n                                            </div>\n\n                                            {/* 双栏指标区: 可用率与离线数 */}\n                                            <div className=\"server-card-section server-card-metrics grid grid-cols-2 gap-3 mb-6 relative z-10 rounded-2xl p-4\">\n                                                <div className=\"text-center relative\">\n                                                    <div className=\"text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-widest flex justify-center items-center gap-1\">\n                                                        {(availabilityRange === 'week' ? '7天' : '24H')}可用率\n                                                    </div>\n                                                    <div className=\"flex justify-center items-baseline gap-1\">\n                                                        <span className={\"text-3xl font-black tracking-tighter \" + (stats.uptime === '---' ? 'text-slate-400' : parseFloat(stats.uptime) > 95 ? 'text-emerald-500' : 'text-amber-500')}>\n                                                            {stats.uptime}\n                                                        </span>\n                                                        <span className=\"text-sm text-slate-400 font-bold\">{stats.uptime === '---' ? '' : '%'}</span>\n                                                    </div>\n                                                </div>\n                                                <div className=\"text-center relative\">\n                                                    <div className=\"absolute left-0 top-2 bottom-2 w-px bg-slate-200/60\"></div>\n                                                    <div className=\"text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-widest flex justify-center items-center gap-1\">\n                                                        {(availabilityRange === 'week' ? '7天' : '24H')}离线\n                                                    </div>\n                                                    <div className=\"flex justify-center items-baseline gap-1\">\n                                                        <span className={\"text-3xl font-black tracking-tighter \" + (stats.offline === 0 ? 'text-slate-400' : 'text-rose-500')}>\n                                                            {stats.offline}\n                                                        </span>\n                                                        <span className=\"text-sm text-slate-400 font-bold\">次</span>\n                                                    </div>\n                                                </div>\n                                            </div>\n\n                                            {/* 媒体库统计 */}\n                                            {s.mediaStats && s.mediaStats.enabled && (\n                                                <div className=\"server-card-section server-card-media rounded-2xl p-4 relative z-10\">\n                                                    <div className=\"flex items-center justify-between mb-3\">\n                                                        <span className=\"text-[10px] text-slate-500 font-bold uppercase tracking-widest\">资源库较昨日变化</span>\n                                                        {s.mediaStats.lastError && <button onClick={() => showAlert(s.mediaStats.lastError, { title: '资源库更新失败', tone: 'danger' })} className=\"text-[10px] text-rose-500 font-bold\" title={s.mediaStats.lastError}>更新失败</button>}\n                                                    </div>\n                                                    <div className=\"grid grid-cols-3 gap-2 divide-x divide-slate-200/60 text-center\">\n                                                        {[\n                                                            { label: '电影', icon: Icons.Film, key: 'movie' },\n                                                            { label: '剧集', icon: Icons.Tv, key: 'series' },\n                                                            { label: '单集', icon: Icons.PlaySquare, key: 'episode' }\n                                                        ].map((stat, i) => {\n                                                            const count = s.mediaStats.counts ? s.mediaStats.counts[stat.key] : null;\n                                                            const delta = s.mediaStats.dailyDelta ? s.mediaStats.dailyDelta[stat.key] : (s.mediaStats.delta24h ? s.mediaStats.delta24h[stat.key] : 0);\n                                                            return (\n                                                                <div key={i} className=\"flex flex-col items-center justify-center px-1 min-w-0\">\n                                                                    <div className=\"flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1\">\n                                                                        <stat.icon className=\"w-3.5 h-3.5\" /> <span>{stat.label}</span>\n                                                                    </div>\n                                                                    <div className=\"w-full min-w-0 text-center\">\n                                                                        <div className=\"text-base font-black text-slate-700 tracking-tight truncate tabular-nums\" title={count === null ? '--' : String(count)}>\n                                                                            {count === null ? '--' : count}\n                                                                        </div>\n                                                                        <div className=\"mt-0.5 h-4 flex items-center justify-center\">\n                                                                            <span\n                                                                                className={\"max-w-full px-1.5 rounded-full text-[10px] leading-4 font-black tabular-nums truncate \" + (delta > 0 ? \"bg-emerald-50 text-emerald-600\" : delta < 0 ? \"bg-rose-50 text-rose-600\" : \"bg-slate-100 text-slate-400\")}\n                                                                                title={(delta > 0 ? '+' : '') + String(delta)}\n                                                                            >\n                                                                                {(delta > 0 ? '+' : '') + String(delta)}\n                                                                            </span>\n                                                                        </div>\n                                                                    </div>\n                                                                </div>\n                                                            );\n                                                        })}\n                                                    </div>\n                                                </div>\n                                            )}\n\n                                            {showLastPlayed && s.mediaStats && s.mediaStats.enabled && (\n                                                <div className=\"server-card-section mt-3 rounded-2xl px-4 py-3 relative z-10 flex items-center justify-between gap-3\">\n                                                    <div className=\"flex items-center gap-2 min-w-0 text-[11px] font-black text-slate-500 uppercase tracking-widest\">\n                                                        <button\n                                                            type=\"button\"\n                                                            onClick={() => refreshSingleLastPlayed(s.id)}\n                                                            disabled={Boolean(refreshingLastPlayedId)}\n                                                            className=\"w-6 h-6 rounded-lg flex items-center justify-center text-sky-500 hover:bg-sky-50 hover:text-sky-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex-shrink-0\"\n                                                            title=\"刷新该服务器上次播放时间\"\n                                                        >\n                                                            <Icons.Clock className={\"w-3.5 h-3.5 \" + (isRefreshingLastPlayed ? 'animate-spin' : '')} />\n                                                        </button>\n                                                        <span className=\"truncate\">上次播放</span>\n                                                    </div>\n                                                    <button\n                                                        type=\"button\"\n                                                        onClick={() => {\n                                                            if (s.mediaStats && s.mediaStats.lastPlayedError) showAlert(s.mediaStats.lastPlayedError, { title: '上次播放读取失败', tone: 'danger' });\n                                                        }}\n                                                        className={\"min-w-0 max-w-[65%] text-right \" + (lastPlayedAt ? 'text-slate-700' : s.mediaStats.lastPlayedError ? 'text-rose-500' : 'text-slate-400')}\n                                                        title={s.mediaStats.lastPlayedError || (lastPlayedHint ? lastPlayedText + '，' + lastPlayedHint : lastPlayedText)}\n                                                    >\n                                                        <span className=\"block text-xs font-black tabular-nums truncate\">{lastPlayedText}</span>\n                                                        {(lastPlayedSource || lastPlayedHint) && (\n                                                            <span className=\"mt-0.5 block text-[10px] font-bold text-slate-400 truncate\">\n                                                                {lastPlayedSource ? '来源：' + lastPlayedSource : lastPlayedHint}\n                                                            </span>\n                                                        )}\n                                                    </button>\n                                                </div>\n                                            )}\n\n                                            {/* Footer */}\n                                            <div className=\"server-card-footer mt-3 flex justify-between items-center text-[10px] text-slate-400 font-bold relative z-10\">\n                                                <div className=\"flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded-full border border-white\">\n                                                    <Icons.Clock className=\"w-3 h-3\" />\n                                                    检测: {formatCheckTime(s.lastCheck)}\n                                                </div>\n                                                <div className=\"mobile-card-actions flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity\">\n                                                    <button onClick={() => setShareModalTarget(s.id)} className=\"px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors\">分享</button>\n                                                    <button onClick={() => openEditServerModal(s, true)} className={\"px-3 py-1.5 rounded-lg transition-colors \" + keepAliveButton.className}>{keepAliveButton.text}</button>\n                                                    <button onClick={() => openEditServerModal(s)} className=\"px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors\">编辑</button>\n                                                    <button onClick={async () => {\n                                                        if(await showConfirm('彻底删除该服务器？', { title: '删除服务器', tone: 'danger', confirmText: '删除' })) {\n                                                            const n = servers.filter(x => x.id !== s.id);\n                                                            await syncToCloud(n, iconLib);\n                                                        }\n                                                    }} className=\"px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors\">删除</button>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    );\n                                })}\n                            </div>\n                        )}\n\n                        {/* Growth Ranking View */}\n                        {activeTab === 'growth' && filteredServers.length > 0 && (\n                            <div className=\"mobile-dashboard growth-dashboard dashboard-shell rounded-[2rem] p-5 flex flex-col gap-4 relative overflow-hidden\">\n                                <div className=\"absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none\"></div>\n                                <div className=\"growth-header-row dashboard-row p-4 sm:p-5 rounded-2xl grid grid-cols-1 lg:grid-cols-[minmax(220px,0.28fr)_minmax(0,1fr)] gap-4 lg:items-center\">\n                                    <div className=\"min-w-0\">\n                                        <div className=\"flex items-center gap-2 text-slate-800 font-black text-xl tracking-tight\">\n                                            <Icons.TrendingUp className=\"w-5 h-5 text-emerald-500\" />\n                                            每日资源增长榜\n                                        </div>\n                                        <div className=\"mt-1 text-[11px] text-slate-500 font-bold\">\n                                            按较昨日增长从多到少排序\n                                        </div>\n                                    </div>\n                                    <div className=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n                                        {growthMetricOptions.map((option) => {\n                                            const OptionIcon = option.icon;\n                                            return (\n                                                <button\n                                                    key={option.key}\n                                                    onClick={() => setGrowthMetric(option.key)}\n                                                    className={\"min-h-[44px] rounded-2xl border px-3 py-2 flex items-center justify-center gap-2 text-xs font-black transition-all \" + (growthMetric === option.key ? 'bg-white text-slate-900 border-white shadow-sm' : 'bg-white/45 text-slate-500 border-white/70 hover:bg-white/70 hover:text-slate-800')}\n                                                >\n                                                    <OptionIcon className=\"w-4 h-4 flex-shrink-0\" />\n                                                    <span className=\"truncate\">{option.label}</span>\n                                                </button>\n                                            );\n                                        })}\n                                    </div>\n                                </div>\n\n                                {mediaGrowthRows.length === 0 ? (\n                                    <div className=\"dashboard-row p-8 rounded-2xl text-center\">\n                                        <div className=\"mx-auto w-14 h-14 rounded-2xl bg-white/70 border border-white flex items-center justify-center text-slate-400\">\n                                            <Icons.TrendingUp className=\"w-6 h-6\" />\n                                        </div>\n                                        <div className=\"mt-4 text-slate-700 font-black\">暂无可排行的资源统计</div>\n                                        <div className=\"mt-1 text-sm text-slate-500 font-semibold\">启用媒体库资源统计并刷新后，会在这里显示每日增长排序。</div>\n                                    </div>\n                                ) : (\n                                    <>\n                                        <div className=\"growth-summary-grid grid grid-cols-1 md:grid-cols-3 gap-4\">\n                                            <div className=\"growth-summary-card dashboard-row p-4 rounded-2xl\">\n                                                <div className=\"text-[10px] text-slate-500 font-bold uppercase tracking-widest\">参与排行</div>\n                                                <div className=\"mt-1 text-2xl font-black text-slate-800 tabular-nums\">{mediaGrowthRows.length}</div>\n                                            </div>\n                                            <div className=\"growth-summary-card dashboard-row p-4 rounded-2xl\">\n                                                <div className=\"text-[10px] text-slate-500 font-bold uppercase tracking-widest\">榜首增长</div>\n                                                <div className=\"mt-1 text-2xl font-black text-emerald-600 tabular-nums\">{formatSignedCount(mediaGrowthRows[0].sortValue)}</div>\n                                            </div>\n                                            <div className=\"growth-summary-card dashboard-row p-4 rounded-2xl\">\n                                                <div className=\"text-[10px] text-slate-500 font-bold uppercase tracking-widest\">合计增长</div>\n                                                <div className={\"mt-1 text-2xl font-black tabular-nums \" + (mediaGrowthTotal > 0 ? 'text-emerald-600' : mediaGrowthTotal < 0 ? 'text-rose-600' : 'text-slate-500')}>{formatSignedCount(mediaGrowthTotal)}</div>\n                                            </div>\n                                        </div>\n\n                                        <div className=\"growth-list flex flex-col gap-3\">\n                                            {mediaGrowthRows.map((row, index) => {\n                                                const s = row.server;\n                                                const iconImg = getDisplayIcon(s);\n                                                const topGrowthValue = Math.max(0, Number(mediaGrowthRows[0] && mediaGrowthRows[0].sortValue) || 0);\n                                                const growthPercent = topGrowthValue > 0 ? Math.min(100, Math.max(0, (Math.max(0, Number(row.sortValue) || 0) / topGrowthValue) * 100)) : 0;\n                                                const rankTone = index === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white border-yellow-200 shadow-[0_0_22px_rgba(245,158,11,0.38)]' : index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white border-slate-200 shadow-sm' : index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white border-amber-500 shadow-sm' : 'bg-white/70 text-slate-500 border-white';\n                                                const valueTone = row.sortValue > 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : row.sortValue < 0 ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-slate-500 bg-slate-100 border-slate-200';\n                                                return (\n                                                    <div key={s.id} className=\"growth-rank-row dashboard-row p-4 sm:p-5 rounded-2xl grid grid-cols-1 lg:grid-cols-[80px_minmax(250px,1.5fr)_1fr_1fr_1fr_minmax(200px,1fr)] gap-4 lg:items-center\">\n                                                        <div className=\"growth-rank-main flex items-center gap-4 min-w-0 lg:contents\">\n                                                            <div className={\"growth-rank-badge w-10 h-10 rounded-2xl border flex items-center justify-center font-black text-sm shadow-sm flex-shrink-0 tabular-nums lg:mx-auto \" + rankTone}>#{index + 1}</div>\n                                                            <div className=\"growth-server-cell flex items-center gap-4 min-w-0\">\n                                                            <div className=\"growth-server-icon w-12 h-12 rounded-xl bg-white/80 border border-white shadow-sm flex items-center justify-center font-black text-xl text-slate-600 overflow-hidden flex-shrink-0\">\n                                                                {hideServerName ? <Icons.Server className=\"w-5 h-5\" /> : (iconImg ? <img src={getProxyImgSrc(iconImg)} className=\"w-full h-full object-contain p-1.5\" onError={(e) => {e.target.style.display='none'}} /> : s.name[0])}\n                                                            </div>\n                                                            <div className=\"growth-server-name min-w-0\">\n                                                                <div className=\"font-black text-slate-800 text-lg truncate tracking-tight\">{hideServerName ? 'Node Hidden' : s.name}</div>\n                                                                <div className=\"mt-1 text-[11px] text-slate-400 font-mono font-semibold truncate\">{hideServerUrl ? 'https://****.****' : stripProtocol(s.url)}</div>\n                                                            </div>\n                                                            </div>\n                                                        </div>\n\n                                                        <div className=\"growth-metric-grid grid grid-cols-3 gap-2 min-w-0 lg:contents\">\n                                                            {[\n                                                                { label: '电影', key: 'movie', icon: Icons.Film },\n                                                                { label: '剧集', key: 'series', icon: Icons.Tv },\n                                                                { label: '单集', key: 'episode', icon: Icons.PlaySquare }\n                                                            ].map((item) => {\n                                                                const ItemIcon = item.icon;\n                                                                const delta = row.deltas[item.key];\n                                                                const count = s.mediaStats && s.mediaStats.counts ? s.mediaStats.counts[item.key] : 0;\n                                                                return (\n                                                                    <div key={item.key} className=\"growth-metric-card rounded-2xl bg-white/50 border border-white px-3 py-2 min-w-0 lg:bg-transparent lg:border-0 lg:p-0 lg:rounded-none lg:shadow-none\">\n                                                                        <div className=\"flex items-center gap-1.5 text-[10px] text-slate-400 font-black lg:text-[11px]\">\n                                                                            <ItemIcon className=\"w-3.5 h-3.5 flex-shrink-0\" />\n                                                                            <span className=\"truncate\">{item.label}</span>\n                                                                        </div>\n                                                                        <div className=\"mt-1 flex items-center gap-2 lg:gap-2.5\">\n                                                                            <span className=\"text-sm font-black text-slate-700 tabular-nums truncate\">{Number(count || 0).toLocaleString('zh-CN')}</span>\n                                                                            <span className={\"px-2 py-0.5 rounded-full text-[11px] font-black tabular-nums border \" + (delta > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : delta < 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-100 text-slate-400 border-slate-200')}>{formatSignedCount(delta)}</span>\n                                                                        </div>\n                                                                    </div>\n                                                                );\n                                                            })}\n                                                        </div>\n\n                                                        <div className=\"growth-total-cell lg:text-right\">\n                                                            <div className={\"growth-total-pill inline-flex min-w-[96px] items-center justify-center px-4 py-2.5 rounded-2xl border text-xl font-black tabular-nums \" + valueTone}>\n                                                                {formatSignedCount(row.sortValue)}\n                                                            </div>\n                                                            <div className=\"mt-2 h-1.5 rounded-full bg-white/70 border border-white overflow-hidden\">\n                                                                <div className=\"h-full rounded-full bg-emerald-500\" style={{ width: growthPercent + '%' }}></div>\n                                                            </div>\n                                                            <div className=\"mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest lg:text-center\">当前 {Number(row.currentValue || 0).toLocaleString('zh-CN')}</div>\n                                                        </div>\n                                                    </div>\n                                                );\n                                            })}\n                                        </div>\n                                    </>\n                                )}\n                            </div>\n                        )}\n\n                        {/* Dashboard View */}\n                        {activeTab === 'dashboard' && servers.length > 0 && (\n                            <div className=\"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6\">\n                                {servers.map((s) => {\n                                    const iconImg = getDisplayIcon(s);\n                                    const stats = getAvailabilityStats(s, 'day');\n                                    const uptimeValue = stats.uptime === '---' ? null : parseFloat(stats.uptime);\n                                    const uptimeTone = uptimeValue !== null && uptimeValue < 90 ? 'text-rose-600' : 'text-slate-900';\n                                    const now = Date.now();\n                                    const offlineSlices = Array.isArray(s.history)\n                                        ? (() => {\n                                            const seen = new Set();\n                                            s.history.forEach((item) => {\n                                                if (!item || typeof item !== 'object' || !item.time) return;\n                                                const time = Number(item.time);\n                                                if (!Number.isFinite(time) || time < now - 24 * 60 * 60 * 1000) return;\n                                                if (getHistoryStatus(item) !== 'offline') return;\n                                                seen.add(Math.floor(time / 60000));\n                                            });\n                                            return seen.size;\n                                        })()\n                                        : 0;\n                                    const isOnline = s.status === 'online';\n                                    const isOffline = s.status === 'offline';\n                                    const statusText = isOnline ? '当前在线' : isOffline ? '离线' : '测速中';\n                                    const statusDot = isOnline ? 'dot-online' : isOffline ? 'dot-offline' : 'dot-updating';\n                                    const statusTone = isOnline ? 'text-emerald-600' : isOffline ? 'text-rose-600' : 'text-blue-600';\n\n                                    return (\n                                        <div key={s.id} className=\"dashboard-row dashboard-card rounded-[1.5rem] p-5 flex flex-col gap-6 min-w-0\">\n                                            <div className=\"flex items-center gap-4 min-w-0\">\n                                                <div className=\"w-12 h-12 rounded-xl bg-white/80 border border-white shadow-sm flex items-center justify-center font-black text-xl text-slate-600 overflow-hidden flex-shrink-0\">\n                                                    {hideServerName ? <Icons.Server className=\"w-5 h-5\" /> : (iconImg ? <img src={getProxyImgSrc(iconImg)} className=\"w-full h-full object-contain p-1.5\" onError={(e) => {e.target.style.display='none'}} /> : s.name[0])}\n                                                </div>\n                                                <div className=\"min-w-0\">\n                                                    <div className=\"font-black text-slate-800 text-lg truncate tracking-tight\">{hideServerName ? 'Node Hidden' : s.name}</div>\n                                                    <div className={\"mt-1 inline-flex items-center gap-1.5 text-[11px] font-black \" + statusTone}>\n                                                        <span className={\"w-2 h-2 rounded-full flex-shrink-0 \" + statusDot}></span>\n                                                        {statusText}\n                                                    </div>\n                                                </div>\n                                            </div>\n\n                                            <div className=\"grid grid-cols-2 gap-3\">\n                                                <div className=\"rounded-2xl bg-white/45 border border-white/70 px-4 py-3 flex flex-col items-center justify-center text-center\">\n                                                    <div className=\"text-[10px] text-slate-400 font-black uppercase tracking-widest\">24H 可用率</div>\n                                                    <div className={\"mt-2 text-3xl font-black tracking-tight tabular-nums \" + uptimeTone}>{stats.uptime === '---' ? '--' : stats.uptime + '%'}</div>\n                                                </div>\n                                                <div className=\"rounded-2xl bg-white/45 border border-white/70 px-4 py-3 flex flex-col items-center justify-center text-center\">\n                                                    <div className=\"text-[10px] text-slate-400 font-black uppercase tracking-widest\">离线次数</div>\n                                                    <div className={\"mt-2 text-3xl font-black tracking-tight tabular-nums \" + (offlineSlices > 0 ? 'text-rose-600' : 'text-slate-900')}>{offlineSlices}</div>\n                                                </div>\n                                            </div>\n\n                                            <div className=\"mt-auto min-w-0 overflow-visible\">\n                                                <div className=\"mb-2 flex justify-between text-[10px] text-slate-400 font-black uppercase tracking-widest\">\n                                                    <span>PAST</span>\n                                                    <span>NOW</span>\n                                                </div>\n                                                <StatusBars history={s.history || []} currentStatus={s.status} />\n                                            </div>\n                                        </div>\n                                    );\n                                })}\n                            </div>\n                        )}\n                    </div>\n\n                    {isPrivacyMenuOpen && (\n                        <div data-privacy-dialog=\"true\" className=\"md:hidden fixed inset-0 z-50 flex items-center justify-center p-4\">\n                            <div className=\"mobile-privacy-backdrop absolute inset-0\" onClick={() => setIsPrivacyMenuOpen(false)}></div>\n                            <div className=\"mobile-privacy-menu relative z-10 border border-white/80 bg-white/80 backdrop-blur-xl shadow-2xl\">\n                                <div className=\"mb-3 px-1\">\n                                    <div className=\"text-lg font-black text-slate-800\">隐藏显示</div>\n                                    <div className=\"text-xs font-bold text-slate-500 mt-1\">选择需要隐藏的服务器信息</div>\n                                </div>\n                                <div className=\"space-y-2\">\n                                    {privacyOptions.map((option) => (\n                                        <button\n                                            key={option.mode}\n                                            onClick={() => { setPrivacyMode(option.mode); setIsPrivacyMenuOpen(false); }}\n                                            className={\"w-full text-left transition-all \" + (privacyMode === option.mode ? \"bg-white text-slate-900 shadow-sm\" : \"text-slate-500 hover:bg-white/60 hover:text-slate-800\")}\n                                        >\n                                            <div className=\"text-sm font-black\">{option.label}</div>\n                                            <div className=\"text-[11px] font-bold opacity-60 mt-0.5\">{option.desc}</div>\n                                        </button>\n                                    ))}\n                                </div>\n                            </div>\n                        </div>\n                    )}\n\n                    {/* 专属设置弹窗 (Settings Modal) */}\n                    {isSettingsOpen && (\n                        <div className=\"mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4\">\n                            <div className=\"mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity\" onClick={() => setIsSettingsOpen(false)}></div>\n                            <div className=\"mobile-sheet mobile-form-sheet relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200\">\n                                <button onClick={() => setIsSettingsOpen(false)} className=\"absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors\">\n                                    <Icons.X className=\"w-4 h-4\" />\n                                </button>\n                                <div className=\"flex-none\">\n                                    <h2 className=\"text-2xl font-black text-slate-800 mb-6 flex items-center gap-3\">\n                                        <Icons.Settings className=\"w-6 h-6 text-blue-500\" />系统设置\n                                    </h2>\n                                </div>\n\n                                <div className=\"mobile-form-body\">\n                                    <div className=\"space-y-4\">\n                                        {/* 程序更新 */}\n                                        <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm\">\n                                        <div className=\"flex flex-col md:flex-row md:items-start justify-between gap-4\">\n                                            <div className=\"min-w-0 flex-1\">\n                                                <div className=\"flex items-center gap-2 mb-1 text-slate-700 font-bold\"><Icons.DownloadCloud className=\"w-4 h-4 text-blue-500\" />程序更新</div>\n                                                <div className=\"text-xs font-bold text-slate-500\">\n                                                    当前版本: {updateInfo ? updateInfo.currentVersion : APP_VERSION}\n                                                    {updateInfo && updateInfo.hasUpdate && <span className=\"ml-3 inline-block text-amber-500\">发现新版本: {updateInfo.latestVersion}</span>}\n                                                    {updateInfo && !updateInfo.hasUpdate && updateInfo.latestVersion && updateInfo.latestVersion !== 'unknown' && <span className=\"ml-3 inline-block text-emerald-600\">远端版本: {updateInfo.latestVersion}</span>}\n                                                </div>\n                                                {updateInfo && updateInfo.updateTargetLabel && (\n                                                    <div className=\"mt-1 text-[11px] font-bold text-slate-400\">\n                                                        更新目标：{updateInfo.updateTargetLabel}\n                                                        {updateInfo.updateMode === 'docker' && updateInfo.image && <span className=\"ml-2 inline-block truncate max-w-full align-bottom\">镜像：{updateInfo.image}</span>}\n                                                    </div>\n                                                )}\n                                                {updateInfo && (updateInfo.error || (Array.isArray(updateInfo.missing) && updateInfo.missing.length > 0) || updateInfo.sourceUrl) && (\n                                                    <div className=\"mt-3 space-y-1 text-[11px] font-bold text-slate-500\">\n                                                        {updateInfo.error && <div className=\"text-rose-500\">检查失败：{updateInfo.error}</div>}\n                                                        {Array.isArray(updateInfo.missing) && updateInfo.missing.length > 0 && <div>{updateInfo.updateMode === 'docker' ? '缺少 Docker 自更新条件：' : '缺少自更新配置：'}{updateInfo.missing.join(', ')}</div>}\n                                                        {updateInfo.sourceUrl && <div className=\"truncate\">更新源：{updateInfo.sourceUrl}</div>}\n                                                    </div>\n                                                )}\n                                                {updateInfo && updateInfo.hasUpdate && Array.isArray(updateInfo.releaseNotes) && updateInfo.releaseNotes.length > 0 && (\n                                                    <div className=\"mt-3 space-y-1 text-[11px] font-bold text-slate-500\">\n                                                        {updateInfo.releaseNotes.map((note, index) => (\n                                                            <div key={index} className=\"flex gap-2\">\n                                                                <span className=\"text-amber-500\">•</span>\n                                                                <span>{note}</span>\n                                                            </div>\n                                                        ))}\n                                                    </div>\n                                                )}\n                                            </div>\n                                            <div className=\"grid grid-cols-2 md:flex gap-2 md:flex-shrink-0\">\n                                                <button onClick={() => checkForUpdate(true)} disabled={isCheckingUpdate || isApplyingUpdate} className=\"px-3 sm:px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap\">\n                                                    {isCheckingUpdate ? '检查中...' : '检查更新'}\n                                                </button>\n                                                <button onClick={applyUpdate} disabled={!updateInfo || !updateInfo.hasUpdate || isApplyingUpdate || !updateInfo.canUpdate} className=\"px-3 sm:px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white disabled:opacity-40 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap\">\n                                                    {isApplyingUpdate ? '更新中...' : '一键更新'}\n                                                </button>\n                                            </div>\n                                        </div>\n                                        </div>\n\n                                        {/* 性能模式 */}\n                                        <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm\">\n                                        <div className=\"flex flex-col sm:flex-row sm:items-start justify-between gap-3\">\n                                            <div className=\"min-w-0\">\n                                                <div className=\"flex items-center gap-2 text-slate-700 font-bold\">\n                                                    <Icons.Glasses className=\"w-4 h-4 text-slate-600\" />性能模式\n                                                </div>\n                                                <div className=\"mt-1 text-[11px] font-bold text-slate-500\">\n                                                    关闭漂浮背景、呼吸灯和大面积玻璃模糊，适合手机或老电脑。\n                                                </div>\n                                            </div>\n                                            <label className=\"flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer\">\n                                                <input type=\"checkbox\" checked={reduceEffects} onChange={e => setReduceEffects(e.target.checked)} className=\"w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500\" />\n                                                省电/轻量模式\n                                            </label>\n                                        </div>\n                                        </div>\n\n                                        {/* 数据迁移 */}\n                                        <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4\">\n                                        <div className=\"flex flex-col sm:flex-row sm:items-start justify-between gap-3\">\n                                            <div className=\"min-w-0\">\n                                                <div className=\"flex items-center gap-2 text-slate-700 font-bold\">\n                                                    <Icons.Cloud className=\"w-4 h-4 text-sky-500\" />数据迁移\n                                                </div>\n                                                <div className=\"mt-1 text-[11px] font-bold text-slate-500\">\n                                                    导出/导入完整 KV 快照，适用于 Worker 与 Docker 版之间迁移节点配置、历史、日志和分享记录。\n                                                </div>\n                                            </div>\n                                        </div>\n                                        <input\n                                            ref={dataImportInputRef}\n                                            type=\"file\"\n                                            accept=\"application/json,.json\"\n                                            onChange={handleDataImportFile}\n                                            className=\"hidden\"\n                                        />\n                                        <div className=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                                            <button onClick={exportDataSnapshot} disabled={isExportingData} className=\"py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-60 font-bold text-sm rounded-xl transition-colors border border-blue-200 flex items-center justify-center gap-2\">\n                                                <Icons.DownloadCloud className=\"w-4 h-4\" />\n                                                {isExportingData ? '导出中...' : '导出数据'}\n                                            </button>\n                                            <button onClick={triggerDataImport} disabled={isImportingData} className=\"py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-60 font-bold text-sm rounded-xl transition-colors border border-amber-200 flex items-center justify-center gap-2\">\n                                                <Icons.UploadCloud className=\"w-4 h-4\" />\n                                                {isImportingData ? '导入中...' : '导入数据'}\n                                            </button>\n                                        </div>\n                                        </div>\n\n                                        {/* 运行日志 */}\n                                        <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4\">\n                                        <div className=\"flex flex-col sm:flex-row sm:items-start justify-between gap-3\">\n                                            <div className=\"min-w-0\">\n                                                <div className=\"flex items-center gap-2 text-slate-700 font-bold\">\n                                                    <Icons.Activity className=\"w-4 h-4 text-slate-600\" />运行日志\n                                                </div>\n                                                <div className=\"mt-1 text-[11px] font-bold text-slate-500\">\n                                                    默认关闭；开启后会写入 KV，仅用于排障。\n                                                </div>\n                                            </div>\n                                            <label className=\"flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer\">\n                                                <input type=\"checkbox\" checked={loggingEnabled} onChange={e => setLoggingEnabled(e.target.checked)} className=\"w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500\" />\n                                                启用详细日志\n                                            </label>\n                                        </div>\n                                        <div className=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n                                            <button onClick={saveLoggingSetting} disabled={isSavingLogging} className=\"py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-60 font-bold text-xs rounded-xl transition-colors border border-emerald-200\">\n                                                {isSavingLogging ? '保存中...' : '保存开关'}\n                                            </button>\n                                            <button onClick={fetchRuntimeLogs} disabled={isLoadingLogs} className=\"py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-60 font-bold text-xs rounded-xl transition-colors border border-blue-200\">\n                                                {isLoadingLogs ? '读取中...' : '刷新日志'}\n                                            </button>\n                                            <button onClick={downloadRuntimeLogs} className=\"py-2 bg-white text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-colors border border-slate-200\">\n                                                下载日志\n                                            </button>\n                                            <button onClick={clearRuntimeLogs} disabled={isLoadingLogs} className=\"py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-60 font-bold text-xs rounded-xl transition-colors border border-rose-200\">\n                                                清空\n                                            </button>\n                                        </div>\n                                        <div className=\"max-h-52 overflow-y-auto rounded-2xl bg-slate-950/90 border border-slate-900 p-3 text-[11px] leading-relaxed font-mono text-slate-200\">\n                                            {runtimeLogs.length === 0 ? (\n                                                <div className=\"text-slate-400 font-sans font-bold text-center py-6\">{isLoadingLogs ? '正在读取日志...' : '暂无日志'}</div>\n                                            ) : (\n                                                runtimeLogs.slice(-40).reverse().map((entry, index) => (\n                                                    <div key={index} className=\"mb-2 last:mb-0 whitespace-pre-wrap break-words\">\n                                                        <span className={entry.level === 'error' ? 'text-rose-300' : entry.level === 'warn' ? 'text-amber-300' : 'text-emerald-300'}>\n                                                            [{String(entry.level || 'info').toUpperCase()}]\n                                                        </span>\n                                                        <span className=\"text-slate-400\"> {new Date(Number(entry.time) || Date.now()).toLocaleString('zh-CN', { hour12: false })}</span>\n                                                        <span> {entry.event || 'event'} - {entry.message || ''}</span>\n                                                    </div>\n                                                ))\n                                            )}\n                                        </div>\n                                        </div>\n\n                                        {/* Telegram 配置 */}\n                                        <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm\">\n                                        <div className=\"flex items-center justify-between mb-4\">\n                                            <div className=\"flex items-center gap-2 text-slate-700 font-bold\">\n                                                <Icons.MessageSquare className=\"w-4 h-4 text-emerald-500\" />通知配置 (Telegram)\n                                            </div>\n                                            <label className=\"flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer\">\n                                                <input type=\"checkbox\" checked={telegramForm.enabled} onChange={e => setTelegramForm({...telegramForm, enabled: e.target.checked})} className=\"w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500\" />\n                                                启用\n                                            </label>\n                                        </div>\n                                        {telegramForm.enabled && (\n                                            <div className=\"space-y-3\">\n                                                <div>\n                                                    <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">Bot Token</label>\n                                                    <input type=\"password\" value={telegramForm.botToken} onChange={e => setTelegramForm({...telegramForm, botToken: e.target.value})} placeholder=\"123456:ABC-DEF1234...\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                                </div>\n                                                <div>\n                                                    <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">Chat ID</label>\n                                                    <input type=\"text\" value={telegramForm.chatId} onChange={e => setTelegramForm({...telegramForm, chatId: e.target.value})} placeholder=\"填写接收通知的 Chat ID\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                                </div>\n                                                <div className=\"grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2\">\n                                                    <button onClick={handleSaveTelegram} className=\"py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-sm rounded-xl transition-colors border border-emerald-200\">应用 TG 配置</button>\n                                                    <button onClick={handleTestTelegram} disabled={isTestingTelegram} className=\"py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-60 font-bold text-sm rounded-xl transition-colors border border-blue-200\">\n                                                        {isTestingTelegram ? '发送中...' : '发送测试通知'}\n                                                    </button>\n                                                </div>\n                                            </div>\n                                        )}\n                                        </div>\n\n                                        {/* 图标库 */}\n                                        <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm\">\n                                        <div className=\"flex items-center gap-2 mb-4 text-slate-700 font-bold\">\n                                            <Icons.ImageIcon className=\"w-4 h-4 text-purple-500\" />图标库 (JSON)\n                                        </div>\n                                        <div className=\"flex gap-2\">\n                                            <input type=\"text\" value={iconInput} onChange={e => setIconInput(e.target.value)} placeholder=\"https://example.com/icons.json\" className=\"flex-1 glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                            <button onClick={handleSyncIcons} className=\"px-4 py-2.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors border border-blue-200\">拉取</button>\n                                        </div>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    )}\n\n                    {/* 添加/编辑服务器弹窗 (Add Server Modal) */}\n                    {isAddModalOpen && (\n                        <div className=\"mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4\">\n                            <div className=\"mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity\" onClick={() => setIsAddModalOpen(false)}></div>\n                            <div className=\"mobile-sheet mobile-form-sheet relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200\">\n                                <button onClick={() => setIsAddModalOpen(false)} className=\"absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors\">\n                                    <Icons.X className=\"w-4 h-4\" />\n                                </button>\n                                <div className=\"flex-none\">\n                                    <h2 className=\"text-2xl font-black text-slate-800 mb-6 flex items-center gap-3\">\n                                        <Icons.Server className=\"w-6 h-6 text-emerald-500\" />\n                                        {editingServerId ? '编辑服务器' : '部署新服务器'}\n                                    </h2>\n                                </div>\n\n                                <div className=\"mobile-form-body\">\n                                    <div className=\"space-y-4\">\n                                        {/* 快捷导入 */}\n                                        <div className=\"bg-white/60 p-4 rounded-3xl border border-white shadow-sm\">\n                                        <div className=\"flex items-center justify-between gap-3 mb-2\">\n                                            <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block\">快速粘贴解析</label>\n                                            <button\n                                                type=\"button\"\n                                                onClick={applyQuickImportText}\n                                                disabled={!quickImportText.trim()}\n                                                className=\"px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed border border-blue-100 hover:bg-blue-100 text-[11px] font-black transition-colors\"\n                                            >\n                                                立即识别\n                                            </button>\n                                        </div>\n                                        <textarea\n                                            className=\"w-full h-28 glass-input p-3 rounded-2xl outline-none text-sm resize-none\"\n                                            placeholder={\"示例：\\\\n服务器：https://emby.example.com:443\\\\n用户名：demo_user\\\\n密码：demo_password\"}\n                                            value={quickImportText}\n                                            onChange={e=>setQuickImportText(e.target.value)}\n                                        />\n                                        </div>\n\n                                        {/* 基础配置 */}\n                                        <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4\">\n                                        <div className=\"flex items-center gap-2 mb-2 text-slate-700 font-bold\">\n                                            <Icons.Link className=\"w-4 h-4 text-blue-500\" />基础路由信息\n                                        </div>\n                                        <div>\n                                            <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">服务器标识 (别名)</label>\n                                            <input type=\"text\" value={addForm.name} onChange={e=>setAddForm({...addForm, name: e.target.value})} placeholder=\"例如：US West Main\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                        </div>\n                                        <div>\n                                            <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">服务器地址</label>\n                                            <div className=\"grid grid-cols-[80px_1fr_80px] gap-2\">\n                                                <button onClick={toggleProtocol} className=\"glass-input rounded-xl text-xs font-black text-blue-600 transition-colors uppercase\">{addForm.protocol.replace('://', '')}</button>\n                                                <input type=\"text\" value={addForm.host} onChange={e=>updateHostFromInput(e.target.value)} placeholder=\"emby.example.com\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none\" />\n                                                <input type=\"text\" value={addForm.port} onChange={e=>setAddForm({...addForm, port: cleanPortInput(e.target.value)})} placeholder=\"443\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono text-center outline-none\" />\n                                            </div>\n                                        </div>\n                                        </div>\n\n                                        {/* 备用地址 */}\n                                        <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3\">\n                                        <div className=\"flex items-center justify-between gap-3\">\n                                            <div className=\"flex items-center gap-2 text-slate-700 font-bold\">\n                                                <Icons.Link className=\"w-4 h-4 text-emerald-500\" />备用地址\n                                            </div>\n                                            <button\n                                                type=\"button\"\n                                                onClick={addFallbackUrl}\n                                                disabled={fallbackUrls.length >= 8}\n                                                className=\"px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-100 hover:bg-emerald-100 text-[11px] font-black transition-colors\"\n                                            >\n                                                添加\n                                            </button>\n                                        </div>\n                                        {fallbackUrls.length === 0 ? (\n                                            <div className=\"text-xs text-slate-400 font-semibold bg-white/45 border border-white/70 rounded-2xl px-4 py-3\">主地址不可用时，将按顺序探测备用地址。</div>\n                                        ) : (\n                                            <div className=\"space-y-2\">\n                                                {fallbackUrls.map((fallbackUrl, index) => (\n                                                    <div key={index} className=\"grid grid-cols-[1fr_40px] gap-2\">\n                                                        <input type=\"text\" value={fallbackUrl} onChange={e=>updateFallbackUrl(index, e.target.value)} placeholder={\"https://backup\" + (index + 1) + \".example.com\"} className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none\" />\n                                                        <button type=\"button\" onClick={() => removeFallbackUrl(index)} className=\"w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 transition-colors\">\n                                                            <Icons.X className=\"w-4 h-4\" />\n                                                        </button>\n                                                    </div>\n                                                ))}\n                                            </div>\n                                        )}\n                                        </div>\n\n                                        {/* 媒体库配置 */}\n                                        <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4\">\n                                        <div className=\"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between\">\n                                            <div className=\"min-w-0\">\n                                                <div className=\"flex items-center gap-2 text-slate-700 font-bold\">\n                                                    <Icons.ShieldCheck className=\"w-4 h-4 text-purple-500\" />资源统计\n                                                </div>\n                                                <div className=\"mt-1 text-[11px] font-bold text-slate-400\">系统会用账号密码自动登录 Emby，获取访问 Token 和用户 ID，用于读取最后播放时间</div>\n                                            </div>\n                                            <label className=\"flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer self-start sm:self-auto\">\n                                                <input type=\"checkbox\" checked={mediaForm.enabled} onChange={e=>setMediaForm({...mediaForm, enabled: e.target.checked})} className=\"w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500\" />\n                                                <span>启用媒体数量统计</span>\n                                            </label>\n                                        </div>\n                                        {mediaForm.enabled && (\n                                            <div className=\"space-y-3 pt-2\">\n                                                <div className=\"text-[10px] font-black text-slate-500 uppercase tracking-widest\">账号登录</div>\n                                                <div className=\"grid grid-cols-2 gap-3\">\n                                                <div>\n                                                    <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">用户名</label>\n                                                    <input type=\"text\" value={mediaForm.username} onChange={e=>setMediaForm({...mediaForm, username: e.target.value})} placeholder=\"Admin\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                                </div>\n                                                <div>\n                                                    <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">密码</label>\n                                                    <input type=\"password\" value={mediaForm.password} onChange={e=>setMediaForm({...mediaForm, password: e.target.value})} placeholder=\"••••••••\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                                </div>\n                                                </div>\n                                            </div>\n                                        )}\n                                        </div>\n\n                                        {/* 保号设置 */}\n                                        <div ref={keepAliveSectionRef} className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4\">\n                                        <div className=\"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between\">\n                                            <div className=\"flex items-center gap-2 text-slate-700 font-bold\">\n                                                <Icons.Clock className=\"w-4 h-4 text-orange-500\" />保号检测\n                                            </div>\n                                            <label className=\"flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer self-start sm:self-auto\">\n                                                <input type=\"checkbox\" checked={keepAliveForm.enabled} onChange={e=>setKeepAliveForm({...keepAliveForm, enabled: e.target.checked})} className=\"w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500\" />\n                                                <span>启用保号</span>\n                                            </label>\n                                        </div>\n                                        {keepAliveForm.enabled && (\n                                            <div className=\"grid grid-cols-2 gap-3 pt-2\">\n                                                <div>\n                                                    <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">活跃周期（天）</label>\n                                                    <input type=\"text\" inputMode=\"numeric\" value={keepAliveForm.periodDays} onChange={e=>setKeepAliveForm({...keepAliveForm, periodDays: cleanPositiveIntInput(e.target.value)})} placeholder=\"例如：30\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                                </div>\n                                                <div>\n                                                    <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">提前提醒（天）</label>\n                                                    <input type=\"text\" inputMode=\"numeric\" value={keepAliveForm.alertDays} onChange={e=>setKeepAliveForm({...keepAliveForm, alertDays: cleanPositiveIntInput(e.target.value)})} placeholder=\"例如：27\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                                </div>\n                                            </div>\n                                        )}\n                                        </div>\n                                    </div>\n                                </div>\n\n                                <div className=\"mobile-form-footer mt-8\">\n                                    <button onClick={handleSaveServer} disabled={isSavingServer || isRefreshing} className=\"w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/10 transition-all flex justify-center items-center gap-2\">\n                                        {isSavingServer ? '保存中...' : (editingServerId ? '保存修改' : '确认部署')}\n                                    </button>\n                                </div>\n                            </div>\n                        </div>\n                    )}\n\n                    {/* 分享弹窗 */}\n                    {shareModalTarget && (() => {\n                        const targetServer = shareModalTarget === 'public' ? null : servers.find(server => String(server.id) === String(shareModalTarget));\n                        const publicUrl = getPublicUrl();\n                        const shareExpired = publicShareExpiresAt ? Date.now() >= publicShareExpiresAt : false;\n                        const shareExpiresText = publicShareExpiresAt ? new Date(publicShareExpiresAt).toLocaleString('zh-CN', { hour12: false }) : '';\n                        const cardShare = targetServer ? cardShareLinks[targetServer.id] : null;\n                        const cardShareExpired = cardShare && cardShare.expiresAt ? Date.now() >= cardShare.expiresAt : false;\n                        const cardShareExpiresText = cardShare && cardShare.expiresAt ? new Date(cardShare.expiresAt).toLocaleString('zh-CN', { hour12: false }) : '';\n                        return (\n                            <div className=\"mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4\">\n                                <div className=\"mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity\" onClick={() => setShareModalTarget(null)}></div>\n                                <div className=\"mobile-sheet relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200\">\n                                    <button onClick={() => setShareModalTarget(null)} className=\"absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors\">\n                                        <Icons.X className=\"w-4 h-4\" />\n                                    </button>\n\n                                    <h2 className=\"text-2xl font-black text-slate-800 mb-6 flex items-center gap-3\">\n                                        <Icons.Share2 className=\"w-6 h-6 text-emerald-500\" />\n                                        {targetServer ? '服务器卡片分享' : '公开链接'}\n                                    </h2>\n\n                                    <div className=\"space-y-4\">\n                                        {!targetServer && (\n                                        <React.Fragment>\n                                            <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3\">\n                                                <div className=\"flex items-center justify-between gap-3\">\n                                                    <div className=\"text-slate-700 font-bold\">公开大盘链接</div>\n                                                    <button onClick={generatePublicShareLink} disabled={isGeneratingPublicShare} className=\"px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 text-[11px] font-black transition-colors flex items-center gap-1.5 disabled:opacity-50\">\n                                                        <Icons.Share2 className=\"w-3.5 h-3.5\" /> {isGeneratingPublicShare ? '生成中...' : (publicShareLink ? '重新生成' : '生成')}\n                                                    </button>\n                                                </div>\n                                                <div className=\"grid grid-cols-2 gap-2\">\n                                                    <button type=\"button\" onClick={() => setPublicShareLifetime('hour')} className={\"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors \" + (publicShareLifetime === 'hour' ? \"bg-slate-800 text-white border-slate-800\" : \"bg-white/70 text-slate-600 border-white hover:bg-white\")}>1 小时有效</button>\n                                                    <button type=\"button\" onClick={() => setPublicShareLifetime('forever')} className={\"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors \" + (publicShareLifetime === 'forever' ? \"bg-slate-800 text-white border-slate-800\" : \"bg-white/70 text-slate-600 border-white hover:bg-white\")}>永久有效</button>\n                                                </div>\n                                                <label className=\"flex items-center gap-2 text-[11px] font-bold text-slate-600\">\n                                                    <input type=\"checkbox\" checked={publicShareIncludeProfile} onChange={e => setPublicShareIncludeProfile(e.target.checked)} className=\"w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500\" />\n                                                    <span>公开页显示 Telegram 名称和头像</span>\n                                                </label>\n                                                <div className=\"grid grid-cols-2 gap-2\">\n                                                    <button type=\"button\" onClick={() => setPublicShareHideCounts(false)} className={\"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors \" + (!publicShareHideCounts ? \"bg-slate-800 text-white border-slate-800\" : \"bg-white/70 text-slate-600 border-white hover:bg-white\")}>展示数量</button>\n                                                    <button type=\"button\" onClick={() => setPublicShareHideCounts(true)} className={\"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors \" + (publicShareHideCounts ? \"bg-slate-800 text-white border-slate-800\" : \"bg-white/70 text-slate-600 border-white hover:bg-white\")}>隐藏数量</button>\n                                                </div>\n                                                <div className=\"text-[10px] font-bold text-slate-400 leading-relaxed\">\n                                                    隐藏后只保留前缀位数，例如 58690 变成 58***，500 变成 5**。\n                                                </div>\n                                                <div className=\"grid grid-cols-[1fr_44px] gap-2\">\n                                                    <input readOnly value={publicUrl} className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none\" />\n                                                    <button onClick={() => copyText(publicUrl, '公开大盘链接')} className=\"w-11 h-11 flex items-center justify-center rounded-xl bg-white text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors\">\n                                                        <Icons.Copy className=\"w-4 h-4\" />\n                                                    </button>\n                                                </div>\n                                                <div className=\"text-[11px] font-bold text-slate-500 flex items-center justify-between gap-3\">\n                                                    <span>有效期：{publicShareLifetime === 'forever' ? '永久' : '1 小时'}</span>\n                                                    {publicShareExpiresAt ? <span>{shareExpired ? '已过期' : '过期时间：' + shareExpiresText}</span> : (publicShareLink ? <span>永久有效</span> : null)}\n                                                </div>\n                                            </div>\n\n                                            <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3\">\n                                                <div className=\"flex items-center justify-between gap-3\">\n                                                    <div className=\"text-slate-700 font-bold\">公开页独立访问统计</div>\n                                                    <button onClick={fetchPublicShareStats} disabled={isLoadingPublicShareStats} className=\"px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 text-[11px] font-black transition-colors disabled:opacity-50\">\n                                                        {isLoadingPublicShareStats ? '刷新中...' : '刷新'}\n                                                    </button>\n                                                </div>\n                                                <div className=\"space-y-2 max-h-72 overflow-y-auto pr-1\">\n                                                    {publicShareStats.length === 0 && (\n                                                        <div className=\"py-8 text-center text-xs font-bold text-slate-400\">\n                                                            {isLoadingPublicShareStats ? '正在读取统计...' : '暂无公开页记录'}\n                                                        </div>\n                                                    )}\n                                                    {publicShareStats.map((item) => {\n                                                        const itemExpired = Number(item.expiresAt) > 0 && Date.now() >= Number(item.expiresAt);\n                                                        const itemUrl = item.url || (getShareBaseUrl() + '/public/' + item.token);\n                                                        const maskCount = (value, hide = false) => {\n                                                            const text = String(Math.max(0, Number(value) || 0));\n                                                            if (!hide) return text;\n                                                            if (text.length <= 1) return text + '**';\n                                                            const keep = text.length >= 5 ? 2 : 1;\n                                                            return text.slice(0, keep) + '*'.repeat(Math.max(2, text.length - keep));\n                                                        };\n                                                        return (\n                                                            <div key={item.token} className=\"rounded-2xl bg-white/70 border border-white p-3 space-y-2\">\n                                                                <div className=\"flex items-center justify-between gap-3\">\n                                                                    <div className=\"text-sm font-black text-slate-700 tabular-nums\">{Number(item.views) || 0} 个独立 IP</div>\n                                                                    <span className={\"px-2 py-1 rounded-full text-[10px] font-black \" + (itemExpired ? \"bg-slate-100 text-slate-500\" : \"bg-emerald-50 text-emerald-600\")}>{itemExpired ? '已过期' : (Number(item.expiresAt) ? '有效中' : '永久')}</span>\n                                                                </div>\n                                                                <div className=\"text-[11px] font-bold text-slate-500 space-y-1\">\n                                                                    <div>生成：{formatStatTime(item.createdAt)}</div>\n                                                                    <div>过期：{formatShareExpires(item.expiresAt)}</div>\n                                                                    <div>最后访问：{formatStatTime(item.lastViewedAt)}</div>\n                                                                </div>\n                                                                <div className=\"grid grid-cols-3 gap-2 text-center\">\n                                                                    <div className=\"rounded-xl bg-white/60 border border-white px-2 py-2\">\n                                                                        <div className=\"text-[9px] font-black text-slate-400\">电影</div>\n                                                                        <div className=\"mt-1 text-sm font-black text-slate-700 tabular-nums\">{maskCount(item.movieCount, item.hideCounts)}</div>\n                                                                    </div>\n                                                                    <div className=\"rounded-xl bg-white/60 border border-white px-2 py-2\">\n                                                                        <div className=\"text-[9px] font-black text-slate-400\">剧集</div>\n                                                                        <div className=\"mt-1 text-sm font-black text-slate-700 tabular-nums\">{maskCount(item.seriesCount, item.hideCounts)}</div>\n                                                                    </div>\n                                                                    <div className=\"rounded-xl bg-white/60 border border-white px-2 py-2\">\n                                                                        <div className=\"text-[9px] font-black text-slate-400\">总集数</div>\n                                                                        <div className=\"mt-1 text-sm font-black text-slate-700 tabular-nums\">{maskCount(item.episodeCount, item.hideCounts)}</div>\n                                                                    </div>\n                                                                </div>\n                                                                <div className=\"grid grid-cols-[1fr_38px_38px] gap-2\">\n                                                                    <input readOnly value={itemUrl} className=\"w-full glass-input px-3 py-2 rounded-xl text-[11px] font-mono outline-none\" />\n                                                                    <button onClick={() => copyText(itemUrl, '公开页链接')} className=\"w-[38px] h-[38px] flex items-center justify-center rounded-xl bg-white text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors\">\n                                                                        <Icons.Copy className=\"w-4 h-4\" />\n                                                                    </button>\n                                                                    <button onClick={() => deletePublicShareLink(item.token)} disabled={deletingPublicShareToken === item.token} className=\"w-[38px] h-[38px] flex items-center justify-center rounded-xl bg-white text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors disabled:opacity-50\">\n                                                                        <Icons.Trash2 className=\"w-4 h-4\" />\n                                                                    </button>\n                                                                </div>\n                                                            </div>\n                                                        );\n                                                    })}\n                                                </div>\n                                            </div>\n                                        </React.Fragment>\n                                        )}\n\n                                        {targetServer && (\n                                            <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3\">\n                                                <div className=\"flex items-center justify-between gap-3\">\n                                                    <div className=\"text-slate-700 font-bold truncate\">卡片图片快照</div>\n                                                    <button onClick={() => generateCardShareLink(targetServer.id)} disabled={generatingCardShareId === targetServer.id} className=\"px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 text-[11px] font-black transition-colors flex items-center gap-1.5 disabled:opacity-50\">\n                                                        <Icons.Share2 className=\"w-3.5 h-3.5\" /> {generatingCardShareId === targetServer.id ? '生成中...' : '生成'}\n                                                    </button>\n                                                </div>\n                                                {cardShare && (\n                                                    <div className=\"space-y-2\">\n                                                        <div className=\"rounded-2xl bg-white/70 border border-white p-3 flex justify-center overflow-hidden\">\n                                                            <img src={cardShare.url} alt=\"server card snapshot\" className=\"w-full max-w-md rounded-xl\" />\n                                                        </div>\n                                                        <div className=\"grid grid-cols-[1fr_44px] gap-2\">\n                                                            <input readOnly value={cardShare.url} className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none\" />\n                                                            <button onClick={() => copyText(cardShare.url, '卡片图片地址')} className=\"w-11 h-11 flex items-center justify-center rounded-xl bg-white text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors\">\n                                                                <Icons.Copy className=\"w-4 h-4\" />\n                                                            </button>\n                                                        </div>\n                                                        <div className=\"text-[11px] font-bold text-slate-500 flex items-center justify-between gap-3\">\n                                                            <span>有效期：1 小时</span>\n                                                            {cardShare.expiresAt && <span>{cardShareExpired ? '已过期' : '过期时间：' + cardShareExpiresText}</span>}\n                                                        </div>\n                                                    </div>\n                                                )}\n                                            </div>\n                                        )}\n\n                                    </div>\n                                </div>\n                            </div>\n                        );\n                    })()}\n\n                    {/* 图标选择弹窗 */}\n                    {iconModalTarget && (\n                        <div className=\"mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4\">\n                            <div className=\"mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity\" onClick={() => setIconModalTarget(null)}></div>\n                            <div className=\"mobile-sheet mobile-icon-sheet relative w-full max-w-4xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 flex flex-col border border-white animate-in zoom-in-95 duration-200\">\n                                <button onClick={() => setIconModalTarget(null)} className=\"absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors z-10\">\n                                    <Icons.X className=\"w-4 h-4\" />\n                                </button>\n                                <h2 className=\"text-2xl font-black text-slate-800 mb-2 flex items-center gap-2\"><Icons.ImageIcon className=\"w-6 h-6 text-purple-500\" />图标选择</h2>\n                                <p className=\"text-xs text-slate-500 mb-6 font-bold\">点击下方图标为服务器应用自定义图标。</p>\n\n                                <div className=\"flex flex-col sm:flex-row gap-3 sm:items-center mb-4\">\n                                    <div className=\"relative flex-1\">\n                                        <Icons.Search className=\"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400\" />\n                                        <input type=\"text\" className=\"w-full pl-9 pr-4 py-2.5 glass-input rounded-xl text-sm outline-none\" placeholder=\"搜索图标名称...\" value={iconSearch} onChange={e => setIconSearch(e.target.value)} autoFocus />\n                                    </div>\n                                    <div className=\"text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 whitespace-nowrap\">\n                                        {filteredIconEntries.length} / {safeIconEntries.length}\n                                    </div>\n                                </div>\n\n                                <div className=\"overflow-y-auto pr-2 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 pb-4 mt-2 max-h-[60vh]\">\n                                    <div onClick={async () => {\n                                        const up = servers.map(s => s.id === iconModalTarget ? {...s, customIcon: null} : s);\n                                        await syncToCloud(up, iconLib);\n                                        setIconModalTarget(null);\n                                    }} className=\"aspect-square bg-slate-100 rounded-[1.2rem] border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors\">\n                                        <span className=\"text-[10px] font-bold text-slate-500\">自动匹配</span>\n                                    </div>\n                                    {filteredIconEntries.map(([key, url], idx) => (\n                                        <div key={idx} onClick={async () => {\n                                            const up = servers.map(s => s.id === iconModalTarget ? {...s, customIcon: url} : s);\n                                            await syncToCloud(up, iconLib);\n                                            setIconModalTarget(null);\n                                        }} className=\"aspect-square bg-white rounded-[1.2rem] border border-slate-100 p-3 cursor-pointer hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center shadow-sm relative group transition-all\">\n                                            <img src={getProxyImgSrc(url)} className=\"w-full h-full object-contain drop-shadow-sm\" loading=\"lazy\" onError={(e) => {e.target.style.display='none'}} />\n                                            <div className=\"absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-50 shadow-xl\">{key}</div>\n                                        </div>\n                                    ))}\n                                    {filteredIconEntries.length === 0 && (\n                                        <div className=\"col-span-full py-12 text-center text-slate-500 text-sm font-bold\">没有匹配的图标</div>\n                                    )}\n                                </div>\n                            </div>\n                        </div>\n                    )}\n                </div>\n            );\n        };\n        const rootEl = document.getElementById('root');\n        try {\n            if (!window.React || !window.ReactDOM) throw new Error('React 或 ReactDOM 未加载');\n            if (rootEl) { ReactDOM.createRoot(rootEl).render(<App />); window.__EMBY_DASHBOARD_BOOTED__ = true; }\n        } catch(e) { showBootError('React 渲染失败：' + (e.message || e.toString())); }\r\n    </script>\r\n    <script>\r\n        setTimeout(function() {\r\n            var root = document.getElementById('root');\r\n            if (!window.__EMBY_DASHBOARD_BOOTED__ && root && root.textContent.indexOf('页面加载中') !== -1) {\r\n                root.innerHTML = '<div style=\"max-width:760px;margin:48px auto;padding:20px;border:1px solid #7f1d1d;border-radius:16px;background:#1e293b;color:#fecaca;font-family:system-ui;white-space:pre-wrap;\">前端启动失败：React/Babel 脚本没有完成渲染。请确认部署的是最新 emby.js，并打开浏览器控制台查看具体报错。</div>';\r\n            }\r\n        }, 4500);\r\n    </script>\r\n</body>\r\n</html>\r\n";

export default {
  APP_VERSION: "2026.07.04.1",
  APP_RUNTIME_VERSIONS: {
    worker: "2026.07.04.1",
    docker: "2026.07.04.1"
  },
  APP_UPDATE_NOTES: [
      "新增 User Usage Stats 播放记录来源，提高 EmbyBoss 类服务器最后播放时间准确性。",
      "优化保号账号登录文案，明确使用 AccessToken/UserId 而非 API Key。",
      "保留现有标准 Emby /Items、Playback Reporting 和 ActivityLog 兜底。"
  ],
  UPDATE_REPO_OWNER: 'pototazhang',
    UPDATE_REPO_NAME: 'emby-js',
    UPDATE_BRANCH: 'main',
    UPDATE_FILE: 'emby.js',
    PROBE_CONCURRENCY_LIMIT: 4,
    OFFLINE_CONFIRMATION_THRESHOLD: 3,
    OFFLINE_CONFIRMATION_WINDOW_MS: 5 * 60 * 1000,
    PROBE_FAILURE_SUPPRESSION_RATIO: 0.5,
    HISTORY_LIMIT: 24 * 60,
    HISTORY_COMPACTION_MARKER_KEY: 'history_limit_compacted',
    OFFLINE_NOTIFY_DELAY_MS: 5 * 60 * 1000,
    APP_ICON_SVG: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><defs><linearGradient id="bg" x1="32" y1="24" x2="224" y2="232" gradientUnits="userSpaceOnUse"><stop stop-color="#3b82f6"/><stop offset="1" stop-color="#10b981"/></linearGradient><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#0f172a" flood-opacity=".22"/></filter></defs><rect width="256" height="256" rx="56" fill="#dce8fb"/><circle cx="68" cy="58" r="66" fill="#bfdbfe" opacity=".65"/><circle cx="198" cy="196" r="78" fill="#a7f3d0" opacity=".55"/><g filter="url(#s)"><rect x="48" y="58" width="160" height="58" rx="18" fill="url(#bg)"/><rect x="48" y="140" width="160" height="58" rx="18" fill="url(#bg)" opacity=".92"/><circle cx="78" cy="87" r="8" fill="white"/><circle cx="78" cy="169" r="8" fill="white"/><path d="M106 86h66M106 168h66" stroke="white" stroke-width="12" stroke-linecap="round" opacity=".86"/></g></svg>',

  async fetch(request, env) {
      const url = new URL(request.url);
      const publicShareHost = this.isPublicShareHost(request, env);
      if (publicShareHost && !this.isAllowedPublicSharePath(url.pathname)) {
        return new Response('Not Found', { status: 404 });
      }
  
      if (url.pathname === '/manifest.webmanifest') {
        return this.json({
            name: 'Emby 服务器探针',
            short_name: 'Emby 探针',
            start_url: '/',
            scope: '/',
            display: 'standalone',
            background_color: '#dce8fb',
            theme_color: '#dce8fb',
            icons: [
                { src: '/app-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
            ]
        });
      }
  
      if (url.pathname === '/app-icon.svg') {
        return new Response(this.APP_ICON_SVG, {
            headers: {
                'Content-Type': 'image/svg+xml;charset=utf-8',
                'Cache-Control': 'public, max-age=604800'
            }
        });
      }
  
      if (url.pathname === '/public') {
        return new Response('Link required', { status: 404, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
      }
  
      if (request.method === 'GET' && /^\/public\/[a-f0-9]{24}$/i.test(url.pathname)) {
        if (this.shouldBlockPublicShareAccess(request)) {
          return new Response('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
        }
        const token = url.pathname.split('/').pop();
        const tokenRecord = await this.getPublicShareToken(env, token);
        if (!tokenRecord || (Number(tokenRecord.expiresAt) > 0 && Number(tokenRecord.expiresAt) <= Date.now())) return new Response('Link expired', { status: 410, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
        await this.recordPublicShareView(env, token, tokenRecord, request);
        const config = await this.loadConfig(env);
        const ownerProfile = tokenRecord.telegramProfile || null;
        const publicPageState = {
            ownerProfile,
            hideCounts: Boolean(tokenRecord.hideCounts)
        };
        return new Response(this.buildPublicPage(config, publicPageState), {
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
                'Cache-Control': 'no-store'
            }
        });
      }
  
      if (url.pathname === '/api/public/share-token' && request.method === 'POST') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
        const body = await request.json().catch(() => ({}));
        const lifetime = body.lifetime === 'forever' ? 'forever' : 'hour';
        const token = this.generatePublicShareToken();
        const expiresAt = lifetime === 'forever' ? 0 : Date.now() + (60 * 60 * 1000);
        const config = await this.loadConfig(env);
        const profile = body.includeTelegramProfile ? await this.readTelegramChatProfile(env, config) : null;
        await this.storePublicShareToken(env, token, expiresAt, {
            origin: url.origin || '',
            telegramProfile: profile,
            hideCounts: Boolean(body.hideCounts)
        });
        const baseUrl = url.origin || '';
        const publicUrl = baseUrl.replace(/\/$/, '') + '/public/' + token;
        return this.json({ ok: true, token, url: publicUrl, expiresAt });
      }
  
      const publicTokenApiMatch = url.pathname.match(/^\/api\/public\/share-token\/([a-f0-9]{24})$/i);
      if (publicTokenApiMatch && request.method === 'DELETE') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
        await this.deletePublicShareToken(env, publicTokenApiMatch[1]);
        return this.json({ ok: true });
      }
  
      if (url.pathname === '/api/public/share-stats' && request.method === 'GET') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
        return this.json({ ok: true, items: await this.listPublicShareStats(env, url.origin || '') });
      }
  
      if (url.pathname === '/api/card/share-token' && request.method === 'POST') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
        const body = await request.json().catch(() => ({}));
        const serverId = String(body.serverId || '');
        const config = await this.loadConfig(env);
        const clean = this.sanitizeConfig(config);
        const server = clean.servers.find((item) => String(item.id) === serverId);
        if (!server) return this.json({ ok: false, error: 'Server not found' }, 404);
        const token = this.generatePublicShareToken();
        const expiresAt = Date.now() + (60 * 60 * 1000);
        await this.storeCardShareToken(env, token, { expiresAt, serverId });
        const baseUrl = url.origin || '';
        const cardUrl = baseUrl.replace(/\/$/, '') + '/card/' + token + '.svg';
        return this.json({ ok: true, token, url: cardUrl, expiresAt });
      }
  
      const cardMatch = url.pathname.match(/^\/card\/([a-f0-9]{24})\.svg$/i);
      if (cardMatch && request.method === 'GET') {
        const tokenRecord = await this.getCardShareToken(env, cardMatch[1]);
        if (!tokenRecord || tokenRecord.expiresAt <= Date.now()) return new Response('Link expired', { status: 410, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
        const config = await this.loadConfig(env);
        const clean = this.sanitizeConfig(config);
        const server = clean.servers.find((item) => String(item.id) === String(tokenRecord.serverId));
        if (!server) return new Response('Not Found', { status: 404 });
        return new Response(new Blob([this.buildServerCardSvg(server, clean)], { type: 'image/svg+xml;charset=utf-8' }), {
            headers: {
                'Content-Type': 'image/svg+xml;charset=utf-8',
                'Cache-Control': 'no-store'
            }
        });
      }
  
      if (url.pathname === '/api/config') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
  
        try {
            if (request.method === 'GET') {
                const config = await this.loadConfig(env);
                return this.json({ ...config, notifyEnabled: this.isTelegramEnabled(env, config), telegram: this.getTelegramConfig(env, config), logging: config.logging || { enabled: false }, publicShareBaseUrl: this.getPublicShareBaseUrl(env), publicShareWildcardDomain: this.getPublicShareWildcardDomain(env) });
            }
            if (request.method === 'POST') {
                const nextConfig = await request.json();
                const cleanConfig = this.sanitizeConfig(nextConfig);
                const latestConfig = await this.loadConfig(env);
                if (nextConfig.baseRevision && latestConfig.revision && nextConfig.baseRevision !== latestConfig.revision) {
                    return this.json({ ok: false, error: 'Config changed, reload required', latestUpdatedAt: latestConfig.updatedAt, revision: latestConfig.revision }, 409);
                }
                if (latestConfig.updatedAt && cleanConfig.updatedAt && cleanConfig.updatedAt < latestConfig.updatedAt) {
                    return this.json({ ok: false, error: 'Stale config rejected', latestUpdatedAt: latestConfig.updatedAt, revision: latestConfig.revision }, 409);
                }
                const savedConfig = await this.saveConfig(env, cleanConfig);
                return this.json({ ok: true, updatedAt: savedConfig.updatedAt, revision: savedConfig.revision });
            }
        } catch (e) {
            await this.appendRuntimeLog(env, 'error', 'config.route.error', '配置接口异常', {
                method: request.method,
                error: e && e.message ? e.message : String(e || 'config error'),
                stack: e && e.stack ? String(e.stack).split('\n').slice(0, 6).join('\n') : ''
            }).catch(() => {});
            return this.json({ ok: false, error: 'CONFIG_READ_FAILED' }, 500);
        }
      }
  
      if (url.pathname === '/api/logging' && request.method === 'POST') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
  
        const body = await request.json().catch(() => ({}));
        const currentConfig = await this.loadConfig(env);
        const nextConfig = await this.saveConfig(env, { ...currentConfig, logging: { enabled: Boolean(body.enabled) }, updatedAt: Date.now() });
        await this.appendRuntimeLog(env, 'info', 'logs.toggle', Boolean(body.enabled) ? '运行日志已开启' : '运行日志已关闭', {}, { force: true });
        return this.json({ ok: true, logging: nextConfig.logging || { enabled: false }, updatedAt: nextConfig.updatedAt, revision: nextConfig.revision });
      }
  
      if (url.pathname === '/api/data/export' && request.method === 'GET') {
        const auth = this.requireStrictAdmin(request, env);
        if (auth) return auth;
  
        const snapshot = await this.exportKvSnapshot(env);
        const fileName = 'emby-kv-snapshot-' + new Date(snapshot.exportedAt || Date.now()).toISOString().replace(/[:]/g, '-').replace(/\.\d{3}Z$/, 'Z') + '.json';
        await this.appendRuntimeLog(env, 'info', 'data.export', '导出迁移数据快照', {
            entryCount: Array.isArray(snapshot.entries) ? snapshot.entries.length : 0,
            appVersion: snapshot.appVersion || ''
        }, { force: true });
        return new Response(JSON.stringify(snapshot, null, 2), {
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Cache-Control': 'no-store',
                'Content-Disposition': 'attachment; filename="' + fileName + '"'
            }
        });
      }
  
      if (url.pathname === '/api/data/import' && request.method === 'POST') {
        const auth = this.requireStrictAdmin(request, env);
        if (auth) return auth;
  
        try {
            const body = await request.json().catch(() => ({}));
            const snapshot = body && body.snapshot ? body.snapshot : body;
            const result = await this.importKvSnapshot(env, snapshot, { replace: body.replace !== false });
            if (!result.ok) return this.json(result, 400);
            const config = await this.loadConfig(env);
            await this.appendRuntimeLog(env, 'info', 'data.import', '导入迁移数据快照', {
                imported: result.imported || 0,
                skipped: result.skipped || 0,
                total: result.total || 0,
                replaced: Boolean(result.replaced)
            }, { force: true, config });
            return this.json({
                ok: true,
                imported: result.imported || 0,
                skipped: result.skipped || 0,
                total: result.total || 0,
                replaced: Boolean(result.replaced),
                config: {
                    updatedAt: config.updatedAt || 0,
                    revision: config.revision || '',
                    notifyEnabled: this.isTelegramEnabled(env, config),
                    telegram: this.getTelegramConfig(env, config),
                    logging: config.logging || { enabled: false }
                }
            });
        } catch (e) {
            await this.appendRuntimeLog(env, 'error', 'data.import.error', '导入迁移数据快照失败', { error: e && e.message ? e.message : String(e || 'Import failed') }, { force: true }).catch(() => {});
            return this.json({ ok: false, error: e && e.message ? e.message : 'Import failed' }, 400);
        }
      }
  
      if (url.pathname === '/api/telegram/test' && request.method === 'POST') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
  
        const body = await request.json().catch(() => ({}));
        const currentConfig = await this.loadConfig(env);
        const testConfig = this.sanitizeConfig({
            ...currentConfig,
            telegram: body.telegram && typeof body.telegram === 'object' ? body.telegram : currentConfig.telegram
        });
        const result = await this.testTelegram(env, testConfig);
        await this.appendRuntimeLog(env, result.ok ? 'info' : 'warn', 'telegram.test', result.ok ? 'Telegram 测试通知发送成功' : 'Telegram 测试通知发送失败', { status: result.status || 0, error: result.error || '' }, { config: testConfig });
        return this.json(result, result.ok ? 200 : 400);
      }
  
      if (url.pathname === '/api/fetch-icons') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
  
        try {
            const iconUrl = this.parsePublicHttpUrl(url.searchParams.get('url'));
            if (!iconUrl) return new Response('Invalid URL', { status: 400 });
            const r = await fetch(iconUrl.toString(), {
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' }
            });
            if (!r.ok) return new Response('{}', { status: 502, headers: { 'Content-Type': 'application/json' } });
            let txt = await r.text();
  
            try {
                txt = txt.replace(/，/g, ',').replace(/“|”/g, '"').replace(/'/g, '"').replace(/,(\s*[}\\]])/g, '$1').trim();
                const parsedIcons = this.extractIcons(JSON.parse(txt));
                return this.json(parsedIcons);
            } catch(e) {
                const urls = txt.match(/https?:\/\/[^"'\s]+/g) || [];
                return this.json(this.extractIcons(urls));
            }
        } catch(e) { return new Response('{}', { status: 500 }); }
      }
  
      if (url.pathname === '/proxy-img') {
          try {
              const target = this.parsePublicHttpUrl(url.searchParams.get('url'));
              if (!target) return new Response('Missing URL', { status: 400 });
              const imgRes = await fetch(target.toString(), { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' } });
              const h = new Headers(imgRes.headers);
              const contentType = h.get('Content-Type') || '';
              if (!contentType.startsWith('image/')) return new Response('Not an image', { status: 415 });
              h.set('Access-Control-Allow-Origin', '*');
              h.set('Cache-Control', 'public, max-age=864000');
              return new Response(imgRes.body, { status: imgRes.status, headers: h });
          } catch(e) {
              return new Response('Error Proxying Image', { status: 500 });
          }
      }
  
      if (url.pathname === '/api/logs') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
  
        if (request.method === 'GET') {
            const logs = await this.readRuntimeLogs(env);
            if (url.searchParams.get('format') === 'text') {
                return new Response(this.formatRuntimeLogs(logs), {
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                        'Cache-Control': 'no-store',
                        'Content-Disposition': 'attachment; filename="emby-runtime-logs.txt"'
                    }
                });
            }
            return this.json({ ok: true, logs });
        }
        if (request.method === 'DELETE') {
            await this.clearRuntimeLogs(env);
            return this.json({ ok: true, logs: await this.readRuntimeLogs(env) });
        }
      }
  
      if (url.pathname === '/api/ping-all' && request.method === 'POST') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
  
        const requestBody = await request.json().catch(() => ({}));
        const currentConfig = await this.loadConfig(env);
        const updatedConfig = await this.runProbeLogic(env, currentConfig, { forceMedia: Boolean(requestBody.forceMedia), refreshLastPlayed: Boolean(requestBody.refreshLastPlayed), cursor: Number(requestBody.cursor) || 0, source: 'manual' });
        return this.json({ ...updatedConfig, notifyEnabled: this.isTelegramEnabled(env, updatedConfig) });
      }
  
      if (url.pathname === '/api/ping-single' && request.method === 'POST') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
  
        const requestBody = await request.json().catch(() => ({}));
        const serverId = requestBody.serverId;
        if (serverId === undefined || serverId === null || serverId === '') return this.json({ ok: false, error: 'Missing serverId' }, 400);
        try {
          const currentConfig = await this.loadConfig(env);
          const result = await this.runSingleProbeLogic(env, currentConfig, serverId, { forceMedia: Boolean(requestBody.forceMedia), refreshLastPlayed: Boolean(requestBody.refreshLastPlayed) });
          if (!result.ok) return this.json({ ok: false, error: result.error || 'Single ping failed' }, result.status || 500);
          const updatedConfig = result.config;
          return this.json({ ok: true, ...updatedConfig, server: result.server, notifyEnabled: this.isTelegramEnabled(env, updatedConfig) });
        } catch(e) {
          const message = e && e.message ? e.message : String(e || 'Single ping failed');
          try {
            const logConfig = await this.loadConfig(env);
            await this.appendRuntimeLog(env, 'error', 'probe.single.route.error', '单体测速接口异常', { serverId, error: message, stack: e && e.stack ? String(e.stack).split('\n').slice(0, 6).join('\n') : '' }, { config: logConfig });
          } catch(logError) {}
          return this.json({ ok: false, error: message }, 500);
        }
      }
  
      if (url.pathname === '/api/media/mark-played' && request.method === 'POST') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;
  
        const body = await request.json().catch(() => ({}));
        const serverId = String(body.serverId || '');
        if (!serverId) return this.json({ ok: false, error: 'Missing serverId' }, 400);
        try {
          const config = this.sanitizeConfig(await this.loadConfig(env));
          const now = Date.now();
          let savedServer = null;
          const nextServers = config.servers.map((server) => {
            if (String(server.id) !== serverId) return server;
            const media = server.mediaStats || {};
            if (!media.enabled) throw new Error('该服务器未启用媒体库统计，无法标记保号播放');
            const keepAlive = media.keepAlive || {};
            const nextKeepAlive = {
              ...keepAlive,
              lastPlayedAt: now,
              lastCheckedAt: now,
              alertSentAt: 0
            };
            const nextServer = {
              ...server,
              mediaStats: {
                ...media,
                lastPlayedAt: now,
                lastPlayedCheck: now,
                lastPlayedError: '',
                lastPlayedItem: {
                  id: 'manual-keepalive',
                  name: '手动标记已播放',
                  type: 'Manual',
                  playedAt: now
                },
                keepAlive: nextKeepAlive
              }
            };
            savedServer = nextServer;
            return nextServer;
          });
          if (!savedServer) return this.json({ ok: false, error: 'Server not found' }, 404);
          const savedConfig = await this.saveConfig(env, { ...config, updatedAt: now, servers: nextServers });
          const responseServer = savedConfig.servers.find((server) => String(server.id) === serverId) || savedServer;
          await this.appendRuntimeLog(env, 'info', 'media.keepAlive.manualMark', '手动标记保号播放成功', { serverId, serverName: responseServer.name || '', markedAt: now }, { config: savedConfig }).catch(() => {});
          return this.json({ ok: true, ...savedConfig, server: responseServer, notifyEnabled: this.isTelegramEnabled(env, savedConfig) });
        } catch(e) {
          const message = e && e.message ? e.message : String(e || '手动标记失败');
          await this.appendRuntimeLog(env, 'error', 'media.keepAlive.manualMark.error', '手动标记保号播放失败', { serverId, error: message }).catch(() => {});
          return this.json({ ok: false, error: message }, 500);
        }
      }
  
      if (url.pathname === '/api/update/check' && request.method === 'GET') {
        const auth = this.requireStrictAdmin(request, env);
        if (auth) return auth;
  
        try {
            const capability = await this.getRuntimeUpdateCapability(env);
            const currentVersion = this.getCurrentRuntimeVersion(env, capability.mode);
            const logConfig = await this.loadConfig(env);
            await this.appendRuntimeLog(env, 'info', 'update.check', '开始检查程序更新', {}, { config: logConfig });
            const latestSource = await this.fetchLatestWorkerSource(env);
            const latestVersion = this.extractRuntimeVersion(latestSource, capability.mode) || 'unknown';
            const hasUpdate = latestVersion !== 'unknown' && latestVersion !== currentVersion;
            const releaseNotes = this.extractUpdateNotes(latestSource);
            await this.appendRuntimeLog(env, 'info', 'update.check.done', '程序更新检查完成', { currentVersion, latestVersion, hasUpdate }, { config: logConfig });
            return this.json({
                currentVersion,
                latestVersion,
                hasUpdate,
                releaseNotes,
                canUpdate: capability.canUpdate,
                sourceUrl: this.getUpdateRawUrl(env),
                missing: capability.missing,
                updateMode: capability.mode,
                updateTargetLabel: capability.targetLabel,
                busy: capability.busy,
                image: capability.image || ''
            });
        } catch(e) {
            const capability = await this.getRuntimeUpdateCapability(env).catch(() => ({ mode: 'worker', targetLabel: 'Cloudflare Worker', canUpdate: this.canSelfUpdate(env), missing: this.getMissingUpdateEnv(env), busy: false, image: '' }));
            const currentVersion = this.getCurrentRuntimeVersion(env, capability.mode);
            await this.appendRuntimeLog(env, 'error', 'update.check.error', '程序更新检查失败', { error: e.message || String(e) });
            return this.json({
                currentVersion,
                latestVersion: 'unknown',
                hasUpdate: false,
                releaseNotes: [],
                canUpdate: capability.canUpdate,
                error: e.message || 'Check update failed',
                missing: capability.missing,
                updateMode: capability.mode,
                updateTargetLabel: capability.targetLabel,
                busy: capability.busy,
                image: capability.image || ''
            }, 502);
        }
      }
  
      if (url.pathname === '/api/update/apply' && request.method === 'POST') {
        const auth = this.requireStrictAdmin(request, env);
        if (auth) return auth;
  
        const capability = await this.getRuntimeUpdateCapability(env);
        const currentVersion = this.getCurrentRuntimeVersion(env, capability.mode);
        if (!capability.canUpdate) {
            return this.json({ ok: false, error: 'Self update is not configured', missing: capability.missing, updateMode: capability.mode }, 400);
        }
        try {
            const logConfig = await this.loadConfig(env);
            await this.appendRuntimeLog(env, 'info', 'update.apply', '开始执行程序更新', {}, { config: logConfig });
            const latestSource = await this.fetchLatestWorkerSource(env);
            const latestVersion = this.extractRuntimeVersion(latestSource, capability.mode);
            if (!latestVersion) return this.json({ ok: false, error: 'Latest source has no runtime update version' }, 422);
            const releaseNotes = this.extractUpdateNotes(latestSource);
            if (latestVersion === currentVersion) return this.json({ ok: true, updated: false, version: currentVersion, releaseNotes, updateMode: capability.mode });
  
            if (capability.mode === 'docker') {
                const queued = await env.DOCKER_SELF_UPDATER.scheduleSelfUpdate({ latestVersion });
                if (!queued || queued.ok === false) {
                    return this.json({ ok: false, error: queued && queued.error ? queued.error : 'Docker update unavailable', missing: queued && queued.missing ? queued.missing : capability.missing, updateMode: 'docker' }, 400);
                }
                await this.appendRuntimeLog(env, 'info', 'update.apply.done', 'Docker 更新任务已启动', {
                    previousVersion: currentVersion,
                    version: latestVersion,
                    image: queued.image || capability.image || '',
                    alreadyRunning: Boolean(queued.alreadyRunning)
                }, { config: logConfig });
                return this.json({
                    ok: true,
                    queued: true,
                    updated: true,
                    previousVersion: currentVersion,
                    version: latestVersion,
                    releaseNotes,
                    updateMode: 'docker',
                    reloadDelayMs: 12000,
                    alreadyRunning: Boolean(queued.alreadyRunning)
                });
            }
  
            await this.deployWorkerSource(env, latestSource);
            await this.appendRuntimeLog(env, 'info', 'update.apply.done', '程序更新部署完成', { previousVersion: currentVersion, version: latestVersion }, { config: logConfig });
            return this.json({ ok: true, updated: true, previousVersion: currentVersion, version: latestVersion, releaseNotes, updateMode: 'worker' });
        } catch(e) {
            await this.appendRuntimeLog(env, 'error', 'update.apply.error', '程序更新失败', { error: e.message || String(e) });
            return this.json({ ok: false, error: e.message || 'Update failed' }, 502);
        }
      }
  
      return new Response(HTML_CONTENT, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
    },
  
    async scheduled(event, env, ctx) {
        ctx.waitUntil(this.maybeRunScheduledSelfUpdate(env).catch((e) => {
            console.log('[scheduled] auto update failed:', e && e.message ? e.message : String(e));
        }));
        ctx.waitUntil((async () => {
            const scheduledTime = Number(event && event.scheduledTime) || Date.now();
            const growthDayKey = this.getShanghaiDayKey(scheduledTime);
            await this.compactOversizedHistoriesIfNeeded(env);
            const config = await this.loadConfig(env, { skipHistoryNormalization: true });
            const scheduledStartedAt = Date.now();
            const scheduledWallLimitMs = 45 * 1000;
            const scheduledMaxBatches = 32;
            let statusUpdated = config;
            for (let batchIndex = 0; batchIndex < scheduledMaxBatches; batchIndex += 1) {
                statusUpdated = await this.runProbeLogic(env, statusUpdated, { source: 'scheduled', statusOnly: true });
                if (!statusUpdated.hasMore) break;
                if (Date.now() - scheduledStartedAt >= scheduledWallLimitMs) break;
            }
  
            const mediaUpdated = await this.refreshAllLastPlayedIfRequested(statusUpdated, { source: 'scheduled', env, scheduledTime });
            statusUpdated = await this.saveConfig(env, mediaUpdated, { skipHistoryNormalization: true });
  
            const enabledMediaServers = Array.isArray(statusUpdated.servers) ? statusUpdated.servers.filter((server) => server && server.mediaStats && server.mediaStats.enabled) : [];
            const growthReady = enabledMediaServers.length > 0 && enabledMediaServers.every((server) => server.mediaStats && server.mediaStats.dailyKey === growthDayKey);
            const growthNotified = String(statusUpdated.growthLeaderboardNotifiedDayKey || '') === growthDayKey;
            if (growthReady && !growthNotified) {
                const growthRows = this.getGrowthLeaderboardRows(statusUpdated, 5);
                if (growthRows.length) {
                    const sent = await this.sendTelegram(env, this.buildGrowthLeaderboardMessage(growthRows, growthDayKey), statusUpdated);
                    if (sent) {
                        statusUpdated = await this.saveConfig(env, { ...statusUpdated, growthLeaderboardNotifiedDayKey: growthDayKey }, { skipHistoryNormalization: true });
                        await this.appendRuntimeLog(env, 'info', 'growth.leaderboard.notify', '每日资源增长榜单通知已发送', { dayKey: growthDayKey, topCount: growthRows.length }, { config: statusUpdated }).catch(() => {});
                    }
                }
            }
            return statusUpdated;
        })().catch((e) => this.appendRuntimeLog(env, 'error', 'probe.scheduled.error', '定时探测失败', { error: e.message || String(e) })));
    },

  isTelegramEnabled(env, config = {}) {
        const configured = this.currentTelegramConfig(env, config);
        return configured.enabled && Boolean(configured.botToken) && Boolean(configured.chatId);
    },
  
    getTelegramConfig(env, config) {
        const current = this.currentTelegramConfig(env, config);
        return { enabled: current.enabled, botToken: current.botToken, chatId: current.chatId };
    },
    currentTelegramConfig(env, config) {
        const stored = config && config.telegram ? config.telegram : {};
        return {
            enabled: stored.enabled !== undefined ? Boolean(stored.enabled) : ['1', 'true', 'yes', 'on'].includes(String(env.TG_NOTIFY || '').toLowerCase()),
            botToken: stored.botToken || env.TG_BOT_TOKEN || '',
            chatId: stored.chatId || env.TG_CHAT_ID || ''
        };
    },
  
    async sendTelegram(env, text, config = {}) {
        const tg = this.currentTelegramConfig(env, config);
        if (!tg.enabled || !tg.botToken || !tg.chatId) {
            console.log('[notify] telegram disabled or incomplete config', { enabled: tg.enabled, hasBotToken: Boolean(tg.botToken), hasChatId: Boolean(tg.chatId) });
            return false;
        }
        const endpoint = 'https://api.telegram.org/bot' + tg.botToken + '/sendMessage';
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: tg.chatId, text, disable_web_page_preview: true })
            });
            if (!response.ok) {
                const detail = await response.text().catch(() => '');
                console.log('[notify] telegram send failed', { status: response.status, detail: detail.slice(0, 300) });
            }
            return response.ok;
        } catch(e) {
            console.log('[notify] telegram send error', e && e.message ? e.message : String(e));
        }
        return false;
    },
  
    async testTelegram(env, config = {}) {
        const tg = this.currentTelegramConfig(env, config);
        if (!tg.enabled || !tg.botToken || !tg.chatId) {
            return { ok: false, error: 'Telegram 配置未启用或不完整' };
        }
        const endpoint = 'https://api.telegram.org/bot' + tg.botToken + '/sendMessage';
        const text = [
            'Emby 探针测试通知',
            '',
            '这是一条手动发送的 Telegram 测试消息。',
            '发送时间：' + this.formatNotifyTime(Date.now())
        ].join('\n');
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: tg.chatId, text, disable_web_page_preview: true })
            });
            const detail = await response.text().catch(() => '');
            if (!response.ok) {
                console.log('[notify] telegram test failed', { status: response.status, detail: detail.slice(0, 300) });
                return { ok: false, status: response.status, error: detail.slice(0, 300) || 'Telegram API 返回失败' };
            }
            return { ok: true, status: response.status };
        } catch(e) {
            const message = e && e.message ? e.message : String(e);
            console.log('[notify] telegram test error', message);
            return { ok: false, error: message || 'Telegram 测试发送失败' };
        }
    },
  
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
  
    formatTelegramDisplayName(chat, fallbackId = '') {
        if (!chat || typeof chat !== 'object') return String(fallbackId || 'Telegram');
        const title = String(chat.title || '').trim();
        if (title) return title;
        const firstName = String(chat.first_name || '').trim();
        const lastName = String(chat.last_name || '').trim();
        const combined = [firstName, lastName].filter(Boolean).join(' ').trim();
        if (combined) return combined;
        const username = String(chat.username || '').trim();
        if (username) return username.replace(/^@+/, '');
        return String(fallbackId || 'Telegram');
    },
  
    async readTelegramChatProfile(env, config = {}) {
        const tg = this.currentTelegramConfig(env, config);
        if (!tg.enabled || !tg.botToken || !tg.chatId) return null;
        const cacheKey = 'telegram_public_profile:' + String(tg.chatId);
        if (env.EMBY_DB) {
            const cached = await env.EMBY_DB.get(cacheKey);
            if (cached) {
                try {
                    const data = JSON.parse(cached);
                    if (data && typeof data === 'object' && data.name) return data;
                } catch(e) {}
            }
        }
        try {
            const apiBase = 'https://api.telegram.org/bot' + tg.botToken;
            const chatRes = await fetch(apiBase + '/getChat?chat_id=' + encodeURIComponent(tg.chatId));
            const chatJson = await chatRes.json().catch(() => ({}));
            if (!chatRes.ok || !chatJson.ok || !chatJson.result) return null;
            const chat = chatJson.result;
            const profile = {
                chatId: String(tg.chatId),
                name: this.formatTelegramDisplayName(chat, tg.chatId),
                username: chat.username ? String(chat.username).replace(/^@+/, '') : '',
                avatarDataUrl: ''
            };
            const photo = chat.photo && (chat.photo.small_file_id || chat.photo.big_file_id) ? chat.photo : null;
            if (photo) {
                const fileId = photo.small_file_id || photo.big_file_id;
                const fileRes = await fetch(apiBase + '/getFile?file_id=' + encodeURIComponent(fileId));
                const fileJson = await fileRes.json().catch(() => ({}));
                if (fileRes.ok && fileJson.ok && fileJson.result && fileJson.result.file_path) {
                    const avatarRes = await fetch('https://api.telegram.org/file/bot' + tg.botToken + '/' + fileJson.result.file_path);
                    if (avatarRes.ok) {
                        const contentType = avatarRes.headers.get('Content-Type') || 'image/jpeg';
                        const avatarBytes = new Uint8Array(await avatarRes.arrayBuffer());
                        const base64 = this.bytesToBase64(avatarBytes);
                        if (base64) profile.avatarDataUrl = 'data:' + contentType + ';base64,' + base64;
                    }
                }
            }
            if (env.EMBY_DB) {
                await env.EMBY_DB.put(cacheKey, JSON.stringify(profile), { expirationTtl: 24 * 60 * 60 });
            }
            return profile;
        } catch(e) {
            console.log('[public-share] telegram profile lookup failed', e && e.message ? e.message : String(e));
        }
        return null;
    },
  
    formatNotifyTime(time) {
        if (!time) return '未知';
        return new Date(time).toLocaleString('zh-CN', {
            timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
    },
  
    formatNotifyDuration(startTime, endTime = Date.now()) {
        if (!startTime) return '未知';
        const minutes = Math.max(1, Math.floor((endTime - startTime) / 60000));
        if (minutes < 60) return minutes + ' 分钟';
        const hours = Math.floor(minutes / 60);
        const rest = minutes % 60;
        return hours + ' 小时' + (rest ? ' ' + rest + ' 分钟' : '');
    },
  
    formatNotifyLatency(latency) {
        const value = Number(latency);
        return Number.isFinite(value) && value > 0 ? Math.round(value) + 'ms' : '未知';
    },
  
    formatNotifyUptime(uptime) {
        return uptime === '---' ? '样本不足' : uptime + '%';
    },
    maskNotifyUrl(value) {
        try {
            const url = new URL(value);
            const labels = url.hostname.split('.').filter(Boolean);
            const visible = labels[0] || url.hostname.slice(0, 6);
            return url.protocol + '//' + visible + '.****.****';
        } catch(e) {
            const text = String(value || '');
            if (!text) return '未知';
            return text.slice(0, Math.min(12, text.length)) + '****';
        }
    },
  
    getRecentHistoryStats(server, windowMs = 24 * 60 * 60 * 1000) {
        const since = Date.now() - windowMs;
        const history = Array.isArray(server.history) ? server.history.filter((item) => item && typeof item === 'object' && item.time && item.time >= since) : [];
        const stats = history.reduce((acc, item) => {
            const isOnline = item.status === 'online';
            const latency = Number(item.latency);
            if (isOnline) {
                acc.online += 1;
                if (Number.isFinite(latency) && latency > 0) { acc.latencyTotal += latency; acc.latencyCount += 1; }
            } else { acc.offline += 1; }
            return acc;
        }, { online: 0, offline: 0, latencyTotal: 0, latencyCount: 0 });
        stats.offlineEvents = history.reduce((count, item, index) => {
            if (item.status !== 'offline') return count;
            const previous = history[index - 1];
            return !previous || previous.status !== 'offline' ? count + 1 : count;
        }, 0);
        stats.total = stats.online + stats.offline;
        stats.uptime = stats.total ? ((stats.online / stats.total) * 100).toFixed(1) : '---';
        stats.avgLatency = stats.latencyCount ? Math.round(stats.latencyTotal / stats.latencyCount) : 0;
        return stats;
    },
  
    formatAddressProbeResults(results) {
        const items = Array.isArray(results) ? results : [];
        if (!items.length) return ['地址1 未知 ❌'];
        return items.map((item, index) => {
            const latency = item.ok && item.latency ? ' ' + Math.round(item.latency) + 'ms' : '';
            return '地址' + (index + 1) + '：' + this.maskNotifyUrl(item.url) + ' ' + (item.ok ? '✅' : '❌') + latency;
        });
    },
  
    hasNotifyFallbackUrls(server) {
        return Array.isArray(server && server.fallbackUrls) && server.fallbackUrls.some((url) => String(url || '').trim());
    },
  
    buildStatusMessage(server, previousStatus, nextStatus) {
        const historyStats = this.getRecentHistoryStats(server);
        const offlineDuration = this.formatNotifyDuration(server.offlineSince, server.lastCheck || Date.now());
        const checkedAt = this.formatNotifyTime(server.lastCheck);
        const maskedUrl = this.maskNotifyUrl(server.url);
        const addressProbeLines = this.hasNotifyFallbackUrls(server) ? this.formatAddressProbeResults(server.addressProbeResults) : [];
  
        if (nextStatus === 'online') {
            return ['🟢 Emby 服务器已恢复', '', '服务器：' + server.name, '地址：' + maskedUrl, '状态：离线 -> 在线', '离线时长：' + offlineDuration, '恢复时间：' + checkedAt].join('\n');
        }
        return [
            '🔴 ' + server.name + ' 离线', '', '服务器：' + server.name, '地址：' + maskedUrl, ...addressProbeLines, '状态：离线', '离线时长：已持续 ' + offlineDuration, '离线时间：' + this.formatNotifyTime(server.offlineSince), '',
            '近24小时：离线 ' + historyStats.offlineEvents + ' 次', '近期可用率：' + this.formatNotifyUptime(historyStats.uptime)
        ].join('\n');
    },
    updateOfflineNotifyState(server, previousStatus, checkedAt) {
        if (server.status === 'offline') {
            const previousOfflineSince = Number.isFinite(Number(server.offlineSince)) ? Number(server.offlineSince) : 0;
            const previousAlertSentAt = Number.isFinite(Number(server.offlineAlertSentAt)) ? Number(server.offlineAlertSentAt) : 0;
            const shouldPreserveOfflineState = previousStatus === 'offline' || (previousStatus !== 'online' && previousOfflineSince > 0);
            const firstFailureAt = Number.isFinite(Number(server.firstFailureAt)) ? Math.max(0, Number(server.firstFailureAt)) : 0;
            server.offlineSince = shouldPreserveOfflineState && previousOfflineSince > 0 ? previousOfflineSince : (firstFailureAt || checkedAt);
            server.offlineAlertSentAt = shouldPreserveOfflineState ? Math.max(0, previousAlertSentAt) : 0;
            return server;
        }
        if (server.status === 'online') { server.offlineSince = 0; server.offlineAlertSentAt = 0; }
        return server;
    },
  
    shouldSendOfflineAlert(server) {
        if (server.status !== 'offline') return false;
        if (!server.offlineSince || server.offlineAlertSentAt) return false;
        return server.lastCheck - server.offlineSince >= this.OFFLINE_NOTIFY_DELAY_MS;
    },

  getPublicShareBaseUrl(env) {
        const raw = String(env.PUBLIC_SHARE_BASE_URL || '').trim();
        if (!raw) return '';
        try {
            const parsed = new URL(raw);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
            parsed.pathname = parsed.pathname.replace(/\/+$/, '');
            parsed.search = '';
            parsed.hash = '';
            return parsed.toString().replace(/\/$/, '');
        } catch(e) {
            return '';
        }
    },
  
    getPublicShareWildcardDomain(env) {
        const raw = String(env.PUBLIC_SHARE_WILDCARD_DOMAIN || '').trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^\*\./, '').replace(/\.+$/, '').toLowerCase();
        if (!raw) return '';
        if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(raw)) return '';
        return raw;
    },
  
    shouldBlockPublicShareAccess(request) {
        const country = String(request.headers.get('CF-IPCountry') || '').trim().toUpperCase();
        return country === 'CN';
    },
  
    getHostnameFromBaseUrl(value) {
        try { return new URL(value).hostname.toLowerCase(); } catch(e) { return ''; }
    },
  
    isPublicShareHost(request, env) {
        const host = String(request.headers.get('Host') || '').split(':')[0].toLowerCase();
        if (!host) return false;
        const wildcardDomain = this.getPublicShareWildcardDomain(env);
        if (wildcardDomain && host.endsWith('.' + wildcardDomain)) return true;
        const baseHost = this.getHostnameFromBaseUrl(this.getPublicShareBaseUrl(env));
        return Boolean(baseHost && host === baseHost);
    },
  
    isAllowedPublicSharePath(pathname) {
        return pathname === '/public' || /^\/public\/[a-f0-9]{24}$/i.test(pathname) || /^\/card\/[a-f0-9]{24}\.svg$/i.test(pathname) || pathname === '/proxy-img' || pathname === '/app-icon.svg';
    },
  
    generatePublicShareToken() {
        const bytes = new Uint8Array(12);
        if (globalThis.crypto && globalThis.crypto.getRandomValues) {
            globalThis.crypto.getRandomValues(bytes);
        } else {
            for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
        }
        return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    },
  
    async storePublicShareToken(env, token, expiresAt, data = {}) {
        if (!env.EMBY_DB) return false;
        const now = Date.now();
        const record = {
            token: String(token || ''),
            createdAt: Number(data.createdAt) || now,
            expiresAt: Number(expiresAt) || 0,
            origin: String(data.origin || ''),
            views: Number(data.views) || 0,
            lastViewedAt: Number(data.lastViewedAt) || 0,
            telegramProfile: data.telegramProfile && typeof data.telegramProfile === 'object' ? data.telegramProfile : null,
            hideCounts: Boolean(data.hideCounts)
        };
        await env.EMBY_DB.put('public_share_token:' + token, JSON.stringify(record));
        return true;
    },
  
    async deletePublicShareToken(env, token) {
        if (!env.EMBY_DB || !token) return false;
        await env.EMBY_DB.delete('public_share_token:' + token);
        return true;
    },
  
    async getPublicShareToken(env, token) {
        if (!env.EMBY_DB) return null;
        const raw = await env.EMBY_DB.get('public_share_token:' + token);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch(e) {
            return null;
        }
    },
  
    async hashPublicShareVisitor(value) {
        const text = String(value || '').trim();
        if (!text) return '';
        if (!globalThis.crypto || !globalThis.crypto.subtle) return text.replace(/[^a-zA-Z0-9_.:-]/g, '').slice(0, 120);
        const input = new TextEncoder().encode(text);
        const digest = await globalThis.crypto.subtle.digest('SHA-256', input);
        return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
    },
  
    getPublicShareVisitorId(request) {
        const cfIp = request.headers.get('CF-Connecting-IP');
        if (cfIp) return cfIp.trim();
        const forwarded = request.headers.get('X-Forwarded-For');
        if (forwarded) return forwarded.split(',')[0].trim();
        const realIp = request.headers.get('X-Real-IP');
        if (realIp) return realIp.trim();
        return '';
    },
  
    async recordPublicShareView(env, token, tokenRecord, request) {
        if (!env.EMBY_DB || !token) return tokenRecord;
        const now = Date.now();
        const visitorId = this.getPublicShareVisitorId(request);
        const visitorHash = await this.hashPublicShareVisitor(visitorId || 'unknown');
        const visitorKey = 'public_share_visitor:' + token + ':' + visitorHash;
        const seen = await env.EMBY_DB.get(visitorKey);
        const nextRecord = { ...(tokenRecord || {}), token: String(token), lastViewedAt: now };
        if (!seen) {
            nextRecord.views = (Number(nextRecord.views) || 0) + 1;
            await env.EMBY_DB.put(visitorKey, JSON.stringify({ firstViewedAt: now }), { expirationTtl: 90 * 24 * 60 * 60 });
        }
        await env.EMBY_DB.put('public_share_token:' + token, JSON.stringify(nextRecord));
        return nextRecord;
    },
  
    async listPublicShareStats(env, origin = '') {
        if (!env.EMBY_DB || !env.EMBY_DB.list) return [];
        const keys = [];
        let cursor = undefined;
        do {
            const listed = await env.EMBY_DB.list({ prefix: 'public_share_token:', cursor });
            if (listed && Array.isArray(listed.keys)) keys.push(...listed.keys);
            cursor = listed && listed.list_complete === false ? listed.cursor : undefined;
        } while (cursor);
        const items = [];
        for (const key of keys) {
            const name = key && key.name ? key.name : '';
            const raw = name ? await env.EMBY_DB.get(name) : null;
            if (!raw) continue;
            try {
                const data = JSON.parse(raw);
                const token = String(data.token || name.replace('public_share_token:', ''));
                items.push({
                    token,
                    url: (data.origin || origin || '').replace(/\/$/, '') + '/public/' + token,
                    createdAt: Number(data.createdAt) || 0,
                    expiresAt: Number(data.expiresAt) || 0,
                    views: Number(data.views) || 0,
                    lastViewedAt: Number(data.lastViewedAt) || 0,
                    hasTelegramProfile: Boolean(data.telegramProfile && data.telegramProfile.name),
                    hideCounts: Boolean(data.hideCounts)
                });
            } catch(e) {}
        }
        return items.sort((a, b) => (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));
    },
  
    async storeCardShareToken(env, token, data) {
        if (!env.EMBY_DB) return false;
        await env.EMBY_DB.put('card_share_token:' + token, JSON.stringify({ expiresAt: Number(data.expiresAt) || 0, serverId: String(data.serverId || '') }));
        return true;
    },
  
    async getCardShareToken(env, token) {
        if (!env.EMBY_DB) return null;
        const raw = await env.EMBY_DB.get('card_share_token:' + token);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch(e) {
            return null;
        }
    },
  
    escapeHtml(value) {
        return String(value === undefined || value === null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

  escapeXml(value) {
        return this.escapeSvgText(value);
    },
  
    escapeSvgText(value) {
        let output = '';
        for (const char of String(value === undefined || value === null ? '' : value)) {
            const code = char.codePointAt(0);
            if (!code || code === 0x0b || code === 0x0c || code < 0x20 || (code >= 0xd800 && code <= 0xdfff) || code > 0x10ffff) continue;
            if (char === '&') output += '&amp;';
            else if (char === '<') output += '&lt;';
            else if (char === '>') output += '&gt;';
            else if (char === '"') output += '&quot;';
            else if (char === "'") output += '&#39;';
            else if (code > 0x7e) output += '&#' + code + ';';
            else output += char;
        }
        return output;
    },
  
    publicIconSrc(icon) {
        if (!icon || typeof icon !== 'string') return '';
        if (icon.startsWith('data:image/')) return icon;
        const parsed = this.parsePublicHttpUrl(icon);
        return parsed ? '/proxy-img?url=' + encodeURIComponent(parsed.toString()) : '';
    },
  
    normalizeTextForPublicMatch(value) {
        try { return String(value || '').normalize('NFKC').toLowerCase(); } catch(e) { return String(value || '').toLowerCase(); }
    },
  
    getPublicDisplayIcon(server, icons = {}) {
        if (server.customIcon) return server.customIcon;
        if (!server.name || !icons || typeof icons !== 'object' || Array.isArray(icons)) return '';
        const name = this.normalizeTextForPublicMatch(server.name);
        for (const [key, value] of Object.entries(icons)) {
            if (name.includes(this.normalizeTextForPublicMatch(key))) return value;
        }
        return '';
    },
  
    buildPublicPage(config, pageState = {}) {
        const clean = this.sanitizeConfig(config);
        const ownerProfile = pageState && pageState.ownerProfile ? pageState.ownerProfile : null;
        const hideCounts = Boolean(pageState && pageState.hideCounts);
        const serverTotal = clean.servers.length;
        const onlineTotal = clean.servers.filter(server => server.status === 'online').length;
        const offlineTotal = clean.servers.filter(server => server.status === 'offline').length;
        const checkingTotal = Math.max(0, serverTotal - onlineTotal - offlineTotal);
        const maskCount = (value) => {
            const text = String(Math.max(0, Number(value) || 0));
            if (!hideCounts) return text;
            if (text.length <= 1) return text + '**';
            const keep = text.length >= 5 ? 2 : 1;
            return text.slice(0, keep) + '*'.repeat(Math.max(2, text.length - keep));
        };
        const cards = clean.servers.map((server) => {
            const media = server.mediaStats || {};
            const counts = media.counts || {};
            const icon = this.publicIconSrc(this.getPublicDisplayIcon(server, clean.icons));
            const statusClass = server.status === 'online' ? 'online' : server.status === 'offline' ? 'offline' : 'unknown';
            const statusText = server.status === 'online' ? '在线' : server.status === 'offline' ? '离线' : '检测中';
            const iconHtml = icon ? '<img src="' + this.escapeHtml(icon) + '" alt="" class="avatar-img">' : '<span>' + this.escapeHtml((server.name || '?').slice(0, 1)) + '</span>';
            return '<article class="public-card public-card-' + statusClass + '">' +
                '<div class="card-glow card-glow-' + statusClass + '"></div>' +
                '<div class="public-card-head">' +
                    '<div class="avatar">' + iconHtml + '</div>' +
                '<div class="server-title"><h2>' + this.escapeHtml(server.name) + '</h2><div class="status-pill status-' + statusClass + '"><i></i>' + statusText + '</div></div>' +
                '</div>' +
                '<div class="metric-grid">' +
                    '<div class="metric metric-movie"><span>电影</span><strong>' + this.escapeHtml(Number.isFinite(Number(counts.movie)) ? maskCount(counts.movie) : '--') + '</strong></div>' +
                    '<div class="metric metric-series"><span>剧集</span><strong>' + this.escapeHtml(Number.isFinite(Number(counts.series)) ? maskCount(counts.series) : '--') + '</strong></div>' +
                    '<div class="metric metric-episode"><span>总集数</span><strong>' + this.escapeHtml(Number.isFinite(Number(counts.episode)) ? maskCount(counts.episode) : '--') + '</strong></div>' +
                '</div>' +
            '</article>';
        }).join('');
        const ownerHtml = ownerProfile && ownerProfile.name ? (
            '<section class="owner-banner">' +
                '<div class="owner-avatar">' + (ownerProfile.avatarDataUrl ? '<img src="' + this.escapeHtml(ownerProfile.avatarDataUrl) + '" alt="">' : '<span>' + this.escapeHtml(String(ownerProfile.name).slice(0, 1)) + '</span>') + '</div>' +
                '<div class="owner-meta">' +
                    '<div class="owner-name">' + this.escapeHtml(ownerProfile.name) + '</div>' +
                '</div>' +
            '</section>'
        ) : '';
        return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#dce8fb"><title>Emby Status</title><style>' +
            'html{background:#dde8f8}body{background:#dde8f8;color:#334155;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;min-height:100vh}.bg-canvas{position:fixed;inset:0;z-index:0;background:linear-gradient(135deg,#e8eeff 0%,#dce8fb 30%,#ede4fb 60%,#e0effe 100%);overflow:hidden}.bg-canvas:after{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.04%27/%3E%3C/svg%3E");pointer-events:none;opacity:.6}.orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55}.orb-1{width:600px;height:600px;background:radial-gradient(circle,#a5c4fd,#c4b5fd);top:-15%;left:-10%}.orb-2{width:500px;height:500px;background:radial-gradient(circle,#fde68a,#fca5a5);top:40%;right:-8%}.orb-3{width:450px;height:450px;background:radial-gradient(circle,#6ee7f7,#a5f3cc);bottom:-10%;left:25%}.app-shell{position:relative;z-index:1;width:min(1180px,calc(100% - 32px));margin:0 auto;padding:42px 0 56px}.brand-title{font-size:clamp(28px,5vw,52px);line-height:1;margin:0;background:linear-gradient(100deg,#0f172a 0%,#0369a1 48%,#059669 100%);-webkit-background-clip:text;background-clip:text;color:transparent}.subtitle{margin:12px 0 30px;color:#64748b;font-weight:700}.public-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}.public-card{position:relative;overflow:hidden;border-radius:28px;padding:22px;background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(248,250,255,.48));backdrop-filter:blur(20px) saturate(170%);border:1px solid rgba(255,255,255,.82);box-shadow:0 12px 34px -26px rgba(15,23,42,.28),inset 0 1px 0 rgba(255,255,255,.88)}.public-card-online{border-color:rgba(16,185,129,.2)}.public-card-offline{border-color:rgba(244,63,94,.22)}.card-glow{position:absolute;right:-64px;top:-64px;width:180px;height:180px;border-radius:50%;filter:blur(50px);pointer-events:none}.card-glow-online{background:#10b98133}.card-glow-offline{background:#f43f5e38}.card-glow-unknown{background:#94a3b833}.public-card-head{display:flex;gap:14px;align-items:center;position:relative;z-index:1}.avatar{width:56px;height:56px;border-radius:18px;background:rgba(255,255,255,.8);border:1px solid #fff;box-shadow:0 1px 8px rgba(15,23,42,.08);display:flex;align-items:center;justify-content:center;overflow:hidden;color:#334155;font-size:24px;font-weight:900;flex-shrink:0}.avatar-img{width:100%;height:100%;object-fit:contain;padding:8px;box-sizing:border-box}.server-title{min-width:0;display:flex;flex-direction:column;gap:8px}.server-title h2{margin:0;color:#1e293b;font-size:18px;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.status-pill{width:max-content;display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.58);font-size:12px;font-weight:900;border:1px solid}.status-pill i{display:block;width:8px;height:8px;border-radius:50%}.status-online{color:#047857;border-color:#a7f3d0}.status-online i{background:#10b981}.status-offline{color:#be123c;border-color:#fecdd3}.status-offline i{background:#f43f5e}.status-unknown{color:#475569;border-color:#cbd5e1}.status-unknown i{background:#94a3b8}.metric-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:20px}.metric{border-radius:16px;background:rgba(255,255,255,.46);border:1px solid rgba(255,255,255,.72);padding:13px 8px;text-align:center}.metric span{display:block;color:#64748b;font-size:10px;font-weight:900;letter-spacing:.08em}.metric strong{display:block;margin-top:6px;color:#334155;font-size:20px;line-height:1;font-weight:900}.empty{padding:80px 20px;border-radius:28px;background:rgba(255,255,255,.58);border:1px solid rgba(255,255,255,.82);text-align:center;color:#64748b;font-weight:800}@media(max-width:640px){.app-shell{padding-top:30px}.public-grid{grid-template-columns:1fr}.brand-title{font-size:32px}}' +
            '.public-grid{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}.public-card{overflow:hidden}.public-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:-12px 0 18px}.summary-item{min-width:0;border-radius:18px;background:rgba(255,255,255,.56);border:1px solid rgba(255,255,255,.82);padding:12px 10px;text-align:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.88)}.summary-item span{display:block;color:#64748b;font-size:10px;font-weight:900}.summary-item strong{display:block;margin-top:4px;color:#1e293b;font-size:22px;line-height:1;font-weight:900}.summary-online strong{color:#047857}.summary-offline strong{color:#be123c}.summary-checking strong{color:#475569}.owner-banner{display:flex;align-items:center;gap:12px;margin:0 0 14px;padding:14px 16px;border-radius:22px;background:rgba(255,255,255,.62);border:1px solid rgba(255,255,255,.82);box-shadow:0 12px 34px -28px rgba(15,23,42,.2),inset 0 1px 0 rgba(255,255,255,.88)}.owner-avatar{width:42px;height:42px;border-radius:14px;flex-shrink:0;overflow:hidden;background:rgba(248,250,252,.95);border:1px solid rgba(226,232,240,.9);display:flex;align-items:center;justify-content:center;color:#475569;font-size:18px;font-weight:900}.owner-avatar img{width:100%;height:100%;object-fit:cover}.owner-meta{min-width:0;display:flex;flex-direction:column;gap:2px}.owner-name{font-size:13px;font-weight:900;color:#1e293b;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.metric-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.metric{min-width:0;overflow:visible;padding:12px 6px}.metric span{white-space:nowrap;overflow:visible !important;text-overflow:clip !important;font-size:10px}.metric strong{white-space:nowrap;overflow:visible !important;text-overflow:clip !important;letter-spacing:-0.02em}.metric-movie strong,.metric-series strong{font-size:20px}.metric-episode strong{font-size:15px;color:#64748b;font-weight:800}.public-footer{margin-top:28px;padding-top:14px;border-top:1px solid rgba(148,163,184,.22);text-align:center;color:#94a3b8;font-size:11px;font-weight:700;line-height:1.6}.public-footer a{color:inherit;text-decoration:none}.public-footer a:hover{color:#64748b}@media(max-width:640px){.public-grid{grid-template-columns:1fr}.public-summary{grid-template-columns:repeat(2,minmax(0,1fr))}}</style></head><body><div class="bg-canvas"><div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div></div><main class="app-shell"><h1 class="brand-title">Emby Status</h1><p class="subtitle">状态数据由各服务器公开接口提供</p>' +
            '<section class="public-summary"><div class="summary-item"><span>全部服务器</span><strong>' + serverTotal + '</strong></div><div class="summary-item summary-online"><span>在线</span><strong>' + onlineTotal + '</strong></div><div class="summary-item summary-offline"><span>掉线</span><strong>' + offlineTotal + '</strong></div><div class="summary-item summary-checking"><span>检测中</span><strong>' + checkingTotal + '</strong></div></section>' +
            ownerHtml +
            (cards ? '<section class="public-grid">' + cards + '</section>' : '<div class="empty">暂无服务器</div>') +
            '<footer class="public-footer"><div>项目地址：<a href="https://github.com/pototazhang/emby-js" target="_blank" rel="noopener noreferrer">github.com/pototazhang/emby-js</a></div></footer>' +
            '</main></body></html>';
    },
  
    buildServerCardSvg(server, config = {}) {
        const media = server.mediaStats || {};
        const counts = media.counts || {};
        const status = server.status === 'online' ? '在线' : server.status === 'offline' ? '离线' : '检测中';
        const statusColor = server.status === 'online' ? '#047857' : server.status === 'offline' ? '#be123c' : '#2563eb';
        const statusBg = server.status === 'online' ? '#d1fae5' : server.status === 'offline' ? '#ffe4e6' : '#dbeafe';
        const dotColor = server.status === 'online' ? '#10b981' : server.status === 'offline' ? '#f43f5e' : '#3b82f6';
        const movie = Number.isFinite(Number(counts.movie)) ? String(Number(counts.movie)) : '--';
        const series = Number.isFinite(Number(counts.series)) ? String(Number(counts.series)) : '--';
        const episode = Number.isFinite(Number(counts.episode)) ? String(Number(counts.episode)) : '--';
        const initial = String(server.name || '?').slice(0, 1);
        const name = this.escapeSvgText(server.name || 'Emby Server');
        const icon = this.publicIconSrc(this.getPublicDisplayIcon(server, config.icons || {}));
        const statusLabel = this.escapeSvgText(status);
        const statusTextWidth = Math.max(28, Math.round(Array.from(String(status)).reduce((total, char) => total + (char.codePointAt(0) > 0x7e ? 2 : 1), 0) * 7 + 14));
        const statusChipWidth = statusTextWidth + 28;
        const statusChipLeft = 214;
        const statusDotX = statusChipLeft + 15;
        const statusTextX = statusChipLeft + 28;
        const avatar = icon
            ? '<image x="139" y="129" width="48" height="48" href="' + this.escapeSvgText(icon) + '" preserveAspectRatio="xMidYMid meet"/>'
            : '<text x="163" y="165" text-anchor="middle" font-family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="32" font-weight="900" fill="#334155">' + this.escapeSvgText(initial) + '</text>';
        return '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="760" height="420" viewBox="0 0 760 420" preserveAspectRatio="xMidYMid meet" role="img">' +
            '<style>svg{background:#dde8f8;display:block;position:fixed;inset:0;margin:auto;max-width:calc(100vw - 20px);max-height:calc(100vh - 20px)} @media (max-width: 640px){svg{max-width:calc(100vw - 10px);max-height:calc(100vh - 10px)}}</style>' +
            '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e8eeff"/><stop offset=".55" stop-color="#ede4fb"/><stop offset="1" stop-color="#e0effe"/></linearGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#0f172a" flood-opacity=".18"/></filter><clipPath id="outer"><rect x="28" y="24" width="704" height="372" rx="40"/></clipPath></defs>' +
            '<g clip-path="url(#outer)">' +
            '<rect x="28" y="24" width="704" height="372" rx="40" fill="url(#bg)"/>' +
            '<circle cx="664" cy="86" r="140" fill="' + (server.status === 'online' ? '#10b981' : server.status === 'offline' ? '#f43f5e' : '#3b82f6') + '" opacity=".18"/>' +
            '<circle cx="106" cy="324" r="126" fill="#60a5fa" opacity=".12"/>' +
            '<g filter="url(#shadow)"><rect x="78" y="78" width="604" height="244" rx="30" fill="#ffffff" fill-opacity=".82" stroke="#ffffff" stroke-opacity=".95"/>' +
            '<rect x="126" y="116" width="74" height="74" rx="23" fill="#ffffff" fill-opacity=".92" stroke="#ffffff"/>' +
            avatar +
            '<text x="214" y="145" font-family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="27" font-weight="900" fill="#1e293b">' + name + '</text>' +
            '<rect x="' + statusChipLeft + '" y="167" width="' + statusChipWidth + '" height="26" rx="13" fill="' + statusBg + '" stroke="#ffffff" stroke-opacity=".85"/><circle cx="' + statusDotX + '" cy="180" r="3" fill="' + dotColor + '"/><text x="' + statusTextX + '" y="185" font-family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="11" font-weight="900" fill="' + statusColor + '">' + statusLabel + '</text>' +
            '<g transform="translate(110 218)"><rect width="164" height="72" rx="16" fill="#ffffff" fill-opacity=".58" stroke="#ffffff" stroke-opacity=".9"/><text x="82" y="27" text-anchor="middle" font-size="12" font-weight="900" fill="#64748b" font-family="system-ui">' + this.escapeSvgText('电影') + '</text><text x="82" y="54" text-anchor="middle" font-size="24" font-weight="900" fill="#334155" font-family="system-ui">' + this.escapeSvgText(movie) + '</text></g>' +
            '<g transform="translate(298 218)"><rect width="164" height="72" rx="16" fill="#ffffff" fill-opacity=".58" stroke="#ffffff" stroke-opacity=".9"/><text x="82" y="27" text-anchor="middle" font-size="12" font-weight="900" fill="#64748b" font-family="system-ui">' + this.escapeSvgText('剧集') + '</text><text x="82" y="54" text-anchor="middle" font-size="24" font-weight="900" fill="#334155" font-family="system-ui">' + this.escapeSvgText(series) + '</text></g>' +
            '<g transform="translate(486 218)"><rect width="164" height="72" rx="16" fill="#ffffff" fill-opacity=".58" stroke="#ffffff" stroke-opacity=".9"/><text x="82" y="27" text-anchor="middle" font-size="12" font-weight="900" fill="#64748b" font-family="system-ui">' + this.escapeSvgText('总集数') + '</text><text x="82" y="54" text-anchor="middle" font-size="19" font-weight="800" fill="#64748b" font-family="system-ui">' + this.escapeSvgText(episode) + '</text></g>' +
            '</g><text x="110" y="314" font-family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="11" font-weight="700" fill="#64748b">' + this.escapeSvgText('Emby Status · 状态数据由各服务器公开接口提供') + '</text>' +
            '<a href="https://github.com/pototazhang/emby-js" target="_blank" rel="noopener noreferrer"><text x="650" y="314" text-anchor="end" font-family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="9" font-weight="700" fill="#94a3b8">' + this.escapeSvgText('项目地址') + '</text></a>' +
            '</g></svg>';
    },

  json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }); },
  
    requireAdmin(request, env) {
        const token = String(env.ADMIN_TOKEN || '').trim();
        if (!token) return this.json({ error: 'ADMIN_TOKEN_REQUIRED', message: 'ADMIN_TOKEN must be configured' }, 403);
        const expected = 'Bearer ' + token;
        if (request.headers.get('Authorization') === expected) return null;
        return this.json({ error: 'Unauthorized' }, 401);
    },
  
    requireStrictAdmin(request, env) {
        return this.requireAdmin(request, env);
    },

  getUpdateRepo(env) {
        return {
            owner: env.UPDATE_REPO_OWNER || this.UPDATE_REPO_OWNER,
            repo: env.UPDATE_REPO_NAME || this.UPDATE_REPO_NAME,
            branch: env.UPDATE_BRANCH || this.UPDATE_BRANCH,
            file: env.UPDATE_FILE || this.UPDATE_FILE
        };
    },
  
    getUpdateRawUrl(env) {
        const repo = this.getUpdateRepo(env);
        return 'https://raw.githubusercontent.com/' + encodeURIComponent(repo.owner) + '/' + encodeURIComponent(repo.repo) + '/' + encodeURIComponent(repo.branch) + '/' + repo.file.split('/').map(encodeURIComponent).join('/');
    },
  
    normalizeRuntimeUpdateMode(mode) {
        return mode === 'docker' ? 'docker' : 'worker';
    },
  
    getRuntimeUpdateMode(env) {
        return this.normalizeRuntimeUpdateMode(this.isDockerRuntime(env) ? 'docker' : 'worker');
    },
  
    getRuntimeVersionMap() {
        const versions = this.APP_RUNTIME_VERSIONS;
        const fallback = this.APP_VERSION || '';
        if (!versions || typeof versions !== 'object') return { worker: fallback, docker: fallback };
        const worker = String(versions.worker || fallback).trim();
        const docker = String(versions.docker || fallback).trim();
        return {
            worker: worker || fallback,
            docker: docker || fallback
        };
    },
  
    getCurrentRuntimeVersion(env, mode) {
        const runtimeMode = this.normalizeRuntimeUpdateMode(mode || this.getRuntimeUpdateMode(env));
        const versions = this.getRuntimeVersionMap();
        return runtimeMode === 'docker' ? versions.docker : versions.worker;
    },
  
    getMissingUpdateEnv(env) {
        const missing = [];
        if (!['1', 'true', 'yes', 'on'].includes(String(env.UPDATE_ENABLED || '').toLowerCase())) missing.push('UPDATE_ENABLED');
        if (!env.CF_ACCOUNT_ID) missing.push('CF_ACCOUNT_ID');
        if (!env.CF_WORKER_NAME) missing.push('CF_WORKER_NAME');
        if (!env.CF_API_TOKEN) missing.push('CF_API_TOKEN');
        return missing;
    },
  
    canSelfUpdate(env) { return this.getMissingUpdateEnv(env).length === 0; },
  
    isDockerRuntime(env) {
        return Boolean(env && env.DOCKER_SELF_UPDATER && typeof env.DOCKER_SELF_UPDATER.getCapability === 'function');
    },
  
    async getRuntimeUpdateCapability(env) {
        if (this.isDockerRuntime(env)) {
            const capability = await env.DOCKER_SELF_UPDATER.getCapability();
            return {
                mode: 'docker',
                targetLabel: 'Docker 容器',
                canUpdate: Boolean(capability && capability.canUpdate),
                missing: Array.isArray(capability && capability.missing) ? capability.missing : [],
                busy: Boolean(capability && capability.busy),
                image: capability && capability.image ? String(capability.image) : ''
            };
        }
        return {
            mode: 'worker',
            targetLabel: 'Cloudflare Worker',
            canUpdate: this.canSelfUpdate(env),
            missing: this.getMissingUpdateEnv(env),
            busy: false,
            image: ''
        };
    },
  
    UPDATE_CHECK_KV_KEY: 'last_update_check',
    UPDATE_CHECK_INTERVAL_MS: 12 * 60 * 60 * 1000,
  
    parseUpdateCheckTimestamp(value) {
        const timestamp = Number(value);
        return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : 0;
    },
  
    async maybeRunScheduledSelfUpdate(env) {
        if (!env || !env.EMBY_DB || !this.canSelfUpdate(env)) return { skipped: true, reason: 'disabled' };
  
        const checkedAt = Date.now();
        const currentVersion = this.getCurrentRuntimeVersion(env, 'worker');
        let lastCheckedAt = 0;
        try {
            lastCheckedAt = this.parseUpdateCheckTimestamp(await env.EMBY_DB.get(this.UPDATE_CHECK_KV_KEY));
        } catch (e) {
            console.log('[updater] last_update_check read failed:', e && e.message ? e.message : String(e));
            return { skipped: true, reason: 'kv-read-failed' };
        }
  
        if (lastCheckedAt && checkedAt - lastCheckedAt < this.UPDATE_CHECK_INTERVAL_MS) {
            return { skipped: true, reason: 'throttled', lastCheckedAt, nextCheckAt: lastCheckedAt + this.UPDATE_CHECK_INTERVAL_MS };
        }
  
        try {
            const latestSource = await this.fetchLatestWorkerSource(env);
            const latestVersion = this.extractRuntimeVersion(latestSource, 'worker') || 'unknown';
            const updated = latestVersion !== 'unknown' && latestVersion !== currentVersion;
            if (updated) await this.deployWorkerSource(env, latestSource);
            try {
                const logConfig = await this.loadConfig(env);
                await this.appendRuntimeLog(env, 'info', updated ? 'update.auto.deploy.done' : 'update.auto.check.done', updated ? '定时自动更新部署完成' : '定时自动更新检查完成', {
                    currentVersion,
                    latestVersion,
                    updated
                }, { config: logConfig });
            } catch (logError) {}
            return { skipped: false, checkedAt, latestVersion, updated };
        } catch (e) {
            const message = e && e.message ? e.message : String(e || 'Auto update failed');
            console.log('[updater] scheduled self update failed:', message);
            try {
                const logConfig = await this.loadConfig(env);
                await this.appendRuntimeLog(env, 'error', 'update.auto.error', '定时自动更新失败', { error: message }, { config: logConfig });
            } catch (logError) {}
            return { skipped: false, checkedAt, error: message };
        } finally {
            try {
                await env.EMBY_DB.put(this.UPDATE_CHECK_KV_KEY, String(checkedAt));
            } catch (e) {
                console.log('[updater] last_update_check write failed:', e && e.message ? e.message : String(e));
            }
        }
    },
  
    async fetchLatestWorkerSource(env) {
        const sourceUrl = this.getUpdateRawUrl(env) + '?t=' + Date.now();
        const response = await fetch(sourceUrl, {
            headers: {
                'Accept': 'text/plain',
                'Cache-Control': 'no-cache, no-store, max-age=0',
                'Pragma': 'no-cache',
                'User-Agent': 'Emby-Cluster-Monitor-Updater/' + this.APP_VERSION
            }
        });
        if (!response.ok) throw new Error('GitHub source fetch failed HTTP ' + response.status);
        const source = await response.text();
        if (!this.isSafeWorkerSource(source)) throw new Error('Latest source validation failed');
        return source;
    },
  
    extractAppVersion(source) {
        const text = String(source || '');
        const exportMatch = text.match(/export\s+default\s*\{[\s\S]*?APP_VERSION:\s*['"]([^'"]+)['"]/);
        if (exportMatch) return exportMatch[1];
        const match = text.match(/APP_VERSION:\s*['"]([^'"]+)['"]/);
        return match ? match[1] : '';
    },
  
    extractRuntimeVersion(source, mode) {
        const runtimeMode = this.normalizeRuntimeUpdateMode(mode);
        const text = String(source || '');
        const blockMatch = text.match(/APP_RUNTIME_VERSIONS:\s*\{([\s\S]*?)\}\s*,/);
        if (blockMatch) {
            const runtimeMatch = blockMatch[1].match(new RegExp(runtimeMode + "\\s*:\\s*['\"]([^'\"]+)['\"]"));
            if (runtimeMatch && runtimeMatch[1]) return runtimeMatch[1];
        }
        return this.extractAppVersion(text);
    },
  
    extractUpdateNotes(source) {
        const match = String(source || '').match(/APP_UPDATE_NOTES:\s*\[([\s\S]*?)\]\s*,/);
        if (!match) return [];
        const notes = [];
        const itemPattern = /['"]([^'"]+)['"]/g;
        let item;
        while ((item = itemPattern.exec(match[1])) && notes.length < 8) {
            if (item[1]) notes.push(item[1]);
        }
        return notes;
    },
  
    isSafeWorkerSource(source) {
        const text = String(source || '');
        return text.length > 10000 && text.length < 5 * 1024 * 1024 && text.includes('Emby 集群探针') && text.includes('export default') && text.includes('HTML_CONTENT') && Boolean(this.extractAppVersion(text));
    },
  
    async deployWorkerSource(env, source) {
        const form = new FormData();
        form.append('metadata', JSON.stringify({ main_module: 'emby.js' }));
        form.append('emby.js', new Blob([source], { type: 'application/javascript+module' }), 'emby.js');
  
        const endpoint = 'https://api.cloudflare.com/client/v4/accounts/' + encodeURIComponent(env.CF_ACCOUNT_ID) + '/workers/scripts/' + encodeURIComponent(env.CF_WORKER_NAME) + '/content';
        const response = await fetch(endpoint, { method: 'PUT', headers: { 'Authorization': 'Bearer ' + env.CF_API_TOKEN }, body: form });
        const detail = await response.text();
        if (!response.ok) throw new Error('Cloudflare deploy failed HTTP ' + response.status + (detail ? ': ' + detail.slice(0, 300) : ''));
        try {
            const parsed = JSON.parse(detail);
            if (parsed && parsed.success === false) throw new Error('Cloudflare deploy rejected: ' + JSON.stringify(parsed.errors || parsed.messages || parsed).slice(0, 300));
        } catch(e) { if (e.message && e.message.startsWith('Cloudflare deploy rejected')) throw e; }
        return detail;
    },

  emptyConfig() {
        return { servers: [], icons: {}, updatedAt: 0, nextScheduledCursor: 0, lastPlayedQueueDayKey: '', lastPlayedQueue: [], growthLeaderboardNotifiedDayKey: '' };
    },
  
    async loadConfig(env, options = {}) {
        const raw = await env.EMBY_DB.get('config');
        if (!raw) return options.raw ? this.emptyConfig() : this.withRevision(this.emptyConfig(), options);
        try {
            const parsed = JSON.parse(raw);
            return options.raw ? (parsed && typeof parsed === 'object' ? parsed : this.emptyConfig()) : this.withRevision(parsed, options);
        } catch(e) {
            return options.raw ? this.emptyConfig() : this.withRevision(this.emptyConfig(), options);
        }
    },
  
    async saveConfig(env, config, options = {}) {
        if (options.raw) {
            const rawConfig = config && typeof config === 'object' ? config : this.emptyConfig();
            await env.EMBY_DB.put('config', JSON.stringify(rawConfig));
            return rawConfig;
        }
        let currentConfig = null;
        const nextScheduledCursor = Number.isFinite(Number(config && config.nextScheduledCursor))
            ? Math.max(0, Number(config.nextScheduledCursor))
            : null;
        if (nextScheduledCursor === null) currentConfig = await this.loadConfig(env, options);
        const resolvedNextScheduledCursor = nextScheduledCursor === null
            ? (Number.isFinite(Number(currentConfig && currentConfig.nextScheduledCursor)) ? Math.max(0, Number(currentConfig.nextScheduledCursor)) : 0)
            : nextScheduledCursor;
        const cleanConfig = this.withRevision({ ...(currentConfig || this.emptyConfig()), ...(config || {}), nextScheduledCursor: resolvedNextScheduledCursor }, options);
        await env.EMBY_DB.put('config', JSON.stringify(this.sanitizeConfig(cleanConfig, options)));
        return cleanConfig;
    },
  
    withRevision(config, options = {}) {
        const clean = this.sanitizeConfig(config, options);
        if (options.skipRevision) return clean;
        clean.revision = this.configRevision(clean);
        return clean;
    },
  
    configRevision(config) {
        const clean = this.sanitizeConfig(config, { skipHistoryNormalization: true });
        const settingsOnly = {
            icons: clean.icons, telegram: clean.telegram, logging: clean.logging,
            servers: clean.servers.map((server) => ({ id: server.id, name: server.name, url: server.url, fallbackUrls: server.fallbackUrls, customIcon: server.customIcon, mediaStats: { enabled: Boolean(server.mediaStats && server.mediaStats.enabled), username: server.mediaStats ? server.mediaStats.username : '', password: server.mediaStats ? server.mediaStats.password : '', keepAlive: server.mediaStats ? { enabled: Boolean(server.mediaStats.keepAlive && server.mediaStats.keepAlive.enabled), periodDays: server.mediaStats.keepAlive ? server.mediaStats.keepAlive.periodDays : 30, alertDays: server.mediaStats.keepAlive ? server.mediaStats.keepAlive.alertDays : 27 } : { enabled: false, periodDays: 30, alertDays: 27 } } }))
        };
        const text = JSON.stringify(settingsOnly);
        let hash = 2166136261;
        for (let i = 0; i < text.length; i += 1) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); }
        return (hash >>> 0).toString(36);
    },
  
    sanitizeConfig(config, options = {}) {
        const skipHistoryNormalization = Boolean(options.skipHistoryNormalization);
        const clean = { servers: [], icons: {}, telegram: { enabled: false, botToken: '', chatId: '' }, logging: { enabled: false }, updatedAt: 0, nextScheduledCursor: 0, lastPlayedDailyKey: '', lastPlayedCursor: 0, lastPlayedQueueDayKey: '', lastPlayedQueue: [], growthLeaderboardNotifiedDayKey: '' };
        if (config && Number.isFinite(Number(config.updatedAt))) clean.updatedAt = Math.max(0, Number(config.updatedAt));
        if (config && Number.isFinite(Number(config.nextScheduledCursor))) clean.nextScheduledCursor = Math.max(0, Number(config.nextScheduledCursor));
        if (config && typeof config.lastPlayedDailyKey === 'string') clean.lastPlayedDailyKey = config.lastPlayedDailyKey.slice(0, 16);
        if (config && Number.isFinite(Number(config.lastPlayedCursor))) clean.lastPlayedCursor = Math.max(0, Number(config.lastPlayedCursor));
        if (config && typeof config.lastPlayedQueueDayKey === 'string') clean.lastPlayedQueueDayKey = config.lastPlayedQueueDayKey.slice(0, 16);
        if (config && Array.isArray(config.lastPlayedQueue)) {
            clean.lastPlayedQueue = config.lastPlayedQueue
                .map((value) => String(value || '').slice(0, 120))
                .filter(Boolean)
                .slice(0, 512);
        }
        if (config && typeof config.growthLeaderboardNotifiedDayKey === 'string') {
            clean.growthLeaderboardNotifiedDayKey = config.growthLeaderboardNotifiedDayKey.slice(0, 16);
        }
        if (config && config.telegram && typeof config.telegram === 'object') {
            clean.telegram = { enabled: Boolean(config.telegram.enabled), botToken: String(config.telegram.botToken || '').trim(), chatId: String(config.telegram.chatId || '').trim() };
        }
        if (config && config.logging && typeof config.logging === 'object') {
            clean.logging = { enabled: Boolean(config.logging.enabled) };
        }
        if (config && Array.isArray(config.servers)) {
            clean.servers = config.servers
                .map((s) => {
                    const parsed = this.normalizeServerUrl(s && s.url);
                    if (!parsed) return null;
                    const mainUrl = parsed.toString().replace(/\/$/, '');
                    const seenFallbackUrls = new Set([mainUrl.toLowerCase()]);
                    const fallbackUrls = Array.isArray(s.fallbackUrls) ? s.fallbackUrls
                        .map((fallbackUrl) => this.normalizeServerUrl(fallbackUrl))
                        .filter(Boolean)
                        .map((fallbackUrl) => fallbackUrl.toString().replace(/\/$/, ''))
                        .filter((fallbackUrl) => {
                            const key = fallbackUrl.toLowerCase();
                            if (seenFallbackUrls.has(key)) return false;
                            seenFallbackUrls.add(key);
                            return true;
                        })
                        .slice(0, 8) : [];
                    return {
                        id: s.id || Date.now(), name: String(s.name || parsed.hostname).slice(0, 80), remoteName: String(s.remoteName || '').slice(0, 80), url: mainUrl, fallbackUrls, customIcon: typeof s.customIcon === 'string' ? s.customIcon : null,
                        status: ['online', 'offline', 'unknown'].includes(s.status) ? s.status : 'unknown',
                        totalChecks: Number.isFinite(Number(s.totalChecks)) ? Math.max(0, Number(s.totalChecks)) : 0, successfulChecks: Number.isFinite(Number(s.successfulChecks)) ? Math.max(0, Number(s.successfulChecks)) : 0,
                        uptime: typeof s.uptime === 'string' ? s.uptime : '0.0', latency: Number.isFinite(Number(s.latency)) ? Math.max(0, Number(s.latency)) : 0,
                        lastCheck: Number.isFinite(Number(s.lastCheck)) ? Number(s.lastCheck) : 0, offlineSince: Number.isFinite(Number(s.offlineSince)) ? Math.max(0, Number(s.offlineSince)) : 0,
                        offlineAlertSentAt: Number.isFinite(Number(s.offlineAlertSentAt)) ? Math.max(0, Number(s.offlineAlertSentAt)) : 0,
                        consecutiveFailures: Number.isFinite(Number(s.consecutiveFailures)) ? Math.max(0, Number(s.consecutiveFailures)) : 0,
                        firstFailureAt: Number.isFinite(Number(s.firstFailureAt)) ? Math.max(0, Number(s.firstFailureAt)) : 0,
                        addressProbeResults: this.normalizeAddressProbeResults(s.addressProbeResults),
                        history: skipHistoryNormalization ? (Array.isArray(s.history) ? s.history : []) : this.normalizeHistory(s.history, s.lastCheck), mediaStats: this.normalizeMediaStats(s.mediaStats)
                    };
                })
                .filter(Boolean);
        }
        if (config && config.icons && typeof config.icons === 'object' && !Array.isArray(config.icons)) clean.icons = this.extractIcons(config.icons);
        return clean;
    },
  
    async compactOversizedHistoriesIfNeeded(env) {
        if (!env || !env.EMBY_DB) return null;
        const markerValue = String(this.HISTORY_LIMIT);
        try {
            const marker = await env.EMBY_DB.get(this.HISTORY_COMPACTION_MARKER_KEY);
            if (marker === markerValue) return null;
        } catch(e) {}
  
        const raw = await env.EMBY_DB.get('config');
        if (!raw) {
            await env.EMBY_DB.put(this.HISTORY_COMPACTION_MARKER_KEY, markerValue);
            return null;
        }
  
        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch(e) {
            return null;
        }
  
        const servers = parsed && Array.isArray(parsed.servers) ? parsed.servers : [];
        let changed = false;
        for (let index = 0; index < servers.length; index += 1) {
            const server = servers[index];
            if (!server || !Array.isArray(server.history)) continue;
            const overflow = server.history.length - this.HISTORY_LIMIT;
            if (overflow <= 0) continue;
            server.history.splice(0, overflow);
            changed = true;
        }
        if (changed) {
            await env.EMBY_DB.put('config', JSON.stringify(this.sanitizeConfig(parsed, { skipHistoryNormalization: true })));
        }
        await env.EMBY_DB.put(this.HISTORY_COMPACTION_MARKER_KEY, markerValue);
        return changed ? true : null;
    },
  
    async listAllKvEntries(env) {
        if (!env || !env.EMBY_DB || typeof env.EMBY_DB.list !== 'function') return [];
        const entries = [];
        let cursor;
        do {
            const listed = await env.EMBY_DB.list({ cursor });
            const keys = Array.isArray(listed && listed.keys) ? listed.keys : [];
            for (let index = 0; index < keys.length; index += 1) {
                const key = keys[index];
                const name = key && key.name ? String(key.name) : '';
                if (!name) continue;
                const value = await env.EMBY_DB.get(name);
                if (value === null || value === undefined) continue;
                entries.push({
                    key: name,
                    value: String(value),
                    expiresAt: Number(key.expiration) > 0 ? Number(key.expiration) * 1000 : 0
                });
            }
            cursor = listed && listed.list_complete === false ? listed.cursor : undefined;
        } while (cursor);
        return entries;
    },
  
    async clearAllKvEntries(env) {
        if (!env || !env.EMBY_DB || typeof env.EMBY_DB.list !== 'function' || typeof env.EMBY_DB.delete !== 'function') return 0;
        const names = [];
        let cursor;
        do {
            const listed = await env.EMBY_DB.list({ cursor });
            const keys = Array.isArray(listed && listed.keys) ? listed.keys : [];
            for (let index = 0; index < keys.length; index += 1) {
                const key = keys[index];
                if (!key || !key.name) continue;
                names.push(String(key.name));
            }
            cursor = listed && listed.list_complete === false ? listed.cursor : undefined;
        } while (cursor);
        for (let index = 0; index < names.length; index += 1) {
            await env.EMBY_DB.delete(names[index]);
        }
        return names.length;
    },
  
    async exportKvSnapshot(env) {
        const entries = await this.listAllKvEntries(env);
        return {
            schema: 'emby-kv-snapshot',
            version: 1,
            exportedAt: Date.now(),
            appVersion: this.APP_VERSION || '',
            entries
        };
    },
  
    normalizeKvSnapshotEntries(snapshot) {
        if (!snapshot) return [];
        const rawEntries = Array.isArray(snapshot.entries)
            ? snapshot.entries
            : (snapshot.entries && typeof snapshot.entries === 'object'
                ? Object.entries(snapshot.entries).map(([key, value]) => ({ key, value }))
                : []);
        return rawEntries
            .map((entry) => {
                if (!entry || typeof entry !== 'object') return null;
                const key = String(entry.key || entry.name || '').trim();
                if (!key) return null;
                const expiresAt = Number.isFinite(Number(entry.expiresAt)) ? Math.max(0, Number(entry.expiresAt)) : 0;
                return {
                    key,
                    value: entry.value === undefined || entry.value === null ? '' : String(entry.value),
                    expiresAt
                };
            })
            .filter(Boolean);
    },
  
    async importKvSnapshot(env, snapshot, options = {}) {
        const parsed = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot;
        const replace = options.replace !== false;
        const entries = this.normalizeKvSnapshotEntries(parsed);
        if (!entries.length) {
            return { ok: false, imported: 0, skipped: 0, total: 0, error: 'Snapshot has no entries' };
        }
        if (replace) await this.clearAllKvEntries(env);
  
        let imported = 0;
        let skipped = 0;
        const now = Date.now();
        for (let index = 0; index < entries.length; index += 1) {
            const entry = entries[index];
            if (!entry || !entry.key) continue;
            if (entry.expiresAt && entry.expiresAt <= now) {
                skipped += 1;
                continue;
            }
            const putOptions = entry.expiresAt
                ? { expirationTtl: Math.max(1, Math.ceil((entry.expiresAt - now) / 1000)) }
                : {};
            await env.EMBY_DB.put(entry.key, entry.value, putOptions);
            imported += 1;
        }
        return { ok: true, imported, skipped, total: entries.length, replaced: replace };
    },
  
    normalizeAddressProbeResults(results) {
        if (!Array.isArray(results)) return [];
        return results.slice(0, 5).map((item) => {
            const parsed = this.normalizeServerUrl(item && item.url);
            if (!parsed) return null;
            return {
                url: parsed.toString().replace(/\/$/, ''),
                ok: Boolean(item.ok),
                latency: Number.isFinite(Number(item.latency)) ? Math.max(0, Number(item.latency)) : 0,
                serverName: String(item.serverName || '').slice(0, 80)
            };
        }).filter(Boolean);
    },
  
    normalizeHistory(history, fallbackTime = 0) {
        if (!Array.isArray(history)) return [];
        const overflow = history.length - this.HISTORY_LIMIT;
        if (overflow > 0) history.splice(0, overflow);
        if (!history.length) return history;
  
        const now = Date.now();
        const baseTime = Number.isFinite(Number(fallbackTime)) && Number(fallbackTime) > 0 ? Number(fallbackTime) : now;
        let needsRepair = false;
        for (let index = 0; index < history.length; index += 1) {
            const entry = history[index];
            if (!entry || typeof entry !== 'object') {
                needsRepair = true;
                break;
            }
            if (entry.status !== 'online' && entry.status !== 'offline') {
                needsRepair = true;
                break;
            }
            if (!Number.isFinite(entry.time) || entry.time <= 0) {
                needsRepair = true;
                break;
            }
            if (!Number.isFinite(entry.latency) || entry.latency < 0) {
                needsRepair = true;
                break;
            }
        }
        if (!needsRepair) return history;
  
        for (let index = 0; index < history.length; index += 1) {
            const entry = history[index];
            const fallbackEntryTime = baseTime - ((history.length - index - 1) * 60000);
            if (entry && typeof entry === 'object') {
                const status = entry.status === 'online' || entry.status === 1 || entry.value === 1 ? 'online' : 'offline';
                const time = Number.isFinite(Number(entry.time)) && Number(entry.time) > 0 ? Number(entry.time) : fallbackEntryTime;
                const latency = Number.isFinite(Number(entry.latency)) ? Math.max(0, Number(entry.latency)) : 0;
                if (entry.status === status && entry.time === time && entry.latency === latency) continue;
                history[index] = { status, time, latency };
                continue;
            }
            history[index] = { status: entry ? 'online' : 'offline', time: fallbackEntryTime, latency: 0 };
        }
        return history;
    },
  
    normalizeMediaStats(mediaStats) {
        const emptyCounts = { movie: 0, series: 0, episode: 0 };
        const normalizeKeepAlive = (value) => {
            const source = value && typeof value === 'object' ? value : {};
            const periodDays = Number.isFinite(Number(source.periodDays)) && Number(source.periodDays) > 0 ? Math.floor(Number(source.periodDays)) : 30;
            const rawAlertDays = Number.isFinite(Number(source.alertDays)) && Number(source.alertDays) > 0 ? Math.floor(Number(source.alertDays)) : 27;
            const alertDays = Math.min(rawAlertDays, Math.max(1, periodDays - 1));
            return {
                enabled: Boolean(source.enabled),
                periodDays,
                alertDays,
                lastPlayedAt: Number.isFinite(Number(source.lastPlayedAt)) ? Math.max(0, Number(source.lastPlayedAt)) : 0,
                lastCheckedAt: Number.isFinite(Number(source.lastCheckedAt)) ? Math.max(0, Number(source.lastCheckedAt)) : 0,
                alertSentAt: Number.isFinite(Number(source.alertSentAt)) ? Math.max(0, Number(source.alertSentAt)) : 0
            };
        };
        if (!mediaStats || typeof mediaStats !== 'object') {
            return { enabled: false, username: '', password: '', accessToken: '', userId: '', deviceId: '', clientProfile: '', lastCheck: 0, lastError: '', counts: null, previousCounts: null, delta24h: null, todayCounts: null, yesterdayCounts: null, dailyDelta: null, dailyKey: '', lastPlayedAt: 0, lastPlayedCheck: 0, lastPlayedError: '', lastPlayedItem: null, keepAlive: normalizeKeepAlive(null) };
        }
        const cleanCounts = (counts) => {
            if (!counts || typeof counts !== 'object') return null;
            return { movie: Number.isFinite(Number(counts.movie)) ? Math.max(0, Number(counts.movie)) : emptyCounts.movie, series: Number.isFinite(Number(counts.series)) ? Math.max(0, Number(counts.series)) : emptyCounts.series, episode: Number.isFinite(Number(counts.episode)) ? Math.max(0, Number(counts.episode)) : emptyCounts.episode, time: Number.isFinite(Number(counts.time)) ? Number(counts.time) : 0 };
        };
        const cleanDeltaCounts = (counts) => {
            if (!counts || typeof counts !== 'object') return null;
            return { movie: Number.isFinite(Number(counts.movie)) ? Number(counts.movie) : 0, series: Number.isFinite(Number(counts.series)) ? Number(counts.series) : 0, episode: Number.isFinite(Number(counts.episode)) ? Number(counts.episode) : 0, time: Number.isFinite(Number(counts.time)) ? Number(counts.time) : 0 };
        };
        const clean = {
            enabled: Boolean(mediaStats.enabled), username: String(mediaStats.username || '').slice(0, 120), password: String(mediaStats.password || ''), accessToken: String(mediaStats.accessToken || ''), userId: String(mediaStats.userId || ''),
            deviceId: String(mediaStats.deviceId || ('forward-' + Math.random().toString(36).slice(2))).slice(0, 120), clientProfile: String(mediaStats.clientProfile || '').slice(0, 40), lastCheck: Number.isFinite(Number(mediaStats.lastCheck)) ? Number(mediaStats.lastCheck) : 0,
            lastError: String(mediaStats.lastError || '').slice(0, 160), counts: cleanCounts(mediaStats.counts), previousCounts: cleanCounts(mediaStats.previousCounts), delta24h: cleanDeltaCounts(mediaStats.delta24h),
            todayCounts: cleanCounts(mediaStats.todayCounts), yesterdayCounts: cleanCounts(mediaStats.yesterdayCounts), dailyDelta: cleanDeltaCounts(mediaStats.dailyDelta), dailyKey: String(mediaStats.dailyKey || ''),
            lastPlayedAt: Number.isFinite(Number(mediaStats.lastPlayedAt)) ? Math.max(0, Number(mediaStats.lastPlayedAt)) : 0,
            lastPlayedCheck: Number.isFinite(Number(mediaStats.lastPlayedCheck)) ? Math.max(0, Number(mediaStats.lastPlayedCheck)) : 0,
            lastPlayedError: String(mediaStats.lastPlayedError || '').slice(0, 160),
            lastPlayedItem: mediaStats.lastPlayedItem && typeof mediaStats.lastPlayedItem === 'object' ? {
                id: String(mediaStats.lastPlayedItem.id || '').slice(0, 80),
                name: String(mediaStats.lastPlayedItem.name || '').slice(0, 180),
                type: String(mediaStats.lastPlayedItem.type || '').slice(0, 40),
                seriesName: String(mediaStats.lastPlayedItem.seriesName || '').slice(0, 180),
                seasonName: String(mediaStats.lastPlayedItem.seasonName || '').slice(0, 120),
                indexNumber: Number.isFinite(Number(mediaStats.lastPlayedItem.indexNumber)) ? Number(mediaStats.lastPlayedItem.indexNumber) : null,
                playedPercentage: Number.isFinite(Number(mediaStats.lastPlayedItem.playedPercentage)) ? Math.max(0, Math.min(100, Number(mediaStats.lastPlayedItem.playedPercentage))) : null
            } : null,
            keepAlive: normalizeKeepAlive(mediaStats.keepAlive)
        };
        const hasStoredDailySnapshots = Boolean(clean.todayCounts || clean.yesterdayCounts);
        if (!clean.todayCounts && clean.counts) clean.todayCounts = clean.counts;
        if (!clean.yesterdayCounts && !hasStoredDailySnapshots && clean.previousCounts) clean.yesterdayCounts = clean.previousCounts;
        if (!clean.dailyDelta && clean.counts && clean.yesterdayCounts) {
            clean.dailyDelta = { movie: clean.counts.movie - clean.yesterdayCounts.movie, series: clean.counts.series - clean.yesterdayCounts.series, episode: clean.counts.episode - clean.yesterdayCounts.episode, time: clean.counts.time };
        }
        if (!clean.dailyKey && clean.counts && clean.counts.time) clean.dailyKey = this.getShanghaiDayKey(clean.counts.time);
        return clean;
    },

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

  LOG_KEY: 'runtime_logs',
    LOG_LIMIT: 1000,
  
    redactLogValue(key, value) {
        const lowerKey = String(key || '').toLowerCase();
        if (/(token|password|secret|authorization|cookie|apikey|api_key)/.test(lowerKey)) {
            return value ? '[redacted]' : value;
        }
        if (typeof value === 'string') {
            return value.length > 500 ? value.slice(0, 500) + '...' : value;
        }
        return value;
    },
  
    sanitizeLogMeta(input, depth = 0) {
        if (depth > 4) return '[max-depth]';
        if (input === null || input === undefined) return input;
        if (typeof input !== 'object') return this.redactLogValue('', input);
        if (Array.isArray(input)) return input.slice(0, 80).map((item) => this.sanitizeLogMeta(item, depth + 1));
        const output = {};
        for (const [key, value] of Object.entries(input).slice(0, 80)) {
            output[key] = this.redactLogValue(key, typeof value === 'object' && value !== null ? this.sanitizeLogMeta(value, depth + 1) : value);
        }
        return output;
    },
  
    async readRuntimeLogs(env) {
        const raw = await env.EMBY_DB.get(this.LOG_KEY);
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch(e) {
            return [];
        }
    },
  
    isRuntimeLoggingEnabled(config) {
        return Boolean(config && config.logging && config.logging.enabled);
    },
  
    async appendRuntimeLog(env, level, event, message, meta = {}, options = {}) {
        if (!env || !env.EMBY_DB) return;
        if (!options.force) {
            const config = options.config || await this.loadConfig(env);
            if (!this.isRuntimeLoggingEnabled(config)) return;
        }
        const entry = {
            time: Date.now(),
            level: ['debug', 'info', 'warn', 'error'].includes(level) ? level : 'info',
            event: String(event || 'event').slice(0, 80),
            message: String(message || '').slice(0, 500),
            meta: this.sanitizeLogMeta(meta)
        };
        try {
            const logs = await this.readRuntimeLogs(env);
            logs.push(entry);
            await env.EMBY_DB.put(this.LOG_KEY, JSON.stringify(logs.slice(-this.LOG_LIMIT)));
        } catch(e) {
            console.log('[logs] append failed', e && e.message ? e.message : String(e));
        }
    },
  
    async clearRuntimeLogs(env) {
        await env.EMBY_DB.put(this.LOG_KEY, JSON.stringify([]));
    },
  
    formatRuntimeLogs(logs) {
        return (Array.isArray(logs) ? logs : []).map((entry) => {
            const time = new Date(Number(entry.time) || Date.now()).toISOString();
            const meta = entry.meta && Object.keys(entry.meta).length ? ' ' + JSON.stringify(entry.meta) : '';
            return '[' + time + '] [' + String(entry.level || 'info').toUpperCase() + '] ' + String(entry.event || 'event') + ' - ' + String(entry.message || '') + meta;
        }).join('\n') + '\n';
    },

  normalizeServerUrl(value) {
        if (!value || typeof value !== 'string') return null;
        let input = value.trim();
        if (!/^https?:\/\//i.test(input)) input = 'https://' + input;
        return this.parsePublicHttpUrl(input);
    },
  
    parsePublicHttpUrl(value) {
        try {
            const parsed = new URL(value);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
            const host = parsed.hostname.toLowerCase();
            if (host === 'localhost' || host.endsWith('.localhost') || host === 'metadata.google.internal' || host.startsWith('127.') || host.startsWith('10.') || host.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) || host === '0.0.0.0' || host === '::1' || host.startsWith('169.254.')) return null;
            parsed.hash = ''; return parsed;
        } catch(e) { return null; }
    },

  getEgressProxyUrl(env = null) {
        const value = env && env.EGRESS_PROXY_URL !== undefined ? env.EGRESS_PROXY_URL : this.EGRESS_PROXY_URL;
        const text = String(value || '').trim();
        if (!text) return '';
        try {
            const parsed = new URL(text);
            return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : '';
        } catch(e) {
            return '';
        }
    },

    getEgressProxyToken(env = null) {
        const value = env && env.EGRESS_PROXY_TOKEN !== undefined ? env.EGRESS_PROXY_TOKEN : this.EGRESS_PROXY_TOKEN;
        return String(value || '').trim();
    },

    isEgressProxyBypassed(url, env = null) {
        const proxyUrl = this.getEgressProxyUrl(env);
        if (!proxyUrl) return true;
        try {
            const target = new URL(String(url || ''));
            const proxy = new URL(proxyUrl);
            return target.origin === proxy.origin;
        } catch(e) {
            return true;
        }
    },

    normalizeEgressHeaders(headers = {}) {
        const normalized = {};
        const source = headers instanceof Headers ? Object.fromEntries(headers.entries()) : (headers || {});
        for (const [key, value] of Object.entries(source)) {
            const name = String(key || '').trim();
            if (!name) continue;
            const lower = name.toLowerCase();
            if (['host', 'connection', 'content-length'].includes(lower)) continue;
            normalized[name] = String(value);
        }
        return normalized;
    },

    async bodyToEgressPayload(body) {
        if (body === undefined || body === null) return { bodyText: '' };
        if (typeof body === 'string') return { bodyText: body };
        if (body instanceof URLSearchParams) return { bodyText: body.toString() };
        if (body instanceof ArrayBuffer) {
            const bytes = new Uint8Array(body);
            let binary = '';
            for (const byte of bytes) binary += String.fromCharCode(byte);
            return { bodyBase64: btoa(binary) };
        }
        return { bodyText: String(body) };
    },

    decodeEgressBody(data) {
        if (!data || typeof data !== 'object') return '';
        if (data.bodyBase64) {
            const binary = atob(String(data.bodyBase64));
            const bytes = new Uint8Array(binary.length);
            for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
            return bytes;
        }
        return String(data.bodyText || data.body || '');
    },

    async fetchViaEgressProxy(url, options = {}, timeoutMs = 5000, env = null) {
        const proxyUrl = this.getEgressProxyUrl(env);
        if (!proxyUrl || this.isEgressProxyBypassed(url, env)) return null;
        const bodyPayload = await this.bodyToEgressPayload(options.body);
        const payload = {
            url: String(url),
            method: String(options.method || 'GET').toUpperCase(),
            headers: this.normalizeEgressHeaders(options.headers),
            ...bodyPayload
        };
        const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
        const token = this.getEgressProxyToken(env);
        if (token) headers.Authorization = 'Bearer ' + token;
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), timeoutMs);
        try {
            const response = await fetch(proxyUrl, { method: 'POST', headers, body: JSON.stringify(payload), signal: c.signal });
            if (!response.ok) throw new Error('出口中转请求失败 HTTP ' + response.status);
            const data = await response.json();
            const responseHeaders = new Headers(data.headers || {});
            responseHeaders.delete('content-encoding');
            responseHeaders.delete('content-length');
            return new Response(this.decodeEgressBody(data), {
                status: Number(data.status) || 502,
                statusText: String(data.statusText || ''),
                headers: responseHeaders
            });
        } finally {
            clearTimeout(t);
        }
    },

  getEmbyClientProfiles() {
        return [
            { id: 'forward', client: 'Forward', device: 'Forward', version: '1.0.0', userAgent: 'Forward/1.0.0' },
            { id: 'android', client: 'Emby for Android', device: 'Android', version: '3.3.80', userAgent: 'Dalvik/2.1.0 (Linux; U; Android 13)' }
        ];
    },
  
    getPreferredEmbyClientProfiles(server, profileId = '') {
        const profiles = this.getEmbyClientProfiles();
        const media = server.mediaStats || {};
        const preferredId = String(profileId || media.clientProfile || '').trim();
        if (!preferredId) return profiles;
        const preferred = profiles.find((profile) => profile.id === preferredId);
        return preferred ? [preferred, ...profiles.filter((profile) => profile.id !== preferred.id)] : profiles;
    },
  
    buildEmbyAuthHeader(server, token = '', profile = null) {
        const media = server.mediaStats || {};
        const clientProfile = profile || this.getPreferredEmbyClientProfiles(server)[0];
        const deviceId = String(media.deviceId || server.id || 'forward');
        const parts = [
            'MediaBrowser Client="' + clientProfile.client + '"',
            'Device="' + clientProfile.device + '"',
            'DeviceId="' + deviceId + '"',
            'Version="' + clientProfile.version + '"'
        ];
        if (token) parts.push('Token="' + token + '"');
        return parts.join(', ');
    },
  
    buildEmbyClientHeaders(server, token = '', profile = null) {
        const media = server.mediaStats || {};
        const clientProfile = profile || this.getPreferredEmbyClientProfiles(server)[0];
        const deviceId = media.deviceId || server.id || 'forward';
        const authHeader = this.buildEmbyAuthHeader(server, token, clientProfile);
        const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': authHeader, 'X-Emby-Authorization': authHeader, 'X-Emby-Client': clientProfile.client, 'X-Emby-Device-Name': clientProfile.device, 'X-Emby-Device-Id': String(deviceId), 'X-Emby-Client-Version': clientProfile.version, 'User-Agent': clientProfile.userAgent };
        if (token) headers['X-Emby-Token'] = token;
        return headers;
    },
  
    async readShortResponse(response) { try { return (await response.text()).slice(0, 160); } catch(e) { return ''; } },
  
    parseEmbyDate(value) {
        const text = String(value || '').trim();
        if (!text) return 0;
        const normalized = /(?:z|[+-]\d{2}:?\d{2})$/i.test(text) ? text : text + 'Z';
        const time = Date.parse(normalized);
        return Number.isFinite(time) && time > 0 ? time : 0;
    },
  
    parsePlaybackReportDate(dateValue, timeValue = '') {
        const dateText = String(dateValue || '').trim();
        const timeText = String(timeValue || '').trim();
        if (!dateText) return 0;
        const combined = timeText ? (dateText + 'T' + timeText) : dateText;
        return this.parseEmbyDate(combined);
    },
  
    normalizeEmbyUserId(value) {
        return String(value || '').replace(/-/g, '').trim().toLowerCase();
    },
  
    getEmbyApiBases(server) {
        const target = this.normalizeServerUrl(server.url);
        if (!target) throw new Error('服务器地址无效');
        const base = target.toString().replace(/\/$/, '');
        const bases = [base];
        if (!base.toLowerCase().endsWith('/emby')) bases.push(base + '/emby');
        return [...new Set(bases)];
    },
  
    async fetchEmbyServerName(server, token, options = {}) {
        const maxBases = Math.max(1, Number(options.maxBases) || 2);
        const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 8000);
        const bases = this.getEmbyApiBases(server).slice(0, maxBases);
        const profile = this.getPreferredEmbyClientProfiles(server, options.clientProfile)[0];
        for (const base of bases) {
            try {
                const response = await this.fetchWithTimeout(base + '/System/Info?api_key=' + encodeURIComponent(token), { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile), env: options.env }, timeoutMs);
                if (!response.ok) continue;
                const name = this.extractEmbyServerName(await response.json());
                if (name) return name;
            } catch(e) {}
        }
        return '';
    },
  
    isPlaybackActivityEntry(entry) {
        if (!entry || typeof entry !== 'object') return false;
        const type = String(entry.Type || '');
        const text = [entry.Name, entry.Overview, entry.ShortOverview].map((value) => String(value || '')).join(' ');
        if (/Playback/i.test(type)) return true;
        return /\b(is|started|stopped|finished)\s+play/i.test(text) || /播放/.test(text);
    },
  
    isActivityEntryForUser(entry, userId, username) {
        const entryUserId = String(entry && entry.UserId !== undefined ? entry.UserId : '').trim();
        const expectedUserId = String(userId || '').trim();
        if (entryUserId && expectedUserId && entryUserId === expectedUserId) return true;
        const name = String(username || '').trim().toLowerCase();
        if (!name) return !entryUserId;
        const text = [entry.Name, entry.Overview, entry.ShortOverview].map((value) => String(value || '').toLowerCase()).join(' ');
        return text.includes(name);
    },
  
    normalizeActivityPlayedItem(entry, playedAt) {
        if (!entry || typeof entry !== 'object') return null;
        return {
            id: String(entry.ItemId || entry.Id || ''),
            name: String(entry.ItemName || entry.Name || ''),
            type: String(entry.ItemType || entry.Type || 'activity'),
            seriesName: String(entry.SeriesName || ''),
            seasonName: String(entry.SeasonName || ''),
            indexNumber: Number.isFinite(Number(entry.ItemIndex)) ? Number(entry.ItemIndex) : null,
            playedPercentage: null,
            playedAt: Number(playedAt) || 0,
            source: 'activity-log'
        };
    },
  
    async fetchEmbyActivityLastPlayed(server, token, userId, options = {}) {
        const maxBases = Math.max(1, Number(options.maxBases) || 10);
        const maxProfiles = Math.max(1, Number(options.maxProfiles) || 10);
        const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 8000);
        const limit = Math.min(Math.max(20, Number(options.limit) || 100), 200);
        const bases = this.getEmbyApiBases(server).slice(0, maxBases);
        const username = server.mediaStats && server.mediaStats.username ? server.mediaStats.username : '';
        const buildQuery = (params) => Object.entries(params).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&');
        let lastError = '播放日志读取失败';
        for (const base of bases) {
            for (const profile of this.getPreferredEmbyClientProfiles(server, options.clientProfile).slice(0, maxProfiles)) {
                try {
                    const query = buildQuery({ StartIndex: '0', Limit: String(limit), hasUserId: 'true', api_key: token });
                    const response = await this.fetchWithTimeout(base + '/System/ActivityLog/Entries?' + query, { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile), env: options.env }, timeoutMs);
                    if (!response.ok) {
                        lastError = '播放日志读取失败 HTTP ' + response.status;
                        continue;
                    }
                    const data = await response.json();
                    const items = data && Array.isArray(data.Items) ? data.Items : (Array.isArray(data) ? data : []);
                    let latestPlayedAt = 0;
                    let latestItem = null;
                    for (const entry of items) {
                        if (!this.isPlaybackActivityEntry(entry)) continue;
                        if (!this.isActivityEntryForUser(entry, userId, username)) continue;
                        const playedAt = this.parseEmbyDate(entry.Date || entry.TimeStamp || entry.Timestamp || entry.CreatedAt);
                        if (playedAt > latestPlayedAt) {
                            latestPlayedAt = playedAt;
                            latestItem = this.normalizeActivityPlayedItem(entry, playedAt);
                        }
                    }
                    if (latestPlayedAt) return { lastPlayedAt: latestPlayedAt, item: latestItem, clientProfile: profile.id };
                    lastError = '播放日志里没有匹配当前用户的播放事件';
                } catch(e) {
                    lastError = e.name === 'AbortError' ? '播放日志读取超时' : (e.message || '播放日志读取失败');
                }
            }
        }
        const error = new Error(lastError);
        throw error;
    },
  
    async loginEmbyForMedia(server, options = {}) {
        const media = server.mediaStats || {};
        if (!media.username) throw new Error('缺少媒体库用户名');
        const maxBases = Math.max(1, Number(options.maxBases) || 10);
        const maxProfiles = Math.max(1, Number(options.maxProfiles) || 10);
        const maxAttempts = Math.max(1, Number(options.maxAttempts) || 2);
        const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 15000);
        const bases = this.getEmbyApiBases(server).slice(0, maxBases);
        let lastError = '媒体库登录失败';
        const logStartedAt = Date.now();
        const logContext = { flow: options.flow || 'media', requestId: options.requestId || '', serverId: server.id, serverName: server.name, maxBases, maxProfiles, maxAttempts, timeoutMs };
        const logMedia = async (stage, meta = {}) => {
            console.log('[trace] media.login.stage', { ...logContext, stage, elapsedMs: Date.now() - logStartedAt, ...meta });
        };
        await logMedia('start', { hasUsername: Boolean(media.username), hasPassword: Boolean(media.password), baseCount: bases.length });
        for (const base of bases) {
            await logMedia('base.start', { base });
            for (const profile of this.getPreferredEmbyClientProfiles(server).slice(0, maxProfiles)) {
                await logMedia('profile.start', { base, profile: profile.id });
                const attempts = [
                    { headers: this.buildEmbyClientHeaders(server, '', profile), body: JSON.stringify({ Username: media.username, Pw: media.password || '', Password: media.password || '' }) },
                    { headers: { ...this.buildEmbyClientHeaders(server, '', profile), 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: new URLSearchParams({ Username: media.username, Pw: media.password || '', Password: media.password || '' }).toString() }
                ].slice(0, maxAttempts);
                for (const [attemptIndex, attempt] of attempts.entries()) {
                    await logMedia('attempt.start', { base, profile: profile.id, attemptIndex: attemptIndex + 1, contentType: attempt.headers['Content-Type'] || 'application/json' });
                    try {
                        const response = await this.fetchWithTimeout(base + '/Users/AuthenticateByName', { method: 'POST', headers: attempt.headers, body: attempt.body, env: options.env }, timeoutMs);
                        if (!response.ok) {
                            const detail = await this.readShortResponse(response);
                            lastError = response.status === 401 ? '媒体库账号或密码错误' : '媒体库登录失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                            await logMedia('attempt.httpError', { base, profile: profile.id, attemptIndex: attemptIndex + 1, status: response.status, error: lastError, responsePreview: detail });
                            continue;
                        }
                        const data = await response.json();
                        if (data.AccessToken) {
                            await logMedia('done', { base, profile: profile.id, hasUserId: Boolean(data.User && data.User.Id) });
                            return { accessToken: data.AccessToken, userId: data.User && data.User.Id ? String(data.User.Id) : '', base, clientProfile: profile.id };
                        }
                        lastError = '未获取到媒体库 Token';
                        await logMedia('attempt.noToken', { base, profile: profile.id, attemptIndex: attemptIndex + 1 });
                    } catch(e) {
                        lastError = e.name === 'AbortError' ? '媒体库登录超时' : (e.message || '媒体库登录失败');
                        await logMedia('attempt.error', { base, profile: profile.id, attemptIndex: attemptIndex + 1, error: lastError });
                    }
                }
            }
        }
        await logMedia('error', { error: lastError });
        throw new Error(lastError);
    },
  
    async fetchEmbyMediaCounts(server, token, options = {}) {
        const maxBases = Math.max(1, Number(options.maxBases) || 10);
        const maxProfiles = Math.max(1, Number(options.maxProfiles) || 10);
        const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 15000);
        const bases = this.getEmbyApiBases(server).slice(0, maxBases);
        let lastError = '资源统计失败';
        const logStartedAt = Date.now();
        const logContext = { flow: options.flow || 'media', requestId: options.requestId || '', serverId: server.id, serverName: server.name, maxBases, maxProfiles, timeoutMs, clientProfile: options.clientProfile || '' };
        const logMedia = async (stage, meta = {}) => {
            console.log('[trace] media.counts.api.stage', { ...logContext, stage, elapsedMs: Date.now() - logStartedAt, ...meta });
        };
        await logMedia('start', { baseCount: bases.length, tokenPresent: Boolean(token) });
        for (const base of bases) {
            await logMedia('base.start', { base });
            for (const profile of this.getPreferredEmbyClientProfiles(server, options.clientProfile).slice(0, maxProfiles)) {
                await logMedia('profile.start', { base, profile: profile.id });
                try {
                    const response = await this.fetchWithTimeout(base + '/Items/Counts?api_key=' + encodeURIComponent(token), { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile), env: options.env }, timeoutMs);
                    if (!response.ok) {
                        const detail = await this.readShortResponse(response);
                        lastError = response.status === 401 ? '媒体库 Token 失效' : '资源统计失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                        await logMedia('profile.httpError', { base, profile: profile.id, status: response.status, error: lastError, responsePreview: detail });
                        continue;
                    }
                    const data = await response.json();
                    await logMedia('done', { base, profile: profile.id, counts: { movie: Number(data.MovieCount || 0), series: Number(data.SeriesCount || 0), episode: Number(data.EpisodeCount || 0) } });
                    return { movie: Number(data.MovieCount || 0), series: Number(data.SeriesCount || 0), episode: Number(data.EpisodeCount || 0), time: Date.now(), clientProfile: profile.id };
                } catch(e) {
                    lastError = e.name === 'AbortError' ? '资源统计超时' : (e.message || '资源统计失败');
                    await logMedia('profile.error', { base, profile: profile.id, error: lastError });
                }
            }
        }
        await logMedia('error', { error: lastError });
        throw new Error(lastError);
    },
  
    async fetchEmbyLastPlayed(server, token, userId, options = {}) {
        if (!userId) throw new Error('未获取到媒体库 UserId');
        const maxBases = Math.max(1, Number(options.maxBases) || 10);
        const maxProfiles = Math.max(1, Number(options.maxProfiles) || 10);
        const maxEndpoints = Math.max(1, Number(options.maxEndpoints) || 5);
        const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 0);
        const bases = this.getEmbyApiBases(server).slice(0, maxBases);
        let lastError = '最后播放时间读取失败';
        const includeItem = Boolean(options.includeItem);
        const debugEnabled = Boolean(options.debug);
        const debug = [];
        let successfulProfileId = String(options.clientProfile || (server.mediaStats && server.mediaStats.clientProfile) || '').trim();
  
        const extractPlayedAt = (item) => {
            if (!item) return 0;
            const candidates = [
                item.UserData && item.UserData.LastPlayedDate,
                item.LastPlayedDate,
                item.DatePlayed,
                item.LastActivityDate,
                item.DateLastActivity,
                item.LatestDate
            ];
            return Math.max(...candidates.map((value) => this.parseEmbyDate(value)));
        };
        const collectLatestPlayedItem = (items, latestPlayedAt = 0, latestItem = null) => {
            let endpointLatestPlayedAt = 0;
            let endpointLatestItem = null;
            for (const item of items) {
                const playedAt = extractPlayedAt(item);
                if (playedAt > endpointLatestPlayedAt) {
                    endpointLatestPlayedAt = playedAt;
                    endpointLatestItem = this.normalizeLastPlayedItem(item, playedAt);
                }
                if (playedAt > latestPlayedAt) {
                    latestPlayedAt = playedAt;
                    latestItem = this.normalizeLastPlayedItem(item, playedAt);
                }
            }
            return { latestPlayedAt, latestItem, endpointLatestPlayedAt, endpointLatestItem };
        };
        const buildDebugSample = (item) => {
            if (!item || typeof item !== 'object') return null;
            return {
                id: item.Id || item.item_id || '',
                name: item.Name || item.item_name || '',
                type: item.Type || item.item_type || '',
                userDataLastPlayedDate: item.UserData && item.UserData.LastPlayedDate ? item.UserData.LastPlayedDate : '',
                userDataPlayed: item.UserData && item.UserData.Played !== undefined ? Boolean(item.UserData.Played) : null,
                lastPlayedDate: item.LastPlayedDate || '',
                datePlayed: item.DatePlayed || '',
                lastActivityDate: item.LastActivityDate || '',
                parsedPlayedAt: extractPlayedAt(item),
                keys: Object.keys(item).slice(0, 20)
            };
        };
        let latestPlayedAt = 0;
        let latestItem = null;
        let topCandidate = null;
        const buildQuery = (params) => Object.entries(params).map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value)).join('&');
        const baseItemsQuery = {
            SortBy: 'DatePlayed',
            SortOrder: 'Descending',
            Recursive: 'true',
            GroupItems: 'false',
            EnableUserData: 'true',
            Fields: 'UserData,DatePlayed,LastPlayedDate',
            IncludeItemTypes: 'Movie,Episode,Audio,MusicVideo,Video',
            Limit: '50',
            api_key: token
        };
        const logStartedAt = Date.now();
        const logContext = { flow: options.flow || 'media', requestId: options.requestId || '', serverId: server.id, serverName: server.name, maxBases, maxProfiles, maxEndpoints, timeoutMs, clientProfile: successfulProfileId };
        const logMedia = async (stage, meta = {}) => {
            console.log('[trace] media.lastPlayed.api.stage', { ...logContext, stage, elapsedMs: Date.now() - logStartedAt, ...meta });
        };
        await logMedia('start', { baseCount: bases.length, includeItem, tokenPresent: Boolean(token), hasUserId: Boolean(userId) });
        for (const base of bases) {
            try {
                await logMedia('base.start', { base });
                const usageStats = await this.fetchUserUsageStatsLastPlayed(base, server, token, userId, { ...options, clientProfile: successfulProfileId, logMedia, debugEnabled });
                if (usageStats && usageStats.lastPlayedAt > latestPlayedAt) {
                    latestPlayedAt = usageStats.lastPlayedAt;
                    latestItem = usageStats.item;
                    successfulProfileId = usageStats.clientProfile || successfulProfileId;
                }
                if (usageStats && debugEnabled) debug.push(usageStats.debug);
                const endpoints = [
                    { label: 'played-items', path: '/Users/' + encodeURIComponent(userId) + '/Items?' + buildQuery({ ...baseItemsQuery, Filters: 'IsPlayed', Limit: '10' }), timeout: 8000 },
                    { label: 'resume', path: '/Users/' + encodeURIComponent(userId) + '/Items/Resume?' + buildQuery({ Limit: '50', Recursive: 'true', EnableUserData: 'true', Fields: 'UserData,DatePlayed,LastPlayedDate', IncludeItemTypes: 'Movie,Episode,Audio,MusicVideo,Video', api_key: token }), timeout: 5000 },
                    { label: 'latest-items', path: '/Users/' + encodeURIComponent(userId) + '/Items/Latest?' + buildQuery({ Limit: '50', Fields: 'UserData,DatePlayed,LastPlayedDate', IncludeItemTypes: 'Movie,Episode,Audio,MusicVideo,Video', api_key: token }), timeout: 8000 },
                    { label: 'user-profile', path: '/Users/' + encodeURIComponent(userId) + '?' + buildQuery({ api_key: token }), timeout: 5000 },
                    { label: 'all-items', path: '/Users/' + encodeURIComponent(userId) + '/Items?' + buildQuery(baseItemsQuery), timeout: 12000 }
                ].slice(0, maxEndpoints);
  
                for (const endpoint of endpoints) {
                    await logMedia('endpoint.start', { base, endpoint: endpoint.label });
                    for (const profile of this.getPreferredEmbyClientProfiles(server, successfulProfileId).slice(0, maxProfiles)) {
                        await logMedia('profile.start', { base, endpoint: endpoint.label, profile: profile.id });
                        try {
                            const response = await this.fetchWithTimeout(base + endpoint.path, { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile), env: options.env }, timeoutMs || endpoint.timeout);
                            if (!response.ok) {
                                const detail = await this.readShortResponse(response);
                                lastError = response.status === 401 ? '媒体库 Token 失效' : '最后播放时间读取失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                                await logMedia('profile.httpError', { base, endpoint: endpoint.label, profile: profile.id, status: response.status, error: lastError, responsePreview: detail });
                                if (debugEnabled) debug.push({ base, endpoint: endpoint.label, profile: profile.id, status: response.status, ok: false, itemCount: 0, latestParsedAt: 0, error: lastError, responsePreview: detail });
                                continue;
                            }
  
                            successfulProfileId = profile.id;
                            const responseText = await response.text();
                            const data = JSON.parse(responseText);
                            const items = endpoint.label === 'user-profile' ? [data] : (data && Array.isArray(data.Items) ? data.Items : (Array.isArray(data) ? data : []));
                            if (items[0] && !topCandidate && endpoint.label !== 'user-profile') topCandidate = { base, profile, item: items[0] };
                            const latest = collectLatestPlayedItem(items, latestPlayedAt, latestItem);
                            latestPlayedAt = latest.latestPlayedAt;
                            latestItem = latest.latestItem;
                            await logMedia('profile.done', { base, endpoint: endpoint.label, profile: profile.id, itemCount: items.length, latestPlayedAt: latest.endpointLatestPlayedAt, totalRecordCount: data && Number.isFinite(Number(data.TotalRecordCount)) ? Number(data.TotalRecordCount) : null });
                            if (debugEnabled) {
                                debug.push({
                                    base,
                                    endpoint: endpoint.label,
                                    profile: profile.id,
                                    status: response.status,
                                    ok: true,
                                    itemCount: items.length,
                                    totalRecordCount: data && Number.isFinite(Number(data.TotalRecordCount)) ? Number(data.TotalRecordCount) : null,
                                    latestParsedAt: latest.endpointLatestPlayedAt,
                                    latestItem: latest.endpointLatestItem,
                                    dataKeys: data && typeof data === 'object' ? Object.keys(data).slice(0, 20) : [],
                                    samples: items.slice(0, 3).map(buildDebugSample).filter(Boolean),
                                    responsePreview: responseText.slice(0, 500)
                                });
                            }
                            if (items[0] && items[0].Id && endpoint.label !== 'all-items' && endpoint.label !== 'user-profile') {
                                try {
                                    await logMedia('candidateDetail.start', { base, endpoint: endpoint.label, profile: profile.id });
                                    const detail = await this.fetchEmbyItemDetail(base, server, token, userId, items[0].Id, profile, options);
                                    const detailPlayedAt = extractPlayedAt(detail);
                                    if (detailPlayedAt > latestPlayedAt) {
                                        latestPlayedAt = detailPlayedAt;
                                        latestItem = this.normalizeLastPlayedItem(detail, detailPlayedAt);
                                        successfulProfileId = profile.id;
                                        await logMedia('candidateDetail.done', { base, endpoint: endpoint.label, detailPlayedAt });
                                    } else {
                                        await logMedia('candidateDetail.done', { base, endpoint: endpoint.label, detailPlayedAt });
                                    }
                                } catch(e) {
                                    await logMedia('candidateDetail.error', { base, endpoint: endpoint.label, error: e.message || String(e) });
                                    if (debugEnabled) debug.push({ endpoint: endpoint.label + '-candidate-detail', status: 0, ok: false, error: e.message || String(e) });
                                }
                            }
                            break;
                        } catch(e) {
                            lastError = e.name === 'AbortError' ? '最后播放时间读取超时' : (e.message || '最后播放时间读取失败');
                            await logMedia('profile.error', { base, endpoint: endpoint.label, profile: profile.id, error: lastError });
                            if (debugEnabled) debug.push({ base, endpoint: endpoint.label, profile: profile.id, status: 0, ok: false, itemCount: 0, latestParsedAt: 0, error: lastError });
                        }
                    }
                }
  
                const playbackReport = await this.fetchPlaybackReportingLastPlayed(base, server, token, userId, { ...options, clientProfile: successfulProfileId, logMedia, debugEnabled });
                if (playbackReport && playbackReport.lastPlayedAt > latestPlayedAt) {
                    latestPlayedAt = playbackReport.lastPlayedAt;
                    latestItem = playbackReport.item;
                    successfulProfileId = playbackReport.clientProfile || successfulProfileId;
                }
                if (playbackReport && debugEnabled) debug.push(playbackReport.debug);
            } catch(e) {
                lastError = e.name === 'AbortError' ? '最后播放时间读取超时' : (e.message || '最后播放时间读取失败');
                await logMedia('base.error', { base, error: lastError });
            }
        }
        if (topCandidate) {
            try {
                await logMedia('itemDetail.start', { base: topCandidate.base, profile: topCandidate.profile && topCandidate.profile.id ? topCandidate.profile.id : successfulProfileId });
                const detail = await this.fetchEmbyItemDetail(topCandidate.base, server, token, userId, topCandidate.item.Id, topCandidate.profile, options);
                const detailPlayedAt = extractPlayedAt(detail);
                if (detailPlayedAt >= latestPlayedAt) {
                    latestPlayedAt = detailPlayedAt;
                    latestItem = this.normalizeLastPlayedItem(detail, detailPlayedAt);
                    successfulProfileId = topCandidate.profile.id;
                }
                await logMedia('itemDetail.done', { base: topCandidate.base, detailPlayedAt, latestPlayedAt });
            } catch(e) {
                await logMedia('itemDetail.error', { error: e.message || String(e) });
                if (debugEnabled) debug.push({ endpoint: 'item-detail', status: 0, ok: false, error: e.message || String(e) });
            }
        }
        try {
            await logMedia('activity.start');
            const activity = await this.fetchEmbyActivityLastPlayed(server, token, userId, { clientProfile: successfulProfileId, maxBases, maxProfiles, timeoutMs, env: options.env });
            if (activity && Number(activity.lastPlayedAt) > latestPlayedAt) {
                latestPlayedAt = Number(activity.lastPlayedAt) || latestPlayedAt;
                latestItem = activity.item || latestItem;
                successfulProfileId = activity.clientProfile || successfulProfileId;
            }
            await logMedia('activity.done', { activityLastPlayedAt: activity && Number(activity.lastPlayedAt) || 0, latestPlayedAt });
        } catch(e) {
            await logMedia('activity.skip', { error: e.message || String(e) });
            if (debugEnabled) debug.push({ endpoint: 'activity-log', status: 0, ok: false, error: e.message || String(e) });
        }
        if (latestPlayedAt) {
            await logMedia('done', { lastPlayedAt: latestPlayedAt, hasItem: Boolean(latestItem), clientProfile: successfulProfileId, source: latestItem && latestItem.source ? latestItem.source : '' });
            return includeItem ? { lastPlayedAt: latestPlayedAt, item: latestItem, clientProfile: successfulProfileId, debug } : latestPlayedAt;
        }
        const error = new Error(lastError);
        error.debug = debug;
        await logMedia('error', { error: lastError, debugCount: debug.length });
        throw error;
    },

    async fetchUserUsageStatsLastPlayed(base, server, token, userId, options = {}) {
        const rawUserId = String(userId || '').trim();
        const maxProfiles = Math.max(1, Number(options.maxProfiles) || 10);
        const profiles = this.getPreferredEmbyClientProfiles(server, options.clientProfile).slice(0, maxProfiles);
        const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 8000);
        const logMedia = typeof options.logMedia === 'function' ? options.logMedia : async () => {};
        if (!/^[A-Za-z0-9_-]+$/.test(rawUserId)) {
            await logMedia('user-usage-stats.skip.invalidUserId', { base });
            return null;
        }
        const query = "SELECT MAX(DateCreated) AS LastPlayTime, SUM(PlayDuration - PauseDuration) / 60 AS WatchMinutes FROM PlaybackActivity WHERE UserId = '" + rawUserId + "' GROUP BY UserId";
        for (const profile of profiles) {
            await logMedia('user-usage-stats.start', { base, profile: profile.id });
            try {
                const response = await this.fetchWithTimeout(base + '/user_usage_stats/submit_custom_query', {
                    method: 'POST',
                    headers: this.buildEmbyClientHeaders(server, token, profile),
                    body: JSON.stringify({ CustomQueryString: query, ReplaceUserId: false }),
                    env: options.env
                }, timeoutMs);
                if (!response.ok) {
                    const detail = await this.readShortResponse(response);
                    await logMedia('user-usage-stats.httpError', { base, profile: profile.id, status: response.status, responsePreview: detail });
                    continue;
                }
                const text = await response.text();
                const data = JSON.parse(text);
                const columns = data && Array.isArray(data.Columns) ? data.Columns : (data && Array.isArray(data.columns) ? data.columns : []);
                const rowGroups = [
                    Array.isArray(data) ? data : null,
                    data && Array.isArray(data.Items) ? data.Items : null,
                    data && Array.isArray(data.Results) ? data.Results : null,
                    data && Array.isArray(data.results) ? data.results : null,
                    data && Array.isArray(data.Rows) ? data.Rows : null,
                    data && Array.isArray(data.rows) ? data.rows : null
                ].filter(Boolean);
                let rows = rowGroups[0] || [];
                let rowColumns = columns;
                if (rows[0] && typeof rows[0] === 'object' && !Array.isArray(rows[0]) && (Array.isArray(rows[0].Rows) || Array.isArray(rows[0].rows))) {
                    rowColumns = Array.isArray(rows[0].Columns) ? rows[0].Columns : (Array.isArray(rows[0].columns) ? rows[0].columns : columns);
                    rows = rows[0].Rows || rows[0].rows || [];
                }
                const row = rows[0];
                if (!row) {
                    await logMedia('user-usage-stats.empty', { base, profile: profile.id });
                    return null;
                }
                const getColumnValue = (name, fallbackIndex) => {
                    if (Array.isArray(row)) {
                        const index = rowColumns.findIndex((column) => String(column || '').toLowerCase() === name.toLowerCase());
                        return row[index >= 0 ? index : fallbackIndex];
                    }
                    if (!row || typeof row !== 'object') return '';
                    return row[name] || row[name.charAt(0).toLowerCase() + name.slice(1)] || row[name.toUpperCase()] || '';
                };
                const lastPlayedAt = this.parseEmbyDate(getColumnValue('LastPlayTime', 0));
                if (!lastPlayedAt) {
                    await logMedia('user-usage-stats.mismatch', { base, profile: profile.id, keys: row && typeof row === 'object' ? Object.keys(row).slice(0, 20) : [] });
                    return null;
                }
                const watchMinutesValue = Number(getColumnValue('WatchMinutes', 1));
                const watchMinutes = Number.isFinite(watchMinutesValue) ? watchMinutesValue : null;
                const item = { id: '', name: '', type: 'UserUsageStats', playedAt: lastPlayedAt, source: 'user-usage-stats', watchMinutes };
                await logMedia('user-usage-stats.done', { base, profile: profile.id, lastPlayedAt, watchMinutes });
                return { lastPlayedAt, clientProfile: profile.id, item, debug: { endpoint: 'user-usage-stats', ok: true, latestParsedAt: lastPlayedAt, latestItem: item } };
            } catch(e) {
                await logMedia('user-usage-stats.error', { base, profile: profile.id, error: e.message || String(e) });
            }
        }
        return null;
    },

    async fetchPlaybackReportingLastPlayed(base, server, token, userId, options = {}) {
        const cleanUserId = this.normalizeEmbyUserId(userId);
        if (!cleanUserId) return null;
        const profile = this.getPreferredEmbyClientProfiles(server, options.clientProfile)[0];
        const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 8000);
        const logMedia = typeof options.logMedia === 'function' ? options.logMedia : async () => {};
        const query = new URLSearchParams({ user_id: cleanUserId, aggregate_data: 'false', days: String(Math.max(7, Number(options.playbackReportDays) || 90)), filter: 'Movie,Episode,Audio,MusicVideo,Video', api_key: token });
        const endpoints = [
            { label: 'playback-report-playlist', path: '/user_usage_stats/UserPlaylist?' + query.toString() },
            { label: 'playback-report-user-activity', path: '/user_usage_stats/user_activity?' + new URLSearchParams({ days: String(Math.max(7, Number(options.playbackReportDays) || 90)), api_key: token }).toString() }
        ];
        let best = null;
        for (const endpoint of endpoints) {
            await logMedia(endpoint.label + '.start', { base, userId: cleanUserId });
            try {
                const response = await this.fetchWithTimeout(base + endpoint.path, { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile), env: options.env }, timeoutMs);
                if (!response.ok) {
                    const detail = await this.readShortResponse(response);
                    await logMedia(endpoint.label + '.httpError', { base, status: response.status, responsePreview: detail });
                    continue;
                }
                const text = await response.text();
                const data = JSON.parse(text);
                const rows = Array.isArray(data) ? data : (data && Array.isArray(data.Items) ? data.Items : []);
                for (const row of rows) {
                    const rowUserId = this.normalizeEmbyUserId(row.user_id || row.UserId || row.userId || '');
                    if (rowUserId && rowUserId !== cleanUserId) continue;
                    const playedAt = endpoint.label === 'playback-report-user-activity'
                        ? this.parseEmbyDate(row.latest_date || row.LatestDate || row.date || row.Date || '')
                        : this.parsePlaybackReportDate(row.date || row.PlayDate || row.DateCreated || '', row.time || row.PlayTime || '');
                    if (!playedAt || (best && playedAt <= best.lastPlayedAt)) continue;
                    best = {
                        lastPlayedAt: playedAt,
                        clientProfile: profile.id,
                        item: {
                            id: String(row.item_id || row.itemId || row.item_id || row.ItemId || ''),
                            name: String(row.item_name || row.itemName || row.item_name || row.ItemName || row.item_name || ''),
                            type: String(row.item_type || row.itemType || row.ItemType || ''),
                            seriesName: '',
                            seasonName: '',
                            indexNumber: null,
                            playedPercentage: null,
                            playedAt,
                            source: 'playback-reporting'
                        }
                    };
                }
                await logMedia(endpoint.label + '.done', { base, rowCount: rows.length, latestPlayedAt: best ? best.lastPlayedAt : 0 });
            } catch(e) {
                await logMedia(endpoint.label + '.error', { base, error: e.message || String(e) });
            }
        }
        return best ? { ...best, debug: { endpoint: 'playback-reporting', ok: true, latestParsedAt: best.lastPlayedAt, latestItem: best.item } } : null;
    },
  
    normalizeLastPlayedItem(item, playedAt = 0) {
        if (!item || typeof item !== 'object') return null;
        const userData = item.UserData || {};
        return {
            id: String(item.Id || item.id || ''),
            name: String(item.Name || item.Name || item.UserName || item.Name || ''),
            type: String(item.Type || item.type || 'UserActivity'),
            seriesName: String(item.SeriesName || ''),
            seasonName: String(item.SeasonName || ''),
            indexNumber: Number.isFinite(Number(item.IndexNumber)) ? Number(item.IndexNumber) : null,
            playedPercentage: Number.isFinite(Number(userData.PlayedPercentage)) ? Number(userData.PlayedPercentage) : null,
            playedAt: Number(playedAt) || 0,
            source: item.LastActivityDate || item.DateLastActivity ? 'user-activity' : 'emby-userdata'
        };
    },
  
    async fetchEmbyItemDetail(base, server, token, userId, itemId, profile, options = {}) {
        if (!itemId) throw new Error('缺少 ItemId');
        const query = 'Fields=' + encodeURIComponent('DatePlayed,UserData,LastPlayedDate') + '&api_key=' + encodeURIComponent(token);
        const path = '/Users/' + encodeURIComponent(userId) + '/Items/' + encodeURIComponent(itemId) + '?' + query;
        const response = await this.fetchWithTimeout(base + path, { method: 'GET', headers: this.buildEmbyClientHeaders(server, token, profile), env: options.env }, 8000);
        if (!response.ok) throw new Error('条目详情读取失败 HTTP ' + response.status);
        return response.json();
    },

  getShanghaiDayKey(time = Date.now(), offsetDays = 0) {
        const shanghaiTime = time + (8 * 60 * 60 * 1000) + (offsetDays * 24 * 60 * 60 * 1000);
        return new Date(shanghaiTime).toISOString().slice(0, 10);
    },
  
    getShanghaiClock(time = Date.now()) {
        const shanghaiTime = time + (8 * 60 * 60 * 1000);
        const date = new Date(shanghaiTime);
        return { hour: date.getUTCHours(), minute: date.getUTCMinutes() };
    },
  
    buildDailyMediaStats(media, counts, now = Date.now()) {
        const todayKey = this.getShanghaiDayKey(now);
        const yesterdayKey = this.getShanghaiDayKey(now, -1);
        const countsWithTime = { ...counts, time: counts.time || now };
        let todayCounts = media.todayCounts || null;
        let yesterdayCounts = media.yesterdayCounts || (!todayCounts ? (media.previousCounts || null) : null);
  
        if (media.dailyKey && media.dailyKey !== todayKey) {
            yesterdayCounts = media.dailyKey === yesterdayKey && todayCounts ? todayCounts : null;
            todayCounts = countsWithTime;
        } else if (!todayCounts) { todayCounts = countsWithTime; }
  
        const baseline = yesterdayCounts || null;
        const dailyDelta = baseline ? { movie: countsWithTime.movie - baseline.movie, series: countsWithTime.series - baseline.series, episode: countsWithTime.episode - baseline.episode, time: countsWithTime.time } : { movie: 0, series: 0, episode: 0, time: countsWithTime.time };
  
        return { todayCounts, yesterdayCounts, dailyDelta, dailyKey: todayKey };
    },
  
    async verifyWithLoginState(server) {
        const media = server.mediaStats || {};
        if (!media.enabled) return null;
        const start = Date.now();
        if (!media.accessToken && !media.username) return null;
        try {
            if (media.accessToken) await this.fetchEmbyMediaCounts(server, media.accessToken);
            else await this.loginEmbyForMedia(server);
            return { ok: true, latency: Date.now() - start };
        } catch(e) {
            const message = String(e.message || '');
            if (message.includes('Token 失效') && media.username) {
                try {
                    await this.loginEmbyForMedia(server);
                    return { ok: true, latency: Date.now() - start };
                } catch(loginError) {
                    const loginMessage = String(loginError.message || '');
                    if (loginMessage.includes('账号或密码错误') || loginMessage.includes('HTTP 401')) return { ok: true, latency: Date.now() - start };
                }
            }
            if (message.includes('账号或密码错误') || message.includes('HTTP 401')) return { ok: true, latency: Date.now() - start };
            return { ok: false, latency: Date.now() - start };
        }
    },
  
    async fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
        const env = options.env || null;
        const cleanOptions = { ...options };
        delete cleanOptions.env;
        const proxied = await this.fetchViaEgressProxy(url, cleanOptions, timeoutMs, env);
        if (proxied) return proxied;
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), timeoutMs);
        try { return await fetch(url, { ...cleanOptions, signal: c.signal }); } finally { clearTimeout(t); }
    },

    extractEmbyServerName(data) {
        if (!data || typeof data !== 'object') return '';
        const candidates = [
            data.ServerName,
            data.Name,
            data.SystemInfo && data.SystemInfo.ServerName,
            data.SystemInfo && data.SystemInfo.Name
        ];
        for (const value of candidates) {
            const name = String(value || '').trim();
            if (name) return name.slice(0, 80);
        }
        return '';
    },

    shouldUseRemoteServerName(server, remoteName) {
        const name = String(server && server.name ? server.name : '').trim();
        if (!remoteName || !name) return Boolean(remoteName);
        const parsed = this.normalizeServerUrl(server && server.url ? server.url : '');
        const hostname = parsed ? parsed.hostname.toLowerCase() : '';
        const normalizedName = name.toLowerCase();
        return normalizedName === hostname || normalizedName === hostname.replace(/^emby\./, '');
    },

    async probeEmbyServer(server, targetUrl, options = {}) {
        const headers = { 'Accept': 'application/json,text/plain,*/*', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' };
        const primaryPath = '/System/Info/Public';
        const fallbackPaths = ['/emby/System/Info/Public', '/emby/Users/Public'];
        const timeoutMs = Math.max(1000, Number(options.timeoutMs) || 12000);
        const paths = options.singlePath ? [primaryPath] : [primaryPath, ...fallbackPaths];
        const start = Date.now();
        const probePath = async (path) => {
            try {
                const response = await this.fetchWithTimeout(targetUrl + path, { method: 'GET', headers, env: options.env }, timeoutMs);
                if (response.status >= 200 && response.status < 400) {
                    let serverName = '';
                    if (path.includes('/System/Info')) {
                        try { serverName = this.extractEmbyServerName(await response.clone().json()); } catch(e) {}
                    }
                    return { ok: true, latency: Date.now() - start, serverName };
                }
                if (response.status === 401 || response.status === 403) return { ok: true, latency: Date.now() - start };
                return { ok: false, latency: 0 };
            } catch(e) {
                return { ok: false, latency: 0 };
            }
        };
        for (const path of paths) {
            const result = await probePath(path);
            if (result.ok) return result;
        }
        return { ok: false, latency: 0 };
    },
  
    getProbeTargets(server) {
        const targets = [];
        const seen = new Set();
        for (const value of [server.url, ...(Array.isArray(server.fallbackUrls) ? server.fallbackUrls : [])]) {
            const parsed = this.normalizeServerUrl(value);
            if (!parsed) continue;
            const targetUrl = parsed.toString().replace(/\/$/, '');
            const key = targetUrl.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            targets.push(targetUrl);
            if (targets.length >= 5) break;
        }
        return targets;
    },
  
    async probeEmbyServerWithFallbacks(server, options = {}) {
        const targets = options.singleTarget ? this.getProbeTargets(server).slice(0, 1) : this.getProbeTargets(server);
        const addressProbeResults = [];
        for (const targetUrl of targets) {
            let result = { ok: false, latency: 0 };
            try {
                result = await this.probeEmbyServer(server, targetUrl, options);
            } catch(e) {}
            addressProbeResults.push({ url: targetUrl, ok: Boolean(result.ok), latency: Number(result.latency) || 0, serverName: String(result.serverName || '') });
            if (result.ok) {
                return { ok: true, latency: Number(result.latency) || 0, serverName: String(result.serverName || ''), addressProbeResults };
            }
        }
        return { ok: false, latency: 0, addressProbeResults };
    },
  
    async refreshMediaStatsIfNeeded(server, force = false, options = {}) {
        const media = server.mediaStats || {};
        server.mediaStatsTouched = false;
        const logStartedAt = Date.now();
        const logContext = { flow: options.flow || 'probe', requestId: options.requestId || '', serverId: server.id, serverName: server.name, limited: Boolean(options.limited), force: Boolean(force) };
        const logMedia = async (stage, meta = {}) => {
            console.log('[trace] media.counts.stage', { ...logContext, stage, elapsedMs: Date.now() - logStartedAt, ...meta });
        };
        if (!media.enabled) {
            await logMedia('skip.disabled');
            return server;
        }
        const now = Date.now();
        const todayKey = this.getShanghaiDayKey(now);
        const needsDailySnapshot = media.dailyKey !== todayKey || !media.todayCounts || !media.dailyDelta;
        if (!force && !needsDailySnapshot) {
            await logMedia('skip.upToDate', { dailyKey: media.dailyKey || '', todayKey });
            return server;
        }
        server.mediaStatsTouched = true;
        const limited = Boolean(options.limited);
        const baseApiOptions = options.env ? { env: options.env } : {};
        const limitedApiOptions = limited ? { ...baseApiOptions, maxBases: 1, maxProfiles: 1, maxAttempts: 1, timeoutMs: 2000 } : baseApiOptions;
  
        try {
            await logMedia('start', { hasToken: Boolean(media.accessToken), hasUserId: Boolean(media.userId), hasUsername: Boolean(media.username), limitedApiOptions });
            let token = media.accessToken;
            let userId = media.userId || '';
            let clientProfile = media.clientProfile || '';
            let counts;
            try {
                if (!token) {
                    await logMedia('login.start');
                    const login = await this.loginEmbyForMedia(server, limitedApiOptions);
                    token = login.accessToken;
                    userId = login.userId || userId;
                    clientProfile = login.clientProfile || clientProfile;
                    await logMedia('login.done', { hasToken: Boolean(token), hasUserId: Boolean(userId), clientProfile });
                }
                await logMedia('counts.request.start', { clientProfile });
                counts = await this.fetchEmbyMediaCounts({ ...server, mediaStats: { ...media, clientProfile } }, token, { clientProfile, ...limitedApiOptions });
                clientProfile = counts.clientProfile || clientProfile;
                await logMedia('counts.request.done', { clientProfile, counts: { movie: counts.movie, series: counts.series, episode: counts.episode } });
            } catch(e) {
                await logMedia('primary.error', { error: e.message || String(e), limited });
                if (limited) throw e;
                await logMedia('retry.login.start');
                const login = await this.loginEmbyForMedia(server, baseApiOptions);
                token = login.accessToken;
                userId = login.userId || userId;
                clientProfile = login.clientProfile || clientProfile;
                await logMedia('retry.login.done', { hasToken: Boolean(token), hasUserId: Boolean(userId), clientProfile });
                await logMedia('retry.counts.request.start', { clientProfile });
                counts = await this.fetchEmbyMediaCounts({ ...server, mediaStats: { ...media, clientProfile } }, token, { clientProfile, ...baseApiOptions });
                clientProfile = counts.clientProfile || clientProfile;
                await logMedia('retry.counts.request.done', { clientProfile, counts: { movie: counts.movie, series: counts.series, episode: counts.episode } });
            }
            const dailyStats = this.buildDailyMediaStats(media, counts, now);
            const previous = dailyStats.yesterdayCounts || media.previousCounts || null;
            const remoteName = await this.fetchEmbyServerName({ ...server, mediaStats: { ...media, clientProfile } }, token, { clientProfile, ...limitedApiOptions });
            if (remoteName) {
                server.remoteName = remoteName;
                if (this.shouldUseRemoteServerName(server, remoteName)) server.name = remoteName;
            }
            server.mediaStats = {
                ...media, accessToken: token, userId, clientProfile, previousCounts: previous, counts, todayCounts: dailyStats.todayCounts, yesterdayCounts: dailyStats.yesterdayCounts, dailyDelta: dailyStats.dailyDelta, dailyKey: dailyStats.dailyKey,
                delta24h: previous ? { movie: counts.movie - previous.movie, series: counts.series - previous.series, episode: counts.episode - previous.episode, time: counts.time } : { movie: 0, series: 0, episode: 0, time: counts.time },
                lastCheck: counts.time, lastError: ''
            };
            await logMedia('done', { lastCheck: counts.time, dailyKey: dailyStats.dailyKey });
        } catch(e) {
            await logMedia('error', { error: e.message || '媒体库统计失败' });
            server.mediaStats = { ...media, lastCheck: now, lastError: e.message || '媒体库统计失败' };
        }
        return server;
    },
  
    async refreshServerLastPlayed(server, now = Date.now(), options = {}) {
        const media = server.mediaStats || {};
        const logStartedAt = Date.now();
        const logContext = { flow: options.flow || 'probe', requestId: options.requestId || '', serverId: server.id, serverName: server.name, limited: Boolean(options.limited) };
        const logLastPlayed = async (stage, meta = {}) => {
            console.log('[trace] media.lastPlayed.stage', { ...logContext, stage, elapsedMs: Date.now() - logStartedAt, ...meta });
        };
        if (!media.enabled) {
            await logLastPlayed('skip.disabled');
            return { server, touched: false };
        }
        let token = media.accessToken || '';
        let userId = media.userId || '';
        let clientProfile = media.clientProfile || '';
        const limited = Boolean(options.limited);
        const baseApiOptions = options.env ? { env: options.env } : {};
        const limitedApiOptions = limited ? { ...baseApiOptions, maxBases: 1, maxProfiles: 1, maxAttempts: 1, maxEndpoints: 3, timeoutMs: 10000 } : baseApiOptions;
        try {
            await logLastPlayed('start', { hasToken: Boolean(token), hasUserId: Boolean(userId), hasUsername: Boolean(media.username), clientProfile, limitedApiOptions });
            if (!token || !userId) {
                await logLastPlayed('login.start');
                const login = await this.loginEmbyForMedia(server, limitedApiOptions);
                token = login.accessToken;
                userId = login.userId || userId;
                clientProfile = login.clientProfile || clientProfile;
                await logLastPlayed('login.done', { hasToken: Boolean(token), hasUserId: Boolean(userId), clientProfile });
            }
            await logLastPlayed('request.start', { clientProfile });
            const result = await this.fetchEmbyLastPlayed({ ...server, mediaStats: { ...media, clientProfile } }, token, userId, { includeItem: true, clientProfile, ...limitedApiOptions });
            await logLastPlayed('request.done', { lastPlayedAt: Number(result.lastPlayedAt) || 0, itemName: result.item && result.item.name ? result.item.name : '', clientProfile: result.clientProfile || clientProfile });
            const previousLastPlayedAt = Number(media.lastPlayedAt) || 0;
            const resultLastPlayedAt = Number(result.lastPlayedAt) || 0;
            const lastPlayedAt = Math.max(resultLastPlayedAt, previousLastPlayedAt);
            const nextKeepAlive = media.keepAlive ? { ...media.keepAlive } : media.keepAlive;
            if (nextKeepAlive && nextKeepAlive.enabled) {
                const previousPlayedAt = Number(nextKeepAlive.lastPlayedAt) || 0;
                if (lastPlayedAt && lastPlayedAt > previousPlayedAt) nextKeepAlive.alertSentAt = 0;
                nextKeepAlive.lastPlayedAt = lastPlayedAt || previousPlayedAt;
                nextKeepAlive.lastCheckedAt = now;
            }
            return {
                server: {
                    ...server,
                    mediaStats: {
                        ...media,
                        accessToken: token,
                        userId,
                        clientProfile: result.clientProfile || clientProfile,
                        lastPlayedAt,
                        lastPlayedCheck: now,
                        lastPlayedError: '',
                        lastPlayedItem: resultLastPlayedAt >= previousLastPlayedAt ? (result.item || media.lastPlayedItem || null) : (media.lastPlayedItem || result.item || null),
                        keepAlive: nextKeepAlive || media.keepAlive
                    }
                },
                touched: true
            };
        } catch(e) {
            await logLastPlayed('error', { error: e.message || '最后播放时间读取失败', debug: e.debug || [] });
            return {
                server: {
                    ...server,
                    mediaStats: {
                        ...media,
                        accessToken: token,
                        userId,
                        clientProfile,
                        lastPlayedCheck: now,
                        lastPlayedError: e.message || '最后播放时间读取失败'
                    }
                },
                touched: true
            };
        }
    },
  
    shuffleList(values) {
        const items = Array.isArray(values) ? values.slice() : [];
        for (let index = items.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            const temp = items[index];
            items[index] = items[swapIndex];
            items[swapIndex] = temp;
        }
        return items;
    },
  
    async refreshAllLastPlayedIfRequested(config, options = {}) {
        const cleanConfig = this.sanitizeConfig(config);
        const transient = {
            nextCursor: Number(config && config.nextCursor) || 0,
            hasMore: Boolean(config && config.hasMore)
        };
        const now = Date.now();
        const scheduledTime = Number(options.scheduledTime) || now;
        const source = options.source === 'manual' ? 'manual' : 'scheduled';
        const todayKey = this.getShanghaiDayKey(scheduledTime);
        const isDockerScheduled = source === 'scheduled' && Boolean(options.env && options.env.RUNTIME_ENV === 'docker');
        const shanghaiClock = this.getShanghaiClock(scheduledTime);
        const isShanghaiMidnightRun = shanghaiClock.hour === 0 && shanghaiClock.minute === 0;
        const shouldRunManual = source === 'manual' && Boolean(options.refreshLastPlayed);
        const targets = cleanConfig.servers.filter((server) => server.mediaStats && server.mediaStats.enabled);
        if (source === 'manual' && !shouldRunManual) return cleanConfig;
        if (!targets.length) {
            return {
                ...cleanConfig,
                ...transient,
                lastPlayedDailyKey: source === 'scheduled' ? todayKey : cleanConfig.lastPlayedDailyKey,
                lastPlayedQueueDayKey: source === 'scheduled' ? todayKey : cleanConfig.lastPlayedQueueDayKey,
                lastPlayedQueue: []
            };
        }
        const targetIds = new Set(targets.map((server) => String(server.id)));
        let selectedTargets = [];
        let nextQueue = [];
        let nextQueueDayKey = cleanConfig.lastPlayedQueueDayKey || '';
        let nextDailyKey = cleanConfig.lastPlayedDailyKey || '';
        const targetById = new Map(targets.map((server) => [String(server.id), server]));
  
        if (source === 'scheduled') {
            const hasPendingQueue = isDockerScheduled && nextQueueDayKey === todayKey && Array.isArray(cleanConfig.lastPlayedQueue) && cleanConfig.lastPlayedQueue.length > 0;
            if (isDockerScheduled && !isShanghaiMidnightRun && !hasPendingQueue) {
                return cleanConfig;
            }
            if (nextDailyKey === todayKey && (!Array.isArray(cleanConfig.lastPlayedQueue) || cleanConfig.lastPlayedQueue.length === 0)) {
                return cleanConfig;
            }
            let queue = nextQueueDayKey === todayKey && Array.isArray(cleanConfig.lastPlayedQueue)
                ? cleanConfig.lastPlayedQueue.map((value) => String(value || '')).filter((value) => targetIds.has(value))
                : [];
            if (!queue.length) {
                if (nextDailyKey === todayKey) {
                    return {
                        ...cleanConfig,
                        ...transient,
                        lastPlayedQueueDayKey: todayKey,
                        lastPlayedQueue: []
                    };
                }
                queue = this.shuffleList(Array.from(targetIds));
                nextQueueDayKey = todayKey;
            }
            if (isDockerScheduled) {
                selectedTargets = queue.map((value) => targetById.get(String(value))).filter(Boolean);
                nextQueue = [];
            } else {
                const nextServerId = String(queue[0] || '');
                selectedTargets = targets.filter((server) => String(server.id) === nextServerId).slice(0, 1);
                nextQueue = queue.slice(1);
            }
            if (!selectedTargets.length) {
                return {
                    ...cleanConfig,
                    ...transient,
                    lastPlayedQueueDayKey: nextQueueDayKey,
                    lastPlayedQueue: nextQueue
                };
            }
            if (!isDockerScheduled && nextQueue.length === 0) nextDailyKey = todayKey;
        } else {
            const rawCursor = Number(options.cursor) || 0;
            const cursor = rawCursor >= targets.length ? 0 : Math.max(0, rawCursor);
            selectedTargets = targets.slice(cursor, cursor + 1);
            nextQueue = cleanConfig.lastPlayedQueue || [];
        }
  
        const requestId = 'daily-' + now.toString(36);
        const telegramEnabled = this.isTelegramEnabled(options.env, cleanConfig);
        const notifyQueue = [];
        const results = await this.mapWithConcurrency(selectedTargets, 1, async (server) => {
            let nextServer = await this.refreshMediaStatsIfNeeded(server, true, { limited: true, env: options.env, logConfig: cleanConfig, requestId, flow: 'scheduled-daily' });
            const lastPlayedResult = await this.refreshServerLastPlayed(nextServer, now, { limited: true, env: options.env, logConfig: cleanConfig, requestId, flow: 'scheduled-daily' });
            if (lastPlayedResult && lastPlayedResult.touched) nextServer = lastPlayedResult.server;
            const keepAliveResult = await this.refreshKeepAliveIfNeeded(nextServer, now, { refreshLastPlayed: false, env: options.env, logConfig: cleanConfig, requestId, flow: 'scheduled-daily' });
            if (keepAliveResult && keepAliveResult.touched) nextServer = keepAliveResult.server;
            if (keepAliveResult && keepAliveResult.alert && telegramEnabled) notifyQueue.push({ ...keepAliveResult.alert, kind: 'keepAlive' });
            return nextServer;
        });
        if (notifyQueue.length) {
            const sendResults = await Promise.all(notifyQueue.map((item) => this.sendTelegram(options.env, item.message, cleanConfig)));
            for (const [index, ok] of sendResults.entries()) {
                const item = notifyQueue[index];
                if (!ok || !item) continue;
                const target = results.find((server) => server && String(server.id) === String(item.serverId));
                if (target && target.mediaStats && target.mediaStats.keepAlive) {
                    target.mediaStats = { ...target.mediaStats, keepAlive: { ...target.mediaStats.keepAlive, alertSentAt: item.checkedAt || Date.now() } };
                }
            }
        }
        const byId = new Map(results.filter(Boolean).map((server) => [String(server.id), server]));
        if (isDockerScheduled) {
            const unresolvedIds = selectedTargets
                .map((server) => String(server.id))
                .filter((serverId) => {
                    const refreshed = byId.get(serverId);
                    const media = refreshed && refreshed.mediaStats ? refreshed.mediaStats : null;
                    return !media || media.dailyKey !== todayKey;
                });
            nextQueue = unresolvedIds;
            nextQueueDayKey = todayKey;
            nextDailyKey = unresolvedIds.length === 0 ? todayKey : '';
        }
        return {
            ...cleanConfig,
            ...transient,
            updatedAt: Math.max(cleanConfig.updatedAt || 0, now),
            lastPlayedDailyKey: source === 'scheduled' ? nextDailyKey : cleanConfig.lastPlayedDailyKey,
            lastPlayedQueueDayKey: source === 'scheduled' ? nextQueueDayKey : cleanConfig.lastPlayedQueueDayKey,
            lastPlayedQueue: source === 'scheduled' ? nextQueue : cleanConfig.lastPlayedQueue,
            servers: cleanConfig.servers.map((server) => byId.get(String(server.id)) || server)
        };
    },
  
    getKeepAliveState(server, now = Date.now()) {
        const keepAlive = server && server.mediaStats ? server.mediaStats.keepAlive : null;
        if (!keepAlive || !keepAlive.enabled) return { enabled: false, label: '保号', tone: 'disabled', days: null };
        const periodDays = Math.max(1, Math.floor(Number(keepAlive.periodDays) || 30));
        const lastPlayedAt = Number(keepAlive.lastPlayedAt) || 0;
        if (!lastPlayedAt) return { enabled: true, label: '保号', tone: 'warning', days: null };
        const inactiveDays = Math.max(0, Math.floor((now - lastPlayedAt) / (24 * 60 * 60 * 1000)));
        const remainingDays = periodDays - inactiveDays;
        if (remainingDays < 0) return { enabled: true, label: '!逾期', tone: 'danger', days: remainingDays };
        if (remainingDays <= 3) return { enabled: true, label: '!' + remainingDays + '天', tone: 'warning', days: remainingDays };
        return { enabled: true, label: remainingDays + '天', tone: 'ok', days: remainingDays };
    },
  
    buildKeepAliveMessage(server, keepAlive, inactiveDays, lastPlayedAt) {
        const periodDays = Math.max(1, Math.floor(Number(keepAlive.periodDays) || 30));
        const remainingDays = periodDays - inactiveDays;
        const lastPlayedText = lastPlayedAt ? new Date(lastPlayedAt).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }) : '未知';
        return [
            '⚠️ 保号提醒',
            '',
            '服务器：' + (server.name || server.url || 'Unknown'),
            '',
            '已有 ' + inactiveDays + ' 天未播放',
            '',
            '活跃周期：' + periodDays + ' 天',
            '',
            '距账号删除还剩：' + remainingDays + ' 天',
            '',
            '最后播放：' + lastPlayedText,
            '',
            '请尽快播放任意内容以保留账号。'
        ].join('\n');
    },
  
    getGrowthLeaderboardRows(config, limit = 5) {
        const items = Array.isArray(config && config.servers) ? config.servers : [];
        return items
            .filter((server) => server && server.mediaStats && server.mediaStats.enabled && server.mediaStats.counts)
            .map((server) => {
                const media = server.mediaStats || {};
                const delta = media.dailyDelta || media.delta24h || {};
                const movie = Number.isFinite(Number(delta.movie)) ? Number(delta.movie) : 0;
                const series = Number.isFinite(Number(delta.series)) ? Number(delta.series) : 0;
                const episode = Number.isFinite(Number(delta.episode)) ? Number(delta.episode) : 0;
                const total = movie + series + episode;
                const counts = media.counts || {};
                const currentTotal = (Number.isFinite(Number(counts.movie)) ? Number(counts.movie) : 0) + (Number.isFinite(Number(counts.series)) ? Number(counts.series) : 0) + (Number.isFinite(Number(counts.episode)) ? Number(counts.episode) : 0);
                return {
                    server,
                    sortValue: total,
                    currentValue: currentTotal,
                    deltas: { movie, series, episode }
                };
            })
            .sort((a, b) => {
                if (b.sortValue !== a.sortValue) return b.sortValue - a.sortValue;
                if (b.currentValue !== a.currentValue) return b.currentValue - a.currentValue;
                return String(a.server.name || '').localeCompare(String(b.server.name || ''), 'zh-Hans-CN');
            })
            .slice(0, Math.max(0, Math.floor(Number(limit) || 5)));
    },
  
    buildGrowthLeaderboardMessage(rows, dayKey = '') {
        const items = Array.isArray(rows) ? rows.slice(0, 5) : [];
        const formatSigned = (value) => {
            const count = Number.isFinite(Number(value)) ? Number(value) : 0;
            return (count > 0 ? '+' : '') + String(count);
        };
        const lines = items.length ? items.map((row, index) => {
            const serverName = row && row.server && row.server.name ? String(row.server.name) : 'Unknown';
            const total = Number.isFinite(Number(row && row.sortValue)) ? Number(row.sortValue) : 0;
            const current = Number.isFinite(Number(row && row.currentValue)) ? Number(row.currentValue) : 0;
            const deltas = row && row.deltas ? row.deltas : {};
            return [
                (index + 1) + '. ' + serverName,
                '总增长 ' + formatSigned(total),
                '电影 ' + formatSigned(deltas.movie) + ' / 剧集 ' + formatSigned(deltas.series) + ' / 单集 ' + formatSigned(deltas.episode),
                '当前总量 ' + current.toLocaleString('zh-CN')
            ].join('\n');
        }).join('\n\n') : ['暂无可发送的增长数据'].join('\n');
        return [
            '📈 每日资源增长榜单',
            dayKey ? '日期：' + dayKey : '',
            '前五：',
            '',
            lines
        ].filter(Boolean).join('\n');
    },
  
    async refreshKeepAliveIfNeeded(server, now = Date.now(), options = {}) {
        const media = server.mediaStats || {};
        const keepAlive = media.keepAlive || {};
        const logStartedAt = Date.now();
        const logContext = { flow: options.flow || 'probe', requestId: options.requestId || '', serverId: server.id, serverName: server.name, refreshLastPlayed: options.refreshLastPlayed !== false };
        const logKeepAlive = async (stage, meta = {}) => {
            console.log('[trace] media.keepAlive.stage', { ...logContext, stage, elapsedMs: Date.now() - logStartedAt, ...meta });
        };
        if (!keepAlive.enabled) {
            await logKeepAlive('skip.disabled');
            return { server, alert: null, touched: false };
        }
        const nextKeepAlive = { ...keepAlive, lastCheckedAt: now };
        let token = media.accessToken || '';
        let userId = media.userId || '';
        try {
            await logKeepAlive('start', { lastPlayedAt: Number(media.lastPlayedAt) || 0, lastPlayedCheck: Number(media.lastPlayedCheck) || 0 });
            let nextMedia = media;
            let lastPlayedAt = Number(media.lastPlayedAt) || 0;
            if (options.refreshLastPlayed !== false && (!lastPlayedAt || now - (Number(media.lastPlayedCheck) || 0) > 24 * 60 * 60 * 1000)) {
                await logKeepAlive('lastPlayed.refresh.start');
                const refreshed = await this.refreshServerLastPlayed(server, now, { env: options.env, logConfig: options.logConfig, requestId: options.requestId, flow: options.flow });
                await logKeepAlive('lastPlayed.refresh.done', { touched: Boolean(refreshed && refreshed.touched) });
                nextMedia = refreshed.server.mediaStats || media;
                token = nextMedia.accessToken || token;
                userId = nextMedia.userId || userId;
                lastPlayedAt = Number(nextMedia.lastPlayedAt) || 0;
            }
            const previousPlayedAt = Number(keepAlive.lastPlayedAt) || 0;
            if (lastPlayedAt && lastPlayedAt > previousPlayedAt) nextKeepAlive.alertSentAt = 0;
            nextKeepAlive.lastPlayedAt = lastPlayedAt || previousPlayedAt;
            const effectiveLastPlayedAt = nextKeepAlive.lastPlayedAt;
            const periodDays = Math.max(1, Math.floor(Number(nextKeepAlive.periodDays) || 30));
            const alertDays = Math.min(Math.max(1, Math.floor(Number(nextKeepAlive.alertDays) || 27)), Math.max(1, periodDays - 1));
            nextKeepAlive.periodDays = periodDays;
            nextKeepAlive.alertDays = alertDays;
            let alert = null;
            if (effectiveLastPlayedAt) {
                const inactiveDays = Math.max(0, Math.floor((now - effectiveLastPlayedAt) / (24 * 60 * 60 * 1000)));
                const canRepeat = !nextKeepAlive.alertSentAt || now - nextKeepAlive.alertSentAt >= 24 * 60 * 60 * 1000;
                if (inactiveDays >= alertDays && canRepeat) {
                    alert = { message: this.buildKeepAliveMessage(server, nextKeepAlive, inactiveDays, effectiveLastPlayedAt), serverId: server.id, checkedAt: now };
                }
            }
            await logKeepAlive('done', { effectiveLastPlayedAt, alert: Boolean(alert), periodDays, alertDays });
            return { server: { ...server, mediaStats: { ...nextMedia, accessToken: token, userId, keepAlive: nextKeepAlive } }, alert, touched: true };
        } catch(e) {
            await logKeepAlive('error', { error: e.message || String(e) });
            return { server: { ...server, mediaStats: { ...media, accessToken: token, userId, keepAlive: nextKeepAlive } }, alert: null, touched: true };
        }
    },
  
    async mapWithConcurrency(items, limit, mapper) {
        const list = Array.isArray(items) ? items : [];
        const concurrency = Math.max(1, Math.min(Number(limit) || 1, list.length || 1));
        const results = new Array(list.length);
        let nextIndex = 0;
        const workers = Array.from({ length: concurrency }, async () => {
            while (nextIndex < list.length) {
                const currentIndex = nextIndex;
                nextIndex += 1;
                results[currentIndex] = await mapper(list[currentIndex], currentIndex);
            }
        });
        await Promise.all(workers);
        return results;
    },
  
    async probeServerRuntimeState(env, server, forceMedia = false, options = {}) {
        const cleanServers = this.sanitizeConfig({ servers: [server] }, { skipHistoryNormalization: true }).servers;
        let s = cleanServers[0] || { ...server };
        const previousStatus = s.status;
        s.totalChecks = (s.totalChecks || 0) + 1;
        s.history = this.normalizeHistory(s.history, s.lastCheck);
        const checkedAt = Date.now();
  
        const limitedMedia = Boolean(options.limitedMedia);
        const recordLatency = options.recordLatency !== false;
        const skipMediaRefresh = Boolean(options.skipMediaRefresh);
        const probeTargets = limitedMedia ? this.getProbeTargets(s).slice(0, 1) : this.getProbeTargets(s);
        const needsMediaRefresh = Boolean(forceMedia);
  
        if (!probeTargets.length) {
            s.consecutiveFailures = Math.max(Number(s.consecutiveFailures) || 0, Number(this.OFFLINE_CONFIRMATION_THRESHOLD) || 2);
            s.firstFailureAt = Number(s.firstFailureAt) || checkedAt;
            s.status = 'offline'; s.latency = 0; s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
            s.addressProbeResults = [];
            if (s.history.length > this.HISTORY_LIMIT) s.history.splice(0, s.history.length - this.HISTORY_LIMIT);
            s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
            s.lastCheck = checkedAt; this.updateOfflineNotifyState(s, previousStatus, checkedAt);
            if (!skipMediaRefresh) await this.refreshMediaStatsIfNeeded(s, needsMediaRefresh, { limited: limitedMedia });
            s.previousStatus = previousStatus; return s;
        }
  
        let isAlive = false;
        let finalLatency = 0;
        let addressProbeResults = [];
  
        try {
            const result = await this.probeEmbyServerWithFallbacks(s, limitedMedia ? { env: options.env, singleTarget: true, singlePath: true, timeoutMs: 2000 } : { env: options.env });
            isAlive = result.ok; finalLatency = result.latency; addressProbeResults = result.addressProbeResults || [];
            if (result.serverName) {
                s.remoteName = result.serverName;
                if (this.shouldUseRemoteServerName(s, result.serverName)) s.name = result.serverName;
            }
        } catch(e) { isAlive = false; }
        if (!isAlive && Boolean(options.verifyWithLogin)) {
            const loginState = await this.verifyWithLoginState(s);
            if (loginState && loginState.ok) {
                isAlive = true;
                finalLatency = Number(loginState.latency) || finalLatency;
            }
        }
        if (!recordLatency) {
            finalLatency = 0;
            if (Array.isArray(addressProbeResults)) {
                for (let index = 0; index < addressProbeResults.length; index += 1) {
                    if (addressProbeResults[index]) addressProbeResults[index].latency = 0;
                }
            }
        }
        s.addressProbeResults = addressProbeResults;
  
        if (isAlive) {
            s.consecutiveFailures = 0; s.firstFailureAt = 0; s.successfulChecks = (s.successfulChecks || 0) + 1; s.status = 'online'; s.latency = finalLatency; s.history.push({ status: 'online', time: checkedAt, latency: finalLatency });
        } else {
            s.consecutiveFailures = (Number(s.consecutiveFailures) || 0) + 1;
            s.firstFailureAt = Number(s.firstFailureAt) || checkedAt;
            const failureWindowMs = checkedAt - s.firstFailureAt;
            const shouldConfirmOffline = previousStatus === 'offline' || (s.consecutiveFailures >= 1 && failureWindowMs >= (Number(this.OFFLINE_CONFIRMATION_WINDOW_MS) || 3 * 60 * 1000));
            if (shouldConfirmOffline) {
                s.status = 'offline'; s.latency = 0; s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
            } else {
                s.totalChecks = Math.max(0, (s.totalChecks || 0) - 1);
                s.status = previousStatus === 'online' ? 'online' : 'unknown';
                s.latency = Number.isFinite(Number(s.latency)) ? Math.max(0, Number(s.latency)) : 0;
            }
        }
  
        if (s.history.length > this.HISTORY_LIMIT) s.history.splice(0, s.history.length - this.HISTORY_LIMIT);
        s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
        s.lastCheck = checkedAt; this.updateOfflineNotifyState(s, previousStatus, checkedAt);
        if (!skipMediaRefresh) await this.refreshMediaStatsIfNeeded(s, needsMediaRefresh, { limited: limitedMedia, env, logConfig: options.logConfig, requestId: options.requestId, flow: options.flow });
        s.previousStatus = previousStatus; return s;
    },
  
    mergeProbedRuntimeFields(latest, probed) {
        if (!probed) return latest;
        return {
            ...latest,
            name: probed.name || latest.name,
            remoteName: probed.remoteName || latest.remoteName || '',
            status: probed.status,
            totalChecks: probed.totalChecks,
            successfulChecks: probed.successfulChecks,
            uptime: probed.uptime,
            latency: probed.latency,
            lastCheck: probed.lastCheck,
            offlineSince: probed.offlineSince,
            offlineAlertSentAt: probed.offlineAlertSentAt,
            consecutiveFailures: probed.consecutiveFailures || 0,
            firstFailureAt: probed.firstFailureAt || 0,
            addressProbeResults: probed.addressProbeResults || [],
            history: probed.history,
            mediaStats: probed.mediaStatsTouched ? probed.mediaStats : latest.mediaStats
        };
    },
  
    hasSameProbeConfig(a, b) {
        return Boolean(a && b && a.url === b.url && JSON.stringify(a.fallbackUrls || []) === JSON.stringify(b.fallbackUrls || []));
    },
  
    async runSingleProbeLogic(env, config, serverId, options = {}) {
        const cleanConfig = this.sanitizeConfig(config);
        const targetId = String(serverId || '');
        const target = cleanConfig.servers.find((server) => String(server.id) === targetId);
        if (!target) return { ok: false, status: 404, error: 'Server not found' };
  
        const probeStartedAt = Date.now();
        const requestId = 'single-' + probeStartedAt.toString(36) + '-' + targetId;
        const forceMedia = Boolean(options.forceMedia);
        const logStep = async (stage, meta = {}, logConfig = cleanConfig, level = 'debug') => {
            console.log('[trace] probe.single.stage', { requestId, serverId: target.id, serverName: target.name, stage, elapsedMs: Date.now() - probeStartedAt, ...meta });
        };
        await this.appendRuntimeLog(env, 'info', 'probe.single.start', '单体测速开始', { source: 'manual', requestId, forceMedia, refreshLastPlayed: Boolean(options.refreshLastPlayed), serverId: target.id, serverName: target.name }, { config: cleanConfig });
        try {
            await logStep('runtime.start', { limitedMedia: Boolean(options.refreshLastPlayed), hasMedia: Boolean(target.mediaStats && target.mediaStats.enabled) });
            const probed = await this.probeServerRuntimeState(env, target, forceMedia, { limitedMedia: Boolean(options.refreshLastPlayed) && !forceMedia, requestId, flow: 'single', logConfig: cleanConfig });
            await logStep('runtime.done', { status: probed.status, latency: probed.latency, failures: probed.consecutiveFailures || 0, addressCount: Array.isArray(probed.addressProbeResults) ? probed.addressProbeResults.length : 0 });
  
            await logStep('loadConfig.afterRuntime.start');
            const latestConfig = await this.loadConfig(env);
            await logStep('loadConfig.afterRuntime.done', { serverCount: Array.isArray(latestConfig.servers) ? latestConfig.servers.length : 0, revision: latestConfig.revision || '' });
            const baseConfig = this.sanitizeConfig(latestConfig);
            await logStep('sanitize.afterRuntime.done', { serverCount: baseConfig.servers.length, revision: baseConfig.revision || '' }, baseConfig);
            const latestTarget = baseConfig.servers.find((server) => String(server.id) === targetId);
            if (!latestTarget) {
                await logStep('target.afterRuntime.missing', {}, baseConfig, 'warn');
                return { ok: false, status: 404, error: 'Server not found' };
            }
  
            const notifyQueue = [];
            const sameProbeConfig = this.hasSameProbeConfig(probed, latestTarget);
            let mergedServer = sameProbeConfig ? this.mergeProbedRuntimeFields(latestTarget, probed) : latestTarget;
            const oldStatus = sameProbeConfig ? probed.previousStatus : latestTarget.status;
            const telegramEnabled = this.isTelegramEnabled(env, baseConfig);
            await logStep('merge.done', { sameProbeConfig, oldStatus, nextStatus: mergedServer.status, telegramEnabled }, baseConfig);
            if (telegramEnabled && mergedServer.status === 'offline' && this.shouldSendOfflineAlert(mergedServer)) {
                notifyQueue.push({ message: this.buildStatusMessage(mergedServer, oldStatus, mergedServer.status), kind: 'offline', serverId: mergedServer.id, lastCheck: mergedServer.lastCheck });
            } else if (telegramEnabled && oldStatus === 'offline' && mergedServer.status === 'online' && latestTarget.offlineAlertSentAt) {
                notifyQueue.push({ message: this.buildStatusMessage({ ...mergedServer, offlineSince: latestTarget.offlineSince || mergedServer.offlineSince }, oldStatus, mergedServer.status), kind: 'online' });
            }
            await logStep('notify.prepare.done', { notifyCount: notifyQueue.length, notifyKinds: notifyQueue.map((item) => item.kind) }, baseConfig);
  
            await logStep('keepAlive.start', { enabled: Boolean(mergedServer.mediaStats && mergedServer.mediaStats.keepAlive && mergedServer.mediaStats.keepAlive.enabled) }, baseConfig);
            const keepAliveResult = await this.refreshKeepAliveIfNeeded(mergedServer, Date.now(), { refreshLastPlayed: false, env, logConfig: baseConfig, requestId, flow: 'single' });
            await logStep('keepAlive.done', { touched: Boolean(keepAliveResult && keepAliveResult.touched), alert: Boolean(keepAliveResult && keepAliveResult.alert) }, baseConfig);
            if (keepAliveResult && keepAliveResult.touched) mergedServer = keepAliveResult.server;
            if (keepAliveResult && keepAliveResult.alert && telegramEnabled) {
                notifyQueue.push({ ...keepAliveResult.alert, kind: 'keepAlive' });
            }
            if (options.refreshLastPlayed) {
                await logStep('lastPlayed.start', { limited: true }, baseConfig);
                const lastPlayedResult = await this.refreshServerLastPlayed(mergedServer, Date.now(), { limited: true, env, logConfig: baseConfig, requestId, flow: 'single' });
                await logStep('lastPlayed.done', { touched: Boolean(lastPlayedResult && lastPlayedResult.touched), lastPlayedAt: Number(lastPlayedResult && lastPlayedResult.server && lastPlayedResult.server.mediaStats && lastPlayedResult.server.mediaStats.lastPlayedAt) || 0, error: lastPlayedResult && lastPlayedResult.server && lastPlayedResult.server.mediaStats ? lastPlayedResult.server.mediaStats.lastPlayedError || '' : '' }, baseConfig);
                if (lastPlayedResult && lastPlayedResult.touched) mergedServer = lastPlayedResult.server;
            } else {
                await logStep('lastPlayed.skip.notRequested', {}, baseConfig);
            }
  
            await logStep('telegram.send.start', { notifyCount: notifyQueue.length }, baseConfig);
            const sendResults = await Promise.all(notifyQueue.map((item) => this.sendTelegram(env, item.message, baseConfig)));
            await logStep('telegram.send.done', { notifyCount: notifyQueue.length, notifySuccessCount: sendResults.filter(Boolean).length, sendResults }, baseConfig);
            for (const [index, ok] of sendResults.entries()) {
                const item = notifyQueue[index];
                if (!ok || !item) continue;
                if (item.kind === 'offline') {
                    mergedServer.offlineAlertSentAt = item.lastCheck;
                } else if (item.kind === 'keepAlive' && mergedServer.mediaStats && mergedServer.mediaStats.keepAlive) {
                    mergedServer.mediaStats = { ...mergedServer.mediaStats, keepAlive: { ...mergedServer.mediaStats.keepAlive, alertSentAt: item.checkedAt || Date.now() } };
                }
            }
  
            await logStep('loadConfig.beforeSave.start', {}, baseConfig);
            const configBeforeSave = this.sanitizeConfig(await this.loadConfig(env));
            await logStep('loadConfig.beforeSave.done', { serverCount: configBeforeSave.servers.length, revision: configBeforeSave.revision || '' }, configBeforeSave);
            const targetBeforeSave = configBeforeSave.servers.find((server) => String(server.id) === targetId);
            if (!targetBeforeSave) {
                await logStep('target.beforeSave.missing', {}, configBeforeSave, 'warn');
                return { ok: false, status: 404, error: 'Server not found' };
            }
            const sameBeforeSaveConfig = this.hasSameProbeConfig(mergedServer, targetBeforeSave);
            const serverToSave = sameBeforeSaveConfig ? {
                ...targetBeforeSave,
                name: mergedServer.name || targetBeforeSave.name,
                remoteName: mergedServer.remoteName || targetBeforeSave.remoteName || '',
                status: mergedServer.status,
                totalChecks: mergedServer.totalChecks,
                successfulChecks: mergedServer.successfulChecks,
                uptime: mergedServer.uptime,
                latency: mergedServer.latency,
                lastCheck: mergedServer.lastCheck,
                offlineSince: mergedServer.offlineSince,
                offlineAlertSentAt: mergedServer.offlineAlertSentAt,
                consecutiveFailures: mergedServer.consecutiveFailures || 0,
                firstFailureAt: mergedServer.firstFailureAt || 0,
                addressProbeResults: mergedServer.addressProbeResults || [],
                history: mergedServer.history,
                mediaStats: mergedServer.mediaStats
            } : targetBeforeSave;
            await logStep('save.merge.done', { sameBeforeSaveConfig, status: serverToSave.status, latency: serverToSave.latency, lastPlayedAt: Number(serverToSave.mediaStats && serverToSave.mediaStats.lastPlayedAt) || 0, lastPlayedError: serverToSave.mediaStats ? serverToSave.mediaStats.lastPlayedError || '' : '' }, configBeforeSave);
            const mergedConfig = {
                ...configBeforeSave,
                servers: configBeforeSave.servers.map((server) => String(server.id) === targetId ? serverToSave : server)
            };
            await logStep('save.start', {}, mergedConfig);
            const savedConfig = await this.saveConfig(env, mergedConfig);
            const savedServer = savedConfig.servers.find((server) => String(server.id) === targetId) || mergedServer;
            await logStep('save.done', { revision: savedConfig.revision || '', status: savedServer.status, latency: savedServer.latency, lastPlayedAt: Number(savedServer.mediaStats && savedServer.mediaStats.lastPlayedAt) || 0 }, savedConfig);
            await this.appendRuntimeLog(env, 'info', 'probe.single.done', '单体测速完成', {
                source: 'manual',
                requestId,
                forceMedia,
                refreshLastPlayed: Boolean(options.refreshLastPlayed),
                elapsedMs: Date.now() - probeStartedAt,
                notifyCount: notifyQueue.length,
                notifySuccessCount: sendResults.filter(Boolean).length,
                target: { id: savedServer.id, name: savedServer.name, previousStatus: probed.previousStatus, status: savedServer.status, latency: savedServer.latency, failures: savedServer.consecutiveFailures || 0 }
            }, { config: savedConfig });
            return { ok: true, config: savedConfig, server: savedServer };
        } catch(e) {
            await this.appendRuntimeLog(env, 'error', 'probe.single.error', '单体测速异常', { requestId, serverId: target.id, serverName: target.name, elapsedMs: Date.now() - probeStartedAt, error: e.message || String(e), stack: e && e.stack ? String(e.stack).split('\n').slice(0, 6).join('\n') : '' }, { config: cleanConfig });
            throw e;
        }
    },
  
    async runProbeLogic(env, config, options = {}) {
        if (!config || !config.servers || config.servers.length === 0) return config;
        const probeStartedAt = Date.now();
        const forceMedia = Boolean(options.forceMedia);
        const probeSource = options.source === 'manual' ? 'manual' : 'scheduled';
        const scheduledStatusOnly = probeSource === 'scheduled' && Boolean(options.statusOnly);
        const concurrencyLimit = Math.max(1, Number(this.PROBE_CONCURRENCY_LIMIT) || 4);
        const batchSize = scheduledStatusOnly ? 4 : (forceMedia || Boolean(options.refreshLastPlayed) ? 1 : 3);
        const totalServers = config.servers.length;
        const rawCursor = probeSource === 'scheduled'
            ? Number(config.nextScheduledCursor) || 0
            : Number(options.cursor) || 0;
        const cursor = totalServers > 0 ? (rawCursor >= totalServers ? 0 : Math.max(0, rawCursor)) : 0;
        const batchEnd = Math.min(totalServers, cursor + batchSize);
        const probeTargets = config.servers.slice(cursor, batchEnd);
        const batchIds = new Set();
        for (let index = 0; index < probeTargets.length; index += 1) batchIds.add(probeTargets[index].id);
        if (!scheduledStatusOnly) await this.appendRuntimeLog(env, 'info', 'probe.start', (probeSource === 'manual' ? '手动刷新开始' : '定时探测开始'), { source: probeSource, forceMedia, cursor, batchEnd, totalServers, targetCount: probeTargets.length }, { config });
  
        const probedServers = await this.mapWithConcurrency(probeTargets, concurrencyLimit, async (s) => {
            return this.probeServerRuntimeState(env, s, forceMedia, {
                limitedMedia: Boolean(options.refreshLastPlayed),
                requestId: 'batch-' + probeStartedAt.toString(36),
                flow: probeSource,
                logConfig: config,
                recordLatency: !scheduledStatusOnly,
                skipMediaRefresh: scheduledStatusOnly
            });
        });
  
        const suppressProbeFailures = false; // 分批探测模式下禁用单批次大面积掉线防误报拦截
  
        const probedById = new Map();
        for (let index = 0; index < probedServers.length; index += 1) {
            const server = probedServers[index];
            if (server) probedById.set(server.id, server);
        }
        const latestConfig = await this.loadConfig(env, scheduledStatusOnly ? { skipHistoryNormalization: true } : {});
        const latestById = new Map();
        for (let index = 0; index < latestConfig.servers.length; index += 1) {
            const server = latestConfig.servers[index];
            latestById.set(server.id, server);
        }
        const notifyQueue = [];
        const sourceConfig = latestConfig;
        const baseConfig = this.sanitizeConfig({ icons: sourceConfig.icons !== undefined ? sourceConfig.icons : latestConfig.icons, telegram: sourceConfig.telegram !== undefined ? sourceConfig.telegram : latestConfig.telegram, logging: sourceConfig.logging !== undefined ? sourceConfig.logging : latestConfig.logging, servers: sourceConfig.servers, updatedAt: sourceConfig.updatedAt || latestConfig.updatedAt || 0 }, scheduledStatusOnly ? { skipHistoryNormalization: true } : {});
        const mergedConfig = {
            icons: baseConfig.icons, telegram: baseConfig.telegram, logging: baseConfig.logging, updatedAt: Math.max(baseConfig.updatedAt || 0, latestConfig.updatedAt || 0),
            servers: baseConfig.servers.map((latest) => {
                const probed = probedById.get(latest.id);
                const previouslySaved = latestById.get(latest.id) || latest;
                let mergedServer = latest;
                let oldStatus = previouslySaved.status;
                if (probed && probed.url === latest.url) {
                    mergedServer = this.mergeProbedRuntimeFields(latest, probed);
                    oldStatus = previouslySaved.url === latest.url && JSON.stringify(previouslySaved.fallbackUrls || []) === JSON.stringify(latest.fallbackUrls || []) ? previouslySaved.status : probed.previousStatus;
                }
                const telegramEnabled = this.isTelegramEnabled(env, baseConfig);
                const shouldSendOffline = this.shouldSendOfflineAlert(mergedServer);
                if (mergedServer.status === 'offline') {
                    console.log('[notify] offline check', {
                        serverId: mergedServer.id,
                        serverName: mergedServer.name,
                        oldStatus,
                        status: mergedServer.status,
                        telegramEnabled,
                        offlineSince: mergedServer.offlineSince,
                        lastCheck: mergedServer.lastCheck,
                        offlineMs: mergedServer.offlineSince ? mergedServer.lastCheck - mergedServer.offlineSince : 0,
                        offlineAlertSentAt: mergedServer.offlineAlertSentAt,
                        shouldSendOffline
                    });
                }
                if (telegramEnabled && mergedServer.status === 'offline' && shouldSendOffline) {
                    notifyQueue.push({ message: this.buildStatusMessage(mergedServer, oldStatus, mergedServer.status), kind: 'offline', serverId: mergedServer.id, lastCheck: mergedServer.lastCheck });
                } else if (telegramEnabled && oldStatus === 'offline' && mergedServer.status === 'online' && previouslySaved.offlineAlertSentAt) {
                    notifyQueue.push({ message: this.buildStatusMessage({ ...mergedServer, offlineSince: previouslySaved.offlineSince || mergedServer.offlineSince }, oldStatus, mergedServer.status), kind: 'online' });
                }
                return mergedServer;
            })
        };
        const nextCursor = batchEnd < totalServers ? batchEnd : 0;
        mergedConfig.nextCursor = nextCursor;
        mergedConfig.hasMore = nextCursor !== 0;
        if (probeSource === 'scheduled') {
            mergedConfig.nextScheduledCursor = nextCursor;
        }
        if (!scheduledStatusOnly) {
            const keepAliveTargets = mergedConfig.servers.filter((server) => batchIds.has(server.id));
            const keepAliveResults = await this.mapWithConcurrency(keepAliveTargets, concurrencyLimit, (server) => this.refreshKeepAliveIfNeeded(server, Date.now(), { refreshLastPlayed: false, env, logConfig: baseConfig, requestId: 'batch-' + probeStartedAt.toString(36), flow: probeSource }));
            for (const result of keepAliveResults) {
                if (!result || !result.touched) continue;
                const index = mergedConfig.servers.findIndex((server) => server.id === result.server.id);
                if (index >= 0) mergedConfig.servers[index] = result.server;
                if (result.alert && this.isTelegramEnabled(env, baseConfig)) {
                    notifyQueue.push({ ...result.alert, kind: 'keepAlive' });
                }
            }
        }
        if (probeSource === 'manual' && Boolean(options.refreshLastPlayed)) {
            const lastPlayedTargets = mergedConfig.servers.filter((server) => batchIds.has(server.id) && server.mediaStats && server.mediaStats.enabled);
            const lastPlayedResults = await this.mapWithConcurrency(lastPlayedTargets, 1, (server) => this.refreshServerLastPlayed(server, Date.now(), { limited: true, env, logConfig: baseConfig, requestId: 'batch-' + probeStartedAt.toString(36), flow: probeSource }));
            for (const result of lastPlayedResults) {
                if (!result || !result.touched) continue;
                const index = mergedConfig.servers.findIndex((server) => server.id === result.server.id);
                if (index >= 0) mergedConfig.servers[index] = result.server;
            }
        }
        if (notifyQueue.length) {
            console.log('[notify] queue prepared', notifyQueue.map((item) => ({ kind: item.kind, serverId: item.serverId || null, lastCheck: item.lastCheck || null })));
        }
        const sendResults = await Promise.all(notifyQueue.map((item) => this.sendTelegram(env, item.message, baseConfig)));
        if (notifyQueue.length) {
            console.log('[notify] send results', sendResults);
            let updated = false;
            for (const [index, ok] of sendResults.entries()) {
                const item = notifyQueue[index];
                if (!ok || !item) continue;
                const targetId = item.serverId;
                const targetServer = mergedConfig.servers.find((server) => server.id === targetId);
                if (targetServer && item.kind === 'offline') {
                    targetServer.offlineAlertSentAt = item.lastCheck;
                    updated = true;
                } else if (targetServer && item.kind === 'keepAlive' && targetServer.mediaStats && targetServer.mediaStats.keepAlive) {
                    targetServer.mediaStats = { ...targetServer.mediaStats, keepAlive: { ...targetServer.mediaStats.keepAlive, alertSentAt: item.checkedAt || Date.now() } };
                    updated = true;
                }
            }
            if (updated) {
                mergedConfig.updatedAt = Math.max(mergedConfig.updatedAt || 0, Date.now());
            }
        }
        const savedConfig = await this.saveConfig(env, mergedConfig, scheduledStatusOnly ? { skipHistoryNormalization: true } : {});
        const responseConfig = {
            ...savedConfig,
            nextCursor: mergedConfig.nextCursor,
            hasMore: mergedConfig.hasMore
        };
        if (!scheduledStatusOnly) {
            const statusCounts = mergedConfig.servers.reduce((counts, server) => {
                const status = ['online', 'offline', 'unknown'].includes(server.status) ? server.status : 'unknown';
                counts[status] = (counts[status] || 0) + 1;
                return counts;
            }, { online: 0, offline: 0, unknown: 0 });
            const probeDetails = probedServers.map((server) => ({
                id: server.id,
                name: server.name,
                previousStatus: server.previousStatus,
                status: server.status,
                latency: server.latency,
                failures: server.consecutiveFailures || 0,
                addresses: Array.isArray(server.addressProbeResults) ? server.addressProbeResults.map((item) => ({ url: item.url, ok: item.ok, latency: item.latency || 0, error: item.error || '' })) : []
            }));
            await this.appendRuntimeLog(env, suppressProbeFailures ? 'warn' : 'info', 'probe.done', (probeSource === 'manual' ? '手动刷新完成' : '定时探测完成'), {
                source: probeSource,
                forceMedia,
                cursor,
                hasMore: Boolean(mergedConfig.hasMore),
                nextScheduledCursor: Number(mergedConfig.nextScheduledCursor) || 0,
                elapsedMs: Date.now() - probeStartedAt,
                statusCounts,
                suppressedBroadFailure: Boolean(suppressProbeFailures),
                notifyCount: notifyQueue.length,
                notifySuccessCount: sendResults.filter(Boolean).length,
                targets: probeDetails
            }, { config: savedConfig });
        }
        return responseConfig;
    }
  ,
};

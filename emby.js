/**
 * Emby 集群探针
 *
 * This file is generated from src/ by scripts/build.cjs.
 * Do not edit emby.js directly; edit src/ and run npm run build.
 */

const HTML_CONTENT = "<!--\n  前端 HTML 外壳。\n\n  负责页面基础 head、CDN 依赖、root 容器和脚本插槽。当前运行时仍使用 React 18.2 CDN 与浏览器端 Babel，\n  不要因为 package.json 中的 React 开发依赖版本不同而直接升级线上 CDN。\n-->\n<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n    <meta name=\"theme-color\" content=\"#dce8fb\">\n    <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n    <meta name=\"apple-mobile-web-app-title\" content=\"Emby 探针\">\n    <meta name=\"apple-mobile-web-app-status-bar-style\" content=\"default\">\n    <link rel=\"manifest\" href=\"/manifest.webmanifest\">\n    <link rel=\"icon\" href=\"/app-icon.svg\" type=\"image/svg+xml\">\n    <link rel=\"apple-touch-icon\" href=\"/app-icon.svg\">\n    <title>Emby 集群探针大盘</title>\n    <script>\n        function showBootError(message) {\n            var el = document.getElementById('boot-error');\n            var root = document.getElementById('root');\n            if (root) {\n                root.innerHTML = '';\n            }\n            if (el) {\n                el.style.display = 'block';\n                el.style.position = 'fixed';\n                el.style.left = '50%';\n                el.style.top = '40px';\n                el.style.transform = 'translateX(-50%)';\n                el.style.zIndex = '99999';\n                el.style.width = 'calc(100% - 32px)';\n                el.textContent = message;\n            }\n        }\n    </script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js\" onerror=\"showBootError('React CDN 加载失败')\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js\" onerror=\"showBootError('ReactDOM CDN 加载失败')\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js\" onerror=\"showBootError('Babel CDN 加载失败')\"></script>\n    <script src=\"https://cdn.tailwindcss.com\" onerror=\"showBootError('Tailwind CDN 加载失败')\"></script>\n    <style>\n        /*\n         * 前端全局样式。\n         *\n         * 负责页面背景、玻璃拟物面板、卡片、弹窗、移动端布局等视觉样式。\n         * 后续改 UI 外观优先看这里；动态业务状态仍在 React 组件里维护。\n         */\n        html { background: #dde8f8; }\n        body {\n            background: #dde8f8;\n            color: #334155;\n            font-family: system-ui;\n            margin: 0;\n            min-height: 100vh;\n        }\n\n        .bg-canvas {\n            position: fixed;\n            inset: 0;\n            z-index: 0;\n            background: linear-gradient(135deg, #e8eeff 0%, #dce8fb 30%, #ede4fb 60%, #e0effe 100%);\n            overflow: hidden;\n        }\n        .bg-canvas::after {\n            content: '';\n            position: absolute;\n            inset: 0;\n            background-image: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\");\n            pointer-events: none;\n            opacity: 0.6;\n        }\n        .orb {\n            position: absolute;\n            border-radius: 50%;\n            filter: blur(80px);\n            opacity: 0.55;\n            animation: orb-drift linear infinite;\n        }\n        .orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, #a5c4fd, #c4b5fd); top: -15%; left: -10%; animation-duration: 28s; }\n        .orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, #fde68a, #fca5a5); top: 40%; right: -8%; animation-duration: 22s; animation-delay: -8s; }\n        .orb-3 { width: 450px; height: 450px; background: radial-gradient(circle, #6ee7f7, #a5f3cc); bottom: -10%; left: 25%; animation-duration: 32s; animation-delay: -14s; }\n        .orb-4 { width: 350px; height: 350px; background: radial-gradient(circle, #fbb6f0, #c4b5fd); top: 20%; left: 40%; animation-duration: 25s; animation-delay: -4s; opacity: 0.35; }\n        @keyframes orb-drift {\n            0% { transform: translate(0, 0) scale(1); }\n            25% { transform: translate(40px, -30px) scale(1.05); }\n            50% { transform: translate(-20px, 50px) scale(0.97); }\n            75% { transform: translate(-50px, -20px) scale(1.03); }\n            100% { transform: translate(0, 0) scale(1); }\n        }\n\n        /* 自定义高级动画与玻璃拟物样式 */\n        @keyframes breath-dot-online {\n            0%, 100% { box-shadow: 0 0 6px rgba(16, 185, 129, 0.4), 0 0 0 0 rgba(16, 185, 129, 0.2); }\n            50% { box-shadow: 0 0 12px rgba(16, 185, 129, 0.8), 0 0 0 6px rgba(16, 185, 129, 0); }\n        }\n        @keyframes breath-dot-offline {\n            0%, 100% { box-shadow: 0 0 6px rgba(244, 63, 94, 0.5), 0 0 0 0 rgba(244, 63, 94, 0.2); }\n            50% { box-shadow: 0 0 14px rgba(244, 63, 94, 0.9), 0 0 0 6px rgba(244, 63, 94, 0); }\n        }\n        @keyframes breath-glow-online {\n            0%, 100% { opacity: 0.15; transform: scale(1); }\n            50% { opacity: 0.3; transform: scale(1.1); }\n        }\n        @keyframes breath-glow-offline {\n            0%, 100% { opacity: 0.15; transform: scale(1); }\n            50% { opacity: 0.35; transform: scale(1.15); }\n        }\n        @keyframes pulse-updating {\n            0%, 100% { opacity: 1; }\n            50% { opacity: 0.5; }\n        }\n\n        .dot-online { background-color: #10b981; animation: breath-dot-online 2.5s ease-in-out infinite; }\n        .dot-offline { background-color: #f43f5e; animation: breath-dot-offline 2s ease-in-out infinite; }\n        .dot-updating { background-color: #3b82f6; animation: pulse-updating 1.5s infinite; }\n        .glow-online { background-color: #10b981; animation: breath-glow-online 2.5s ease-in-out infinite; }\n        .glow-offline { background-color: #f43f5e; animation: breath-glow-offline 2s ease-in-out infinite; }\n\n        .app-shell { position: relative; z-index: 1; }\n\n        .glass-panel {\n            background: rgba(255, 255, 255, 0.78);\n            backdrop-filter: blur(24px);\n            -webkit-backdrop-filter: blur(24px);\n            border: 1px solid rgba(148, 163, 184, 0.22);\n            box-shadow: 0 16px 40px -18px rgba(15, 23, 42, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.92);\n        }\n        .brand-title {\n            background: linear-gradient(100deg, #0f172a 0%, #0369a1 48%, #059669 100%);\n            -webkit-background-clip: text;\n            background-clip: text;\n            color: transparent;\n            text-shadow: 0 18px 34px rgba(14, 116, 144, 0.12);\n        }\n        .brand-icon-shell {\n            background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,249,255,0.74));\n            border: 1px solid rgba(255,255,255,0.96);\n            box-shadow: 0 18px 36px -24px rgba(15, 23, 42, 0.56), inset 0 1px 0 rgba(255,255,255,0.95);\n        }\n        .tab-nav {\n            display: flex;\n            align-items: center;\n            gap: 4px;\n            padding: 4px;\n            background: rgba(255,255,255,0.45);\n            backdrop-filter: blur(16px);\n            -webkit-backdrop-filter: blur(16px);\n            border: 1px solid rgba(255,255,255,0.75);\n            border-radius: 30px;\n            box-shadow: 0 2px 12px rgba(80,100,160,0.08), 0 1px 0 rgba(255,255,255,0.9) inset;\n        }\n        .tab-btn {\n            display: flex;\n            align-items: center;\n            gap: 7px;\n            padding: 7px 18px;\n            border-radius: 24px;\n            border: none;\n            font-size: 13px;\n            font-weight: 600;\n            cursor: pointer;\n            transition: all 0.2s;\n            color: #9199b0;\n            background: transparent;\n            white-space: nowrap;\n        }\n        .tab-btn:hover { color: #5a6073; background: rgba(255,255,255,0.5); }\n        .tab-btn.active {\n            background: rgba(255,255,255,0.92);\n            color: #1a1d2e;\n            box-shadow: 0 2px 12px rgba(80,100,160,0.12), 0 1px 0 rgba(255,255,255,0.95) inset;\n        }\n        .tab-dot {\n            width: 7px;\n            height: 7px;\n            border-radius: 50%;\n            flex-shrink: 0;\n        }\n        .dashboard-shell {\n            background: rgba(255,255,255,0.34);\n            backdrop-filter: blur(24px) saturate(180%);\n            -webkit-backdrop-filter: blur(24px) saturate(180%);\n            border: 1px solid rgba(255,255,255,0.72);\n            box-shadow: 0 22px 64px -42px rgba(15, 23, 42, 0.42), inset 0 1px 0 rgba(255,255,255,0.86);\n        }\n        .dashboard-row {\n            background: linear-gradient(180deg, rgba(255,255,255,0.72), rgba(248,250,255,0.48));\n            backdrop-filter: blur(20px) saturate(170%);\n            -webkit-backdrop-filter: blur(20px) saturate(170%);\n            border: 1px solid rgba(255,255,255,0.82);\n            box-shadow: 0 12px 34px -26px rgba(15, 23, 42, 0.28), inset 0 1px 0 rgba(255,255,255,0.88);\n            position: relative;\n            overflow: hidden;\n        }\n        .dashboard-row::before {\n            content: '';\n            position: absolute;\n            inset: 0;\n            height: 58%;\n            background: linear-gradient(180deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0) 100%);\n            pointer-events: none;\n        }\n        .dashboard-row-online {\n            background: linear-gradient(135deg, rgba(16,185,129,0.11), rgba(255,255,255,0.52) 42%, rgba(52,211,153,0.05));\n            border-color: rgba(16,185,129,0.2);\n        }\n        .dashboard-row-offline {\n            background: linear-gradient(135deg, rgba(244,63,94,0.12), rgba(255,255,255,0.52) 42%, rgba(251,113,133,0.05));\n            border-color: rgba(244,63,94,0.22);\n        }\n        .dashboard-row-updating {\n            background: linear-gradient(135deg, rgba(59,130,246,0.11), rgba(255,255,255,0.52) 42%, rgba(96,165,250,0.05));\n            border-color: rgba(59,130,246,0.2);\n        }\n        .dashboard-row-unknown {\n            background: linear-gradient(135deg, rgba(100,116,139,0.08), rgba(255,255,255,0.52) 42%, rgba(148,163,184,0.04));\n            border-color: rgba(148,163,184,0.2);\n        }\n        .dashboard-node-panel {\n            background: rgba(255,255,255,0.42);\n            border: 1px solid rgba(255,255,255,0.72);\n            box-shadow: inset 0 1px 0 rgba(255,255,255,0.78);\n        }\n        .status-chart-shell {\n            background: linear-gradient(180deg, rgba(255,255,255,0.62), rgba(248,250,252,0.42));\n            backdrop-filter: blur(12px) saturate(150%);\n            -webkit-backdrop-filter: blur(12px) saturate(150%);\n            border: 1px solid rgba(255,255,255,0.78);\n            box-shadow: inset 0 1px 0 rgba(255,255,255,0.86), inset 0 -1px 0 rgba(148,163,184,0.16);\n        }\n        .glass-input {\n            background: rgba(255, 255, 255, 0.88);\n            border: 1px solid rgba(203, 213, 225, 0.92);\n            transition: all 0.2s ease;\n            color: #334155;\n        }\n        .glass-input:focus {\n            background: #fff;\n            border-color: #3b82f6;\n            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n        }\n        .server-card {\n            background: linear-gradient(180deg, rgba(255,255,255,0.76), rgba(246,250,255,0.6));\n            backdrop-filter: blur(24px) saturate(180%);\n            -webkit-backdrop-filter: blur(24px) saturate(180%);\n            border: 1px solid rgba(255,255,255,0.9);\n            box-shadow: 0 18px 44px -26px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.94);\n            position: relative;\n            overflow: hidden;\n        }\n        .server-card::before {\n            content: '';\n            position: absolute;\n            inset: 0;\n            background: linear-gradient(180deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.18) 48%, transparent 100%);\n            pointer-events: none;\n        }\n        .server-card-head {\n            position: relative;\n            padding: 16px 20px;\n            margin: -24px -24px 16px;\n            border: 1px solid rgba(255,255,255,0.58);\n            border-bottom: 1px solid rgba(255,255,255,0.38);\n            border-radius: 32px 32px 18px 18px;\n            overflow: hidden;\n        }\n        .server-card-head::before {\n            content: '';\n            position: absolute;\n            inset: 0;\n            background: linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 100%);\n            pointer-events: none;\n        }\n        .server-card-head > * { position: relative; z-index: 1; }\n        .server-card-head-online {\n            background: linear-gradient(135deg, rgba(16,185,129,0.16), rgba(52,211,153,0.06));\n            border-color: rgba(16,185,129,0.22);\n        }\n        .server-card-head-offline {\n            background: linear-gradient(135deg, rgba(244,63,94,0.18), rgba(251,113,133,0.07));\n            border-color: rgba(244,63,94,0.24);\n        }\n        .server-card-head-updating {\n            background: linear-gradient(135deg, rgba(59,130,246,0.16), rgba(96,165,250,0.06));\n            border-color: rgba(59,130,246,0.22);\n        }\n        .server-card-head-unknown {\n            background: linear-gradient(135deg, rgba(100,116,139,0.12), rgba(148,163,184,0.05));\n            border-color: rgba(148,163,184,0.2);\n        }\n        .server-card-section {\n            background: rgba(255,255,255,0.36);\n            border: 1px solid rgba(255,255,255,0.72);\n            box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);\n        }\n        .server-card-metrics { margin-bottom: 14px; }\n        .server-card-media { margin-top: auto; }\n        .server-card-footer {\n            margin-top: 16px;\n            padding-top: 12px;\n            border-top: 1px solid rgba(148,163,184,0.18);\n        }\n        .overview-stat {\n            border: 1.5px solid rgba(255,255,255,0.75);\n            box-shadow: 0 8px 32px rgba(80,100,160,0.1), 0 1.5px 0 rgba(255,255,255,0.9) inset;\n        }\n        .overview-stat::before {\n            content: '';\n            position: absolute;\n            inset: 0;\n            height: 58%;\n            background: linear-gradient(180deg, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0) 100%);\n            pointer-events: none;\n        }\n        .overview-stat-online {\n            background: linear-gradient(135deg, rgba(16,185,129,0.13), rgba(52,211,153,0.06));\n            border-color: rgba(16,185,129,0.24);\n        }\n        .overview-stat-online:hover { box-shadow: 0 12px 36px rgba(16,185,129,0.16), 0 1.5px 0 rgba(255,255,255,0.9) inset; }\n        .overview-stat-offline {\n            background: linear-gradient(135deg, rgba(244,63,94,0.12), rgba(251,113,133,0.06));\n            border-color: rgba(244,63,94,0.22);\n        }\n        .overview-stat-offline:hover { box-shadow: 0 12px 36px rgba(244,63,94,0.16), 0 1.5px 0 rgba(255,255,255,0.9) inset; }\n        .overview-stat-uptime {\n            background: linear-gradient(135deg, rgba(59,126,255,0.13), rgba(96,165,250,0.06));\n            border-color: rgba(59,126,255,0.24);\n        }\n        .overview-stat-uptime:hover { box-shadow: 0 12px 36px rgba(59,126,255,0.16), 0 1.5px 0 rgba(255,255,255,0.9) inset; }\n        .overview-stat-alert {\n            background: linear-gradient(135deg, rgba(139,92,246,0.13), rgba(167,139,250,0.06));\n            border-color: rgba(139,92,246,0.24);\n        }\n        .overview-stat-alert:hover { box-shadow: 0 12px 36px rgba(139,92,246,0.16), 0 1.5px 0 rgba(255,255,255,0.9) inset; }\n        .mobile-control-row { display: contents; }\n        @media (max-width: 640px) {\n            body { -webkit-tap-highlight-color: transparent; }\n            .app-shell {\n                min-height: 100svh;\n                padding-top: env(safe-area-inset-top);\n                padding-bottom: env(safe-area-inset-bottom);\n            }\n            .orb { filter: blur(58px); opacity: 0.42; }\n            .orb-1 { width: 360px; height: 360px; top: -10%; left: -35%; }\n            .orb-2 { width: 320px; height: 320px; top: 24%; right: -38%; }\n            .orb-3 { width: 300px; height: 300px; bottom: 6%; left: 18%; }\n            .orb-4 { display: none; }\n            .mobile-page {\n                padding: 14px 14px calc(92px + env(safe-area-inset-bottom));\n                max-width: none;\n            }\n            .mobile-header {\n                margin-bottom: 14px;\n                gap: 12px;\n                padding: 13px;\n                border-radius: 28px;\n                background:\n                    linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.36)),\n                    radial-gradient(circle at 12% 18%, rgba(96,165,250,0.22), transparent 36%),\n                    radial-gradient(circle at 88% 82%, rgba(16,185,129,0.16), transparent 38%);\n                backdrop-filter: blur(24px) saturate(175%);\n                -webkit-backdrop-filter: blur(24px) saturate(175%);\n                border: 1px solid rgba(255,255,255,0.82);\n                box-shadow: 0 14px 36px rgba(80,100,160,0.13), 0 1px 0 rgba(255,255,255,0.95) inset;\n            }\n            .mobile-title-row {\n                width: 100%;\n                display: block;\n            }\n            .mobile-title-row .brand-icon-shell {\n                width: 46px;\n                height: 46px;\n                border-radius: 17px;\n                flex-shrink: 0;\n            }\n            .mobile-title-row .brand-icon-shell svg {\n                width: 24px;\n                height: 24px;\n            }\n            .mobile-title-row h1 {\n                font-size: 1.42rem;\n                line-height: 1.12;\n                min-width: 0;\n                gap: 10px;\n            }\n            .mobile-title-row .brand-title {\n                white-space: normal;\n                overflow-wrap: anywhere;\n            }\n            .mobile-subtitle {\n                margin-top: 6px;\n                font-size: 9px;\n                letter-spacing: 0.14em;\n                padding-left: 56px;\n            }\n            .mobile-actions {\n                width: 100%;\n                display: grid;\n                grid-template-columns: repeat(2, minmax(0, 1fr));\n                gap: 9px;\n                align-items: center;\n                padding: 9px;\n                border-radius: 23px;\n                background: rgba(255,255,255,0.36);\n                border: 1px solid rgba(255,255,255,0.76);\n                box-shadow: inset 0 1px 0 rgba(255,255,255,0.86);\n            }\n            .mobile-icon-group {\n                grid-column: 1 / -1;\n                display: flex;\n                justify-content: flex-end;\n                gap: 8px;\n                margin-right: 0;\n            }\n            .mobile-actions button {\n                min-height: 44px;\n            }\n            .mobile-icon-group button {\n                width: 42px;\n                height: 42px;\n                min-height: 42px;\n                border-radius: 15px;\n                background: rgba(255,255,255,0.72);\n            }\n            .mobile-privacy-menu {\n                width: min(86vw, 340px);\n                z-index: 70;\n                padding: 18px;\n                border-radius: 28px;\n            }\n            .mobile-privacy-menu button {\n                width: 100%;\n                height: auto;\n                min-height: 56px;\n                border-radius: 18px;\n                background: transparent;\n                justify-content: flex-start;\n                padding: 12px 14px;\n            }\n            .mobile-privacy-menu button > div {\n                min-width: 0;\n            }\n            .mobile-privacy-backdrop {\n                position: fixed;\n                inset: 0;\n                z-index: 0;\n                background: rgba(15,23,42,0.22);\n                backdrop-filter: blur(8px);\n                -webkit-backdrop-filter: blur(8px);\n            }\n            .mobile-primary-btn,\n            .mobile-refresh-btn {\n                justify-content: center;\n                padding: 0 10px;\n                height: 46px;\n                border-radius: 17px;\n                font-size: 12px;\n                font-weight: 900;\n                width: 100%;\n                text-align: center;\n            }\n            .mobile-primary-btn { font-size: 12px; }\n            .mobile-primary-btn svg {\n                width: 15px;\n                height: 15px;\n            }\n            .mobile-primary-btn::after {\n                content: none;\n                font-size: 12px;\n                font-weight: 900;\n                line-height: 1;\n            }\n            .mobile-refresh-btn span {\n                width: auto;\n                min-width: 0;\n                font-size: 12px;\n                display: inline-flex;\n                align-items: center;\n                justify-content: center;\n                line-height: 1;\n            }\n            .mobile-stats-strip {\n                display: grid;\n                grid-template-columns: repeat(2, minmax(0, 1fr));\n                gap: 10px;\n                overflow: visible;\n                padding: 0;\n                margin: 0 0 14px;\n            }\n            .mobile-stats-strip::-webkit-scrollbar,\n            .mobile-control-row::-webkit-scrollbar { display: none; }\n            .mobile-stat-card {\n                min-width: 0;\n                padding: 12px;\n                border-radius: 22px;\n                gap: 9px;\n                isolation: isolate;\n                background: rgba(255,255,255,0.5);\n                border-width: 1px;\n                box-shadow: 0 10px 26px rgba(80,100,160,0.1), inset 0 1px 0 rgba(255,255,255,0.9);\n            }\n            .mobile-stat-card > .absolute,\n            .mobile-stat-card::before { display: none; }\n            .mobile-stat-card.overview-stat-online {\n                background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(255,255,255,0.56) 54%, rgba(255,255,255,0.36));\n                border-color: rgba(16,185,129,0.2);\n            }\n            .mobile-stat-card.overview-stat-offline {\n                background: linear-gradient(135deg, rgba(244,63,94,0.19), rgba(255,255,255,0.56) 54%, rgba(255,255,255,0.36));\n                border-color: rgba(244,63,94,0.2);\n            }\n            .mobile-stat-card.overview-stat-uptime {\n                background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(255,255,255,0.56) 54%, rgba(255,255,255,0.36));\n                border-color: rgba(59,130,246,0.2);\n            }\n            .mobile-stat-card.overview-stat-alert {\n                background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(255,255,255,0.56) 54%, rgba(255,255,255,0.36));\n                border-color: rgba(139,92,246,0.2);\n            }\n            .mobile-stat-card .stat-icon-shell {\n                width: 36px;\n                height: 36px;\n                border-radius: 14px;\n                background: rgba(255,255,255,0.68);\n            }\n            .mobile-stat-card .stat-icon-shell svg {\n                width: 19px;\n                height: 19px;\n            }\n            .mobile-stat-card .stat-value {\n                font-size: 17px;\n                line-height: 1;\n            }\n            .mobile-stat-card .stat-label {\n                font-size: 9px;\n                letter-spacing: 0.08em;\n            }\n            .mobile-action-bar {\n                margin-bottom: 14px;\n                gap: 10px;\n                padding: 0;\n                border-radius: 0;\n                background: transparent;\n                border: 0;\n                box-shadow: none;\n            }\n            .mobile-tab-nav {\n                position: fixed;\n                left: 50%;\n                bottom: calc(14px + env(safe-area-inset-bottom));\n                transform: translateX(-50%);\n                z-index: 45;\n                width: min(78vw, 310px);\n                display: grid;\n                grid-template-columns: 1fr 1fr;\n                border-radius: 999px;\n                padding: 4px;\n                background: linear-gradient(180deg, rgba(255,255,255,0.74), rgba(255,255,255,0.42));\n                border: 1px solid rgba(255,255,255,0.8);\n                backdrop-filter: blur(24px) saturate(180%);\n                -webkit-backdrop-filter: blur(24px) saturate(180%);\n                box-shadow: 0 18px 42px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.94);\n            }\n            .mobile-tab-nav .tab-btn {\n                justify-content: center;\n                padding: 8px 6px;\n                border-radius: 999px;\n                font-size: 11px;\n                min-height: 48px;\n                flex-direction: column;\n                gap: 3px;\n                line-height: 1;\n            }\n            .mobile-tab-nav .tab-btn svg {\n                width: 18px;\n                height: 18px;\n            }\n            .mobile-controls {\n                width: 100%;\n                display: flex;\n                flex-direction: column;\n                gap: 9px;\n            }\n            .mobile-control-row {\n                display: flex;\n                flex-wrap: nowrap;\n                gap: 6px;\n                overflow-x: auto;\n                padding: 0;\n                border-radius: 0;\n                background: transparent;\n                border: 0;\n                box-shadow: none;\n                -webkit-overflow-scrolling: touch;\n            }\n            .mobile-control-row.has-range {\n                display: flex;\n                flex-wrap: nowrap;\n            }\n            .mobile-control-row.no-range {\n                display: flex;\n                flex-wrap: nowrap;\n            }\n            .mobile-control-row .glass-panel,\n            .mobile-control-row > button {\n                display: flex;\n                flex-shrink: 1;\n            }\n            .mobile-control-row .glass-panel {\n                border-radius: 999px;\n                width: auto;\n                justify-content: center;\n                background: rgba(255,255,255,0.46);\n                border: 1px solid rgba(255,255,255,0.72);\n                backdrop-filter: blur(16px) saturate(160%);\n                -webkit-backdrop-filter: blur(16px) saturate(160%);\n                box-shadow: 0 7px 18px rgba(80,100,160,0.07), inset 0 1px 0 rgba(255,255,255,0.78);\n            }\n            .mobile-filter-group {\n                width: auto;\n                display: inline-flex !important;\n                flex-wrap: nowrap;\n                gap: 6px;\n                padding: 0;\n                border-radius: 999px;\n                justify-content: center;\n                background: transparent !important;\n                border: 0 !important;\n                box-shadow: none !important;\n                backdrop-filter: none;\n                -webkit-backdrop-filter: none;\n            }\n            .mobile-range-group {\n                flex: 0 0 auto;\n                order: 1;\n            }\n            .mobile-status-group {\n                flex: 0 0 auto;\n                order: 2;\n            }\n            .mobile-filter-group button {\n                flex: 0 0 auto;\n                min-width: 0;\n                min-height: 36px;\n                padding-left: 9px;\n                padding-right: 9px;\n                border-radius: 999px;\n                background: rgba(255,255,255,0.46);\n                border: 1px solid rgba(255,255,255,0.72);\n                backdrop-filter: blur(16px) saturate(160%);\n                -webkit-backdrop-filter: blur(16px) saturate(160%);\n                box-shadow: 0 7px 18px rgba(80,100,160,0.07), inset 0 1px 0 rgba(255,255,255,0.78);\n            }\n            .mobile-sort-button {\n                width: auto;\n                display: inline-flex !important;\n                justify-content: center;\n                min-height: 36px;\n                order: 3;\n                padding-left: 10px;\n                padding-right: 10px;\n            }\n            .mobile-control-row.has-range .mobile-range-group,\n            .mobile-control-row.has-range .mobile-status-group,\n            .mobile-control-row.has-range .mobile-sort-button {\n                flex: 0 0 auto;\n            }\n            .mobile-control-row .glass-panel button {\n                flex: 1;\n                min-height: 36px;\n            }\n            .mobile-control-row > button {\n                width: 100%;\n                justify-content: center;\n                min-height: 40px;\n                border-radius: 999px;\n                background: rgba(255,255,255,0.46);\n                border: 1px solid rgba(255,255,255,0.72);\n                backdrop-filter: blur(16px) saturate(160%);\n                -webkit-backdrop-filter: blur(16px) saturate(160%);\n                box-shadow: 0 7px 18px rgba(80,100,160,0.07), inset 0 1px 0 rgba(255,255,255,0.78);\n            }\n            .mobile-search {\n                width: 100%;\n                border-radius: 20px;\n                box-shadow: 0 8px 22px rgba(80,100,160,0.07);\n            }\n            .mobile-search input {\n                min-height: 44px;\n                border-radius: 18px;\n                background: rgba(255,255,255,0.68);\n                border-color: rgba(255,255,255,0.86);\n            }\n            .mobile-server-grid {\n                display: flex;\n                flex-direction: column;\n                gap: 14px;\n            }\n            .server-card.mobile-card {\n                padding: 16px;\n                border-radius: 28px;\n            }\n            .mobile-card .server-card-head {\n                margin: -16px -16px 14px;\n                padding: 14px;\n                border-radius: 28px 28px 18px 18px;\n                flex-direction: column;\n                gap: 12px;\n            }\n            .mobile-card .server-card-head > .flex:first-child {\n                width: 100%;\n                gap: 12px;\n            }\n            .mobile-card .server-card-head > .flex:first-child > div:first-child {\n                width: 48px;\n                height: 48px;\n                border-radius: 17px;\n            }\n            .mobile-card .server-card-head h3 {\n                font-size: 17px;\n                line-height: 1.18;\n                white-space: normal;\n                display: -webkit-box;\n                -webkit-line-clamp: 2;\n                -webkit-box-orient: vertical;\n            }\n            .mobile-card .server-card-head p {\n                max-width: 100%;\n                font-size: 10px;\n            }\n            .mobile-card .server-card-head > div:last-child {\n                align-self: flex-start;\n            }\n            .mobile-card .server-card-metrics {\n                padding: 14px;\n                margin-bottom: 12px;\n                border-radius: 20px;\n            }\n            .mobile-card .server-card-metrics span.text-3xl {\n                font-size: 1.55rem;\n            }\n            .mobile-card .server-card-media {\n                padding: 13px;\n                border-radius: 20px;\n            }\n            .mobile-card .server-card-media .grid {\n                gap: 0;\n            }\n            .mobile-card .server-card-footer {\n                margin-top: 10px;\n                padding-top: 8px;\n                align-items: center;\n                gap: 8px;\n                flex-direction: row;\n                flex-wrap: nowrap;\n            }\n            .mobile-card .server-card-footer > div:first-child {\n                flex: 0 0 auto;\n                min-width: 0;\n                white-space: nowrap;\n            }\n            .mobile-card-actions {\n                opacity: 1;\n                width: auto;\n                margin-left: auto;\n                display: grid;\n                grid-template-columns: repeat(3, minmax(0, 1fr));\n                gap: 6px;\n            }\n            .mobile-card-actions button {\n                min-height: 34px;\n                border-radius: 11px;\n                font-size: 12px;\n                font-weight: 800;\n                padding-left: 10px;\n                padding-right: 10px;\n            }\n            .dashboard-shell.mobile-dashboard {\n                padding: 10px;\n                border-radius: 26px;\n                gap: 10px;\n            }\n            .mobile-dashboard .dashboard-row {\n                padding: 11px;\n                border-radius: 24px;\n                gap: 10px;\n                background: linear-gradient(180deg, rgba(255,255,255,0.58), rgba(255,255,255,0.34));\n                border-color: rgba(255,255,255,0.78);\n            }\n            .mobile-dashboard .dashboard-row::before { display: none; }\n            .mobile-dashboard .dashboard-row-online {\n                background: linear-gradient(135deg, rgba(16,185,129,0.17), rgba(255,255,255,0.52) 48%, rgba(255,255,255,0.34));\n            }\n            .mobile-dashboard .dashboard-row-offline {\n                background: linear-gradient(135deg, rgba(244,63,94,0.17), rgba(255,255,255,0.52) 48%, rgba(255,255,255,0.34));\n            }\n            .mobile-dashboard .dashboard-row-updating {\n                background: linear-gradient(135deg, rgba(59,130,246,0.17), rgba(255,255,255,0.52) 48%, rgba(255,255,255,0.34));\n            }\n            .mobile-dashboard .dashboard-node-panel {\n                padding: 11px;\n                border-radius: 19px;\n                gap: 11px;\n                background: rgba(255,255,255,0.44);\n            }\n            .mobile-dashboard .dashboard-node-panel > .absolute { display: none; }\n            .mobile-dashboard .dashboard-node-panel > div:nth-child(2) {\n                width: 44px;\n                height: 44px;\n                border-radius: 15px;\n            }\n            .mobile-dashboard .dashboard-node-panel .font-black {\n                font-size: 15px;\n            }\n            .mobile-dashboard .status-chart-shell {\n                min-height: 4.65rem;\n                border-radius: 19px;\n                padding: 9px 10px;\n                background: rgba(255,255,255,0.48);\n                border-color: rgba(255,255,255,0.78);\n            }\n            .mobile-modal {\n                align-items: flex-end;\n                padding: 0;\n            }\n            .mobile-modal-backdrop {\n                background: rgba(15,23,42,0.24);\n            }\n            .mobile-sheet {\n                width: 100%;\n                max-width: none;\n                max-height: calc(100vh - 18px);\n                border-radius: 28px 28px 0 0;\n                padding: 22px 18px 18px;\n                overflow: hidden;\n            }\n            .mobile-sheet h2 {\n                font-size: 20px;\n                margin-bottom: 16px;\n                padding-right: 34px;\n            }\n            .mobile-sheet .space-y-4 {\n                max-height: calc(100vh - 140px);\n                padding-right: 2px;\n            }\n            .mobile-sheet textarea {\n                min-height: 104px;\n            }\n            .mobile-sheet .grid-cols-\\\\[80px_1fr_80px\\\\] {\n                grid-template-columns: 70px minmax(0,1fr) 64px;\n                gap: 7px;\n            }\n            .mobile-form-sheet {\n                display: flex;\n                flex-direction: column;\n            }\n            .mobile-form-body {\n                flex: 1 1 auto;\n                min-height: 0;\n                overflow-y: auto;\n                padding-right: 2px;\n            }\n            .mobile-form-footer {\n                flex: none;\n                margin-top: 18px;\n                padding-top: 18px;\n                border-top: 1px solid rgba(226,232,240,0.8);\n                background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.42));\n            }\n            .mobile-icon-sheet {\n                height: calc(100vh - 18px);\n            }\n            .mobile-icon-sheet .grid {\n                grid-template-columns: repeat(3, minmax(0, 1fr));\n                gap: 10px;\n                max-height: calc(100vh - 180px);\n            }\n        }\n        ::-webkit-scrollbar { width: 6px; }\n        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }\n    </style>\n</head>\n<body>\n    <div id=\"root\"><div style=\"min-height:100vh;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:700;\">页面加载中...</div></div>\n    <div id=\"boot-error\" style=\"display:none;max-width:760px;margin:48px auto;padding:20px;border:1px solid #7f1d1d;border-radius:16px;background:#1e293b;color:#fecaca;font-family:system-ui;white-space:pre-wrap;\"></div>\n    <script>\n        window.addEventListener('error', (event) => {\n            if (event.message === 'Script error.') return;\n            showBootError('页面脚本错误：' + (event.message || 'Unknown error') + (event.filename ? '\\\\n' + event.filename + ':' + event.lineno : ''));\n        });\n        window.addEventListener('DOMContentLoaded', function() {\n            if (window.Babel && window.Babel.transform) {\n                var scripts = document.querySelectorAll('script[type=\"text/babel\"]');\n                scripts.forEach(function(script) {\n                    try {\n                        window.Babel.transform(script.textContent || '', { presets: ['react'] });\n                    } catch(e) {\n                        showBootError('JSX 编译失败：' + (e.message || e.toString()));\n                    }\n                });\n            }\n        });\n        window.addEventListener('unhandledrejection', (event) => {\n            showBootError('页面异步错误：' + ((event.reason && (event.reason.message || event.reason.toString())) || 'Unknown rejection'));\n        });\n        setTimeout(function() {\n            var root = document.getElementById('root');\n            var bootError = document.getElementById('boot-error');\n            if (root && root.textContent.indexOf('页面加载中') !== -1 && bootError && bootError.style.display === 'none') {\n                showBootError('前端没有启动：' + (window.Babel ? 'Babel 已加载但 JSX 脚本未执行。' : 'Babel CDN 未加载。') + '请清理缓存后重新加载，或检查浏览器控制台。');\n            }\n        }, 3000);\n    </script>\n    <script type=\"text/babel\" data-presets=\"react\">\n        const { useState, useEffect, useRef, useMemo } = React;\n        const APP_VERSION = \"2026.05.19.11\";\n\n        /*\n         * 前端内置 SVG 图标。\n         *\n         * 负责 Icon 基础组件和 Icons 图标集合。后续只改图标路径或新增内置图标时看这里。\n         */\n        // --- 内置 SVG 图标 ---\n        const Icon = ({ path, className = \"w-4 h-4\", viewBox = \"0 0 24 24\" }) => (\n            <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox={viewBox} fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\" className={className} dangerouslySetInnerHTML={{ __html: path }} />\n        );\n        const Icons = {\n            Activity: (p) => <Icon {...p} path='<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"></polyline>' />,\n            Server: (p) => <Icon {...p} path='<rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect><rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect><line x1=\"6\" y1=\"6\" x2=\"6.01\" y2=\"6\"></line><line x1=\"6\" y1=\"18\" x2=\"6.01\" y2=\"18\"></line>' />,\n            Settings: (p) => <Icon {...p} path='<circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"></path>' />,\n            Plus: (p) => <Icon {...p} path='<line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line>' />,\n            Eye: (p) => <Icon {...p} path='<path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>' />,\n            EyeOff: (p) => <Icon {...p} path='<path d=\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>' />,\n            RefreshCw: (p) => <Icon {...p} path='<polyline points=\"23 4 23 10 17 10\"></polyline><polyline points=\"1 20 1 14 7 14\"></polyline><path d=\"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15\"></path>' />,\n            Film: (p) => <Icon {...p} path='<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"2.18\" ry=\"2.18\"></rect><line x1=\"7\" y1=\"2\" x2=\"7\" y2=\"22\"></line><line x1=\"17\" y1=\"2\" x2=\"17\" y2=\"22\"></line><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><line x1=\"2\" y1=\"7\" x2=\"7\" y2=\"7\"></line><line x1=\"2\" y1=\"17\" x2=\"7\" y2=\"17\"></line><line x1=\"17\" y1=\"17\" x2=\"22\" y2=\"17\"></line><line x1=\"17\" y1=\"7\" x2=\"22\" y2=\"7\"></line>' />,\n            Tv: (p) => <Icon {...p} path='<rect x=\"2\" y=\"7\" width=\"20\" height=\"15\" rx=\"2\" ry=\"2\"></rect><polyline points=\"17 2 12 7 7 2\"></polyline>' />,\n            PlaySquare: (p) => <Icon {...p} path='<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"2.18\" ry=\"2.18\"></rect><polygon points=\"10 8 16 12 10 16 10 8\"></polygon>' />,\n            AlertCircle: (p) => <Icon {...p} path='<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"></line>' />,\n            LayoutGrid: (p) => <Icon {...p} path='<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect>' />,\n            BarChart3: (p) => <Icon {...p} path='<path d=\"M3 3v18h18\"></path><rect x=\"18\" y=\"13\" width=\"4\" height=\"8\"></rect><rect x=\"12\" y=\"5\" width=\"4\" height=\"16\"></rect><rect x=\"6\" y=\"9\" width=\"4\" height=\"12\"></rect>' />,\n            CheckCircle2: (p) => <Icon {...p} path='<path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"></path><polyline points=\"22 4 12 14.01 9 11.01\"></polyline>' />,\n            XCircle: (p) => <Icon {...p} path='<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"15\" y1=\"9\" x2=\"9\" y2=\"15\"></line><line x1=\"9\" y1=\"9\" x2=\"15\" y2=\"15\"></line>' />,\n            Clock: (p) => <Icon {...p} path='<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>' />,\n            Cloud: (p) => <Icon {...p} path='<path d=\"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z\"></path>' />,\n            X: (p) => <Icon {...p} path='<line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line>' />,\n            Copy: (p) => <Icon {...p} path='<rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path>' />,\n            Share2: (p) => <Icon {...p} path='<circle cx=\"18\" cy=\"5\" r=\"3\"></circle><circle cx=\"6\" cy=\"12\" r=\"3\"></circle><circle cx=\"18\" cy=\"19\" r=\"3\"></circle><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\"></line><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\"></line>' />,\n            Trash2: (p) => <Icon {...p} path='<polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6\"></path><path d=\"M10 11v6\"></path><path d=\"M14 11v6\"></path><path d=\"M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2\"></path>' />,\n            ExternalLink: (p) => <Icon {...p} path='<path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"></path><polyline points=\"15 3 21 3 21 9\"></polyline><line x1=\"10\" y1=\"14\" x2=\"21\" y2=\"3\"></line>' />,\n            MessageSquare: (p) => <Icon {...p} path='<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"></path>' />,\n            ImageIcon: (p) => <Icon {...p} path='<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"></circle><polyline points=\"21 15 16 10 5 21\"></polyline>' />,\n            Search: (p) => <Icon {...p} path='<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line>' />,\n            Link: (p) => <Icon {...p} path='<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>' />,\n            ShieldCheck: (p) => <Icon {...p} path='<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"></path><path d=\"M9 12l2 2 4-4\"></path>' />,\n            DownloadCloud: (p) => <Icon {...p} path='<polyline points=\"8 17 12 21 16 17\"></polyline><line x1=\"12\" y1=\"12\" x2=\"12\" y2=\"21\"></line><path d=\"M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29\"></path>' />\n        };\n\n\n        /*\n         * 历史状态条组件。\n         *\n         * 负责服务器在线历史、当前状态和延迟的条形展示。后续改历史展示样式或 Tooltip 文案时看这里。\n         */\n        const StatusBars = ({ history = [], currentStatus = 'unknown', currentLatency = 0 }) => {\n            const maxBars = 60;\n            const bucketMs = 60 * 1000;\n            const [hoveredIndex, setHoveredIndex] = useState(null);\n            const buckets = useMemo(() => {\n                const now = Date.now();\n                const end = Math.floor(now / bucketMs) * bucketMs;\n                const start = end - ((maxBars - 1) * bucketMs);\n                const normalized = Array.from({ length: maxBars }, (_, index) => ({\n                    status: null,\n                    time: start + (index * bucketMs),\n                    latency: 0,\n                    count: 0,\n                    filled: false\n                }));\n\n                if (!Array.isArray(history)) return normalized;\n\n                const sortedHistory = history\n                    .filter((item) => item && typeof item === 'object' && item.time && Number.isFinite(Number(item.time)))\n                    .sort((a, b) => Number(a.time) - Number(b.time));\n\n                let carryStatus = null;\n                let carryLatency = 0;\n                sortedHistory.forEach((item) => {\n                    const time = Number(item.time);\n                    if (time < start) {\n                        carryStatus = item.status === 'online' || item.status === 1 || item.value === 1 ? 'online' : 'offline';\n                        carryLatency = Number.isFinite(Number(item.latency)) ? Math.max(0, Number(item.latency)) : 0;\n                    }\n                });\n\n                if (carryStatus) {\n                    normalized[0] = { ...normalized[0], status: carryStatus, latency: carryLatency, filled: true };\n                }\n\n                sortedHistory.forEach((item) => {\n                    if (!item || typeof item !== 'object' || !item.time) return;\n                    const time = Number(item.time);\n                    if (!Number.isFinite(time) || time < start || time > end + bucketMs - 1) return;\n                    const index = Math.min(maxBars - 1, Math.max(0, Math.floor((time - start) / bucketMs)));\n                    const status = item.status === 'online' || item.status === 1 || item.value === 1 ? 'online' : 'offline';\n                    const previous = normalized[index];\n                    normalized[index] = {\n                        status: previous.status === 'offline' || status === 'offline' ? 'offline' : status,\n                        time,\n                        latency: Number.isFinite(Number(item.latency)) ? Math.max(0, Number(item.latency)) : previous.latency,\n                        count: (previous.count || 0) + 1,\n                        filled: false\n                    };\n                });\n\n                for (let index = 1; index < normalized.length; index += 1) {\n                    if (normalized[index].status !== null) continue;\n                    if (normalized[index - 1].status === null) continue;\n                    normalized[index] = {\n                        ...normalized[index],\n                        status: normalized[index - 1].status,\n                        latency: normalized[index - 1].latency,\n                        filled: true\n                    };\n                }\n\n                if (currentStatus === 'online' || currentStatus === 'offline') {\n                    normalized[maxBars - 1] = {\n                        ...normalized[maxBars - 1],\n                        status: currentStatus,\n                        time: now,\n                        latency: Number.isFinite(Number(currentLatency)) ? Math.max(0, Number(currentLatency)) : 0,\n                        filled: normalized[maxBars - 1].count === 0\n                    };\n                }\n\n                return normalized;\n            }, [history, currentStatus, currentLatency]);\n            const formatHistoryTime = (time) => {\n                if (!time) return '暂无记录';\n                return new Date(time).toLocaleString('zh-CN', {\n                    month: '2-digit',\n                    day: '2-digit',\n                    hour: '2-digit',\n                    minute: '2-digit',\n                    second: '2-digit',\n                    hour12: false\n                });\n            };\n            const getHistoryStatus = (item) => {\n                if (!item || item.status === null) return null;\n                return item.status === 'online' ? 1 : 0;\n            };\n            const getHistoryTitle = (item) => {\n                if (!item || item.status === null) return '';\n                const status = getHistoryStatus(item) === 1 ? '在线' : '离线';\n                const time = formatHistoryTime(item.time);\n                const latency = item && item.latency ? '，延迟 ' + item.latency + 'ms' : '';\n                const count = item && item.count > 1 ? '，本分钟 ' + item.count + ' 次探测' : '';\n                return status + ' - ' + time + latency + count;\n            };\n            const getDockStyle = (status, index) => {\n                const baseHeight = status === null ? 8 : 24;\n                if (hoveredIndex === null || status === null) {\n                    return { height: baseHeight + 'px', transform: 'scaleX(1)' };\n                }\n                const isHovered = hoveredIndex === index;\n                return {\n                    height: (baseHeight + (isHovered ? 10 : 0)) + 'px',\n                    transform: isHovered ? 'scaleX(1.12)' : 'scaleX(1)',\n                    zIndex: isHovered ? 20 : 1\n                };\n            };\n            const getHitboxStyle = (status, index) => {\n                return {\n                    height: '48px'\n                };\n            };\n            return (\n                <div data-status-bars className=\"flex flex-col w-full min-w-0 py-1\">\n                    <div className=\"grid grid-cols-[repeat(60,minmax(2px,1fr))] gap-[2px] items-end h-[4.25rem] pt-6 pb-1 overflow-visible\">\n                        {buckets.map((item, i) => {\n                            const status = getHistoryStatus(item);\n                            let color = 'bg-transparent';\n                            if (status === 1) color = 'bg-emerald-400';\n                            if (status === 0) color = 'bg-red-500';\n                            return (\n                                <div\n                                    key={i}\n                                    data-status-hitbox\n                                    onMouseEnter={() => setHoveredIndex(i)}\n                                    onMouseLeave={() => setHoveredIndex(null)}\n                                    className=\"relative flex items-end justify-center overflow-visible\"\n                                    style={getHitboxStyle(status, i)}\n                                >\n                                    {status !== null && (\n                                        <div className={\"absolute bottom-full mb-2 px-2 py-1 rounded-md bg-slate-950 border border-slate-700 text-[10px] text-slate-200 font-bold whitespace-nowrap shadow-xl pointer-events-none transition-all duration-150 \" + (i > maxBars - 8 ? \"right-0\" : i < 8 ? \"left-0\" : \"left-1/2 -translate-x-1/2\") + \" \" + (hoveredIndex === i ? \"opacity-100 translate-y-0\" : \"opacity-0 translate-y-1\")} style={{ zIndex: 50 }}>\n                                            {getHistoryTitle(item)}\n                                        </div>\n                                    )}\n                                    <div\n                                        className={\"w-full max-w-[5px] origin-bottom rounded-full transition-transform duration-150 ease-out hover:opacity-100 will-change-transform \" + (status === null ? \"opacity-0 \" : \"opacity-90 \") + color}\n                                        style={{ ...getDockStyle(status, i), transformOrigin: 'bottom center' }}\n                                    ></div>\n                                </div>\n                            );\n                        })}\n                    </div>\n                    <div className=\"mt-2 flex justify-between w-full border-t border-slate-200/70 pt-1 text-[9px] leading-none text-slate-500 font-bold px-0.5\">\n                        <span>60分钟前</span><span>现在</span>\n                    </div>\n                </div>\n            );\n        };\n\n        /*\n         * 前端主应用。\n         *\n         * 负责管理后台页面状态、服务器配置表单、媒体库配置、公开分享、图标库、更新检查和 React 挂载。\n         * 第一轮拆分保持原 App 逻辑不变；后续新增前端功能通常先从这里定位入口。\n         */\n        const App = () => {\n            const [servers, setServers] = useState([]);\n            const [iconLib, setIconLib] = useState({});\n            const [isRefreshing, setIsRefreshing] = useState(false);\n            const [isSettingsOpen, setIsSettingsOpen] = useState(false);\n            const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n            const [isSavingServer, setIsSavingServer] = useState(false);\n            const [editingServerId, setEditingServerId] = useState(null);\n            const [iconModalTarget, setIconModalTarget] = useState(null);\n            const [shareModalTarget, setShareModalTarget] = useState(null);\n            const [iconInput, setIconInput] = useState('');\n            const [iconSearch, setIconSearch] = useState('');\n            const [privacyMode, setPrivacyMode] = useState(() => {\n                const savedMode = localStorage.getItem('privacy_mode');\n                if (['none', 'url', 'all'].includes(savedMode)) return savedMode;\n                return localStorage.getItem('hide_server_meta') === '1' ? 'all' : 'none';\n            });\n            const [isPrivacyMenuOpen, setIsPrivacyMenuOpen] = useState(false);\n            const [availabilityRange, setAvailabilityRange] = useState(() => localStorage.getItem('availability_range') === 'week' ? 'week' : 'day');\n\n            // 搜索与过滤\n            const [searchQuery, setSearchQuery] = useState('');\n            const [statusFilter, setStatusFilter] = useState('all');\n            const [availabilitySort, setAvailabilitySort] = useState(() => localStorage.getItem('availability_sort') || 'none');\n\n            const [addForm, setAddForm] = useState({ name: '', protocol: 'https://', host: '', port: '443' });\n            const [fallbackUrls, setFallbackUrls] = useState([]);\n            const [mediaForm, setMediaForm] = useState({ enabled: false, username: '', password: '' });\n            const [quickImportText, setQuickImportText] = useState('');\n            const [telegramForm, setTelegramForm] = useState({ enabled: false, botToken: '', chatId: '' });\n            const [isLoading, setIsLoading] = useState(true);\n            const [activeTab, setActiveTab] = useState('cards');\n            const [notifyEnabled, setNotifyEnabled] = useState(false);\n            const [configUpdatedAt, setConfigUpdatedAt] = useState(0);\n            const [configRevision, setConfigRevision] = useState('');\n            const [updateInfo, setUpdateInfo] = useState(null);\n            const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);\n            const [isApplyingUpdate, setIsApplyingUpdate] = useState(false);\n            const [accessDenied, setAccessDenied] = useState('');\n            const [publicShareLink, setPublicShareLink] = useState('');\n            const [publicShareExpiresAt, setPublicShareExpiresAt] = useState(0);\n            const [isGeneratingPublicShare, setIsGeneratingPublicShare] = useState(false);\n            const [publicShareIncludeProfile, setPublicShareIncludeProfile] = useState(false);\n            const [publicShareLifetime, setPublicShareLifetime] = useState('hour');\n            const [publicShareHideCounts, setPublicShareHideCounts] = useState(false);\n            const [deletingPublicShareToken, setDeletingPublicShareToken] = useState('');\n            const [publicShareStats, setPublicShareStats] = useState([]);\n            const [isLoadingPublicShareStats, setIsLoadingPublicShareStats] = useState(false);\n            const [cardShareLinks, setCardShareLinks] = useState({});\n            const [generatingCardShareId, setGeneratingCardShareId] = useState(null);\n            const [toastMessage, setToastMessage] = useState('');\n            const privacyMenuRef = useRef(null);\n            const configRevisionRef = useRef('');\n            const configUpdatedAtRef = useRef(0);\n\n            // API 调用封装\n            const apiFetch = async (path, options = {}) => {\n                const headers = { ...(options.headers || {}) };\n                const adminToken = localStorage.getItem('emby_admin_token') || '';\n                if (adminToken) headers.Authorization = 'Bearer ' + adminToken;\n                return fetch(path, { ...options, headers });\n            };\n\n            const fetchConfigData = async () => {\n                try {\n                    const res = await apiFetch('/api/config');\n                    if (res.status === 401 || res.status === 403) {\n                        const errorData = await res.json().catch(() => ({}));\n                        if (errorData.error === 'ADMIN_TOKEN_REQUIRED') {\n                            setAccessDenied('未配置 ADMIN_TOKEN，后台已被锁定。请先在 Cloudflare Worker 环境变量中设置 ADMIN_TOKEN。');\n                            setIsLoading(false);\n                            return;\n                        }\n                        const token = prompt('请输入管理 Token');\n                        if (token) {\n                            localStorage.setItem('emby_admin_token', token);\n                            return fetchConfigData();\n                        }\n                        setAccessDenied('未提供管理 Token，已阻止进入后台。');\n                        setIsLoading(false);\n                        return;\n                    }\n                    const data = await res.json();\n                    setServers(Array.isArray(data.servers) ? data.servers : []);\n                    const nextUpdatedAt = Number(data.updatedAt) || 0;\n                    const nextRevision = data.revision || '';\n                    setConfigUpdatedAt(nextUpdatedAt);\n                    setConfigRevision(nextRevision);\n                    configUpdatedAtRef.current = nextUpdatedAt;\n                    configRevisionRef.current = nextRevision;\n                    setNotifyEnabled(Boolean(data.notifyEnabled));\n                    setTelegramForm(data.telegram || { enabled: false, botToken: '', chatId: '' });\n                    if (data.icons) {\n                        setIconLib(data.icons);\n                        setIconInput(localStorage.getItem('last_icon_input') || \"\");\n                    }\n                    checkForUpdate(false);\n                } catch(e) { console.error(\"读取配置失败\", e); }\n            };\n\n            useEffect(() => { fetchConfigData().finally(() => setIsLoading(false)); }, []);\n            useEffect(() => { configRevisionRef.current = configRevision; }, [configRevision]);\n            useEffect(() => { configUpdatedAtRef.current = configUpdatedAt; }, [configUpdatedAt]);\n            useEffect(() => { if (iconModalTarget) setIconSearch(''); }, [iconModalTarget]);\n            useEffect(() => {\n                localStorage.setItem('privacy_mode', privacyMode);\n                localStorage.setItem('hide_server_meta', privacyMode === 'all' ? '1' : '0');\n            }, [privacyMode]);\n            useEffect(() => {\n                if (!toastMessage) return;\n                const timer = setTimeout(() => setToastMessage(''), 1800);\n                return () => clearTimeout(timer);\n            }, [toastMessage]);\n            useEffect(() => {\n                if (shareModalTarget === 'public') fetchPublicShareStats();\n            }, [shareModalTarget]);\n            useEffect(() => {\n                const onPointerDown = (event) => {\n                    if (!isPrivacyMenuOpen) return;\n                    if (event.target && event.target.closest && event.target.closest('[data-privacy-dialog=\"true\"]')) return;\n                    if (privacyMenuRef.current && !privacyMenuRef.current.contains(event.target)) setIsPrivacyMenuOpen(false);\n                };\n                const onKeyDown = (event) => {\n                    if (event.key === 'Escape') setIsPrivacyMenuOpen(false);\n                };\n                document.addEventListener('pointerdown', onPointerDown);\n                document.addEventListener('keydown', onKeyDown);\n                return () => {\n                    document.removeEventListener('pointerdown', onPointerDown);\n                    document.removeEventListener('keydown', onKeyDown);\n                };\n            }, [isPrivacyMenuOpen]);\n            useEffect(() => { localStorage.setItem('availability_range', availabilityRange); }, [availabilityRange]);\n            useEffect(() => { localStorage.setItem('availability_sort', availabilitySort); }, [availabilitySort]);\n\n            const syncToCloud = async (newServers, newIcons, nextTelegram = telegramForm, options = {}) => {\n                const serverById = new Map(servers.map(s => [s.id, s]));\n                const mergedServers = newServers.map((server) => {\n                    const existing = serverById.get(server.id);\n                    if (existing && existing.mediaStats && !server.mediaStats) return { ...server, mediaStats: existing.mediaStats };\n                    return server;\n                });\n                const saveConfig = async (serversToSave, iconsToSave, telegramToSave, baseRevision) => {\n                    const nextUpdatedAt = Date.now();\n                    setConfigUpdatedAt(nextUpdatedAt);\n                    configUpdatedAtRef.current = nextUpdatedAt;\n                    const res = await apiFetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ servers: serversToSave, icons: iconsToSave, telegram: telegramToSave, updatedAt: nextUpdatedAt, baseRevision }) });\n                    const saveResult = await res.json().catch(() => ({}));\n                    return { res, saveResult, nextUpdatedAt };\n                };\n                setServers(mergedServers);\n                setIconLib(newIcons || {});\n                setTelegramForm(nextTelegram);\n                let { res, saveResult, nextUpdatedAt } = await saveConfig(mergedServers, newIcons, nextTelegram, configRevisionRef.current);\n                if (!res.ok && res.status === 409 && options.addServerOnConflict) {\n                    const latestRes = await apiFetch('/api/config');\n                    if (!latestRes.ok) throw new Error('配置已被其它页面修改，请刷新后再保存');\n                    const latestConfig = await latestRes.json();\n                    const latestServers = Array.isArray(latestConfig.servers) ? latestConfig.servers : [];\n                    const retryServers = latestServers.some(server => server.id === options.addServerOnConflict.id) ? latestServers : [...latestServers, options.addServerOnConflict];\n                    const retryIcons = latestConfig.icons || {};\n                    const retryTelegram = latestConfig.telegram || nextTelegram;\n                    const latestUpdatedAt = Number(latestConfig.updatedAt) || configUpdatedAtRef.current;\n                    const latestRevision = latestConfig.revision || '';\n                    setConfigUpdatedAt(latestUpdatedAt);\n                    setConfigRevision(latestRevision);\n                    configUpdatedAtRef.current = latestUpdatedAt;\n                    configRevisionRef.current = latestRevision;\n                    setServers(retryServers);\n                    setIconLib(retryIcons);\n                    setTelegramForm(retryTelegram);\n                    ({ res, saveResult, nextUpdatedAt } = await saveConfig(retryServers, retryIcons, retryTelegram, latestRevision));\n                }\n                if (!res.ok) {\n                    if (res.status === 409) {\n                        await fetchConfigData();\n                        throw new Error('配置已被其它页面修改，请检查最新配置后重新保存');\n                    }\n                    throw new Error('配置保存失败');\n                }\n                const nextRevision = saveResult.revision || '';\n                setConfigRevision(nextRevision);\n                configRevisionRef.current = nextRevision;\n                return nextUpdatedAt;\n            };\n\n            const manualPing = async (currentServers = servers, requestUpdatedAt = configUpdatedAt, options = {}) => {\n                if (isRefreshing || !currentServers.length) return;\n                setIsRefreshing(true);\n                try {\n                    let cursor = 0;\n                    let updatedData = null;\n                    do {\n                        const res = await apiFetch('/api/ping-all', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ forceMedia: Boolean(options.forceMedia), cursor }) });\n                        if (!res.ok) throw new Error('测速接口异常');\n                        updatedData = await res.json();\n                        setServers(updatedData.servers);\n                        setIconLib(updatedData.icons);\n                        setTelegramForm(updatedData.telegram || telegramForm);\n                        const nextUpdatedAt = Number(updatedData.updatedAt) || configUpdatedAtRef.current;\n                        const nextRevision = updatedData.revision || configRevisionRef.current;\n                        setConfigUpdatedAt(nextUpdatedAt);\n                        setConfigRevision(nextRevision);\n                        configUpdatedAtRef.current = nextUpdatedAt;\n                        configRevisionRef.current = nextRevision;\n                        setNotifyEnabled(Boolean(updatedData.notifyEnabled));\n                        cursor = updatedData.nextCursor || 0;\n                    } while (updatedData && updatedData.hasMore);\n                } catch(e) {\n                    alert(\"测速接口异常\");\n                } finally {\n                    setIsRefreshing(false);\n                }\n            };\n\n            const getProxyImgSrc = (u) => {\n                if (!u) return \"\";\n                if (u.startsWith('data:')) return u;\n                return \"/proxy-img?url=\" + encodeURIComponent(u);\n            };\n\n            const getSafeIconLib = () => (typeof iconLib === 'object' && iconLib !== null && !Array.isArray(iconLib)) ? iconLib : {};\n            const getShareBaseUrl = () => window.location.origin;\n            const getPublicUrl = () => publicShareLink || (getShareBaseUrl() + '/public');\n            const formatStatTime = (value) => {\n                const time = Number(value) || 0;\n                return time ? new Date(time).toLocaleString('zh-CN', { hour12: false }) : '--';\n            };\n            const formatShareExpires = (value) => {\n                const time = Number(value) || 0;\n                return time ? new Date(time).toLocaleString('zh-CN', { hour12: false }) : '永久有效';\n            };\n            const copyText = async (text, label = '内容') => {\n                try {\n                    await navigator.clipboard.writeText(text);\n                    setToastMessage(label + '已复制');\n                } catch(e) {\n                    window.prompt('复制 ' + label, text);\n                }\n            };\n            const normalizeTextForMatch = (value) => String(value || '').normalize('NFKC').toLowerCase();\n            const getDisplayIcon = (server) => {\n                if (server.customIcon) return server.customIcon;\n                if (!server.name) return null;\n                const n = normalizeTextForMatch(server.name);\n                const safeIcons = getSafeIconLib();\n                for (let k in safeIcons) { if (n.includes(normalizeTextForMatch(k))) return safeIcons[k]; }\n                return null;\n            };\n\n            const generatePublicShareLink = async () => {\n                setIsGeneratingPublicShare(true);\n                try {\n                    const res = await apiFetch('/api/public/share-token', {\n                        method: 'POST',\n                        headers: { 'Content-Type': 'application/json' },\n                        body: JSON.stringify({ includeTelegramProfile: publicShareIncludeProfile, lifetime: publicShareLifetime, hideCounts: publicShareHideCounts })\n                    });\n                    const data = await res.json().catch(() => ({}));\n                    if (!res.ok || !data.ok || !data.url) throw new Error(data.error || '生成公开链接失败');\n                    setPublicShareLink(data.url);\n                    setPublicShareExpiresAt(Number(data.expiresAt) || 0);\n                    await fetchPublicShareStats();\n                } catch(e) {\n                    alert(e.message || '生成公开链接失败');\n                } finally {\n                    setIsGeneratingPublicShare(false);\n                }\n            };\n\n            const deletePublicShareLink = async (token) => {\n                if (!token) return;\n                if (!window.confirm('删除这个公开页链接？删除后访问会立即失效。')) return;\n                setDeletingPublicShareToken(token);\n                try {\n                    const res = await apiFetch('/api/public/share-token/' + encodeURIComponent(token), { method: 'DELETE' });\n                    const data = await res.json().catch(() => ({}));\n                    if (!res.ok || !data.ok) throw new Error(data.error || '删除公开链接失败');\n                    setPublicShareStats((items) => items.filter((item) => item.token !== token));\n                    if (publicShareLink && publicShareLink.endsWith('/public/' + token)) {\n                        setPublicShareLink('');\n                        setPublicShareExpiresAt(0);\n                    }\n                } catch(e) {\n                    alert(e.message || '删除公开链接失败');\n                } finally {\n                    setDeletingPublicShareToken('');\n                }\n            };\n\n            const fetchPublicShareStats = async () => {\n                setIsLoadingPublicShareStats(true);\n                try {\n                    const res = await apiFetch('/api/public/share-stats');\n                    const data = await res.json().catch(() => ({}));\n                    if (!res.ok || !Array.isArray(data.items)) throw new Error(data.error || '读取公开页统计失败');\n                    setPublicShareStats(data.items);\n                } catch(e) {\n                    console.error(e);\n                } finally {\n                    setIsLoadingPublicShareStats(false);\n                }\n            };\n\n            const generateCardShareLink = async (serverId) => {\n                setGeneratingCardShareId(serverId);\n                try {\n                    const res = await apiFetch('/api/card/share-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ serverId }) });\n                    const data = await res.json().catch(() => ({}));\n                    if (!res.ok || !data.ok || !data.url) throw new Error(data.error || '生成卡片图片失败');\n                    setCardShareLinks((current) => ({ ...current, [serverId]: { url: data.url, expiresAt: Number(data.expiresAt) || 0 } }));\n                } catch(e) {\n                    alert(e.message || '生成卡片图片失败');\n                } finally {\n                    setGeneratingCardShareId(null);\n                }\n            };\n\n            const getHistoryStatus = (item) => {\n                if (typeof item === 'number') return item ? 'online' : 'offline';\n                if (item && typeof item === 'object') return item.status === 'online' ? 'online' : 'offline';\n                return 'unknown';\n            };\n\n            const getAvailabilityStats = (server, range = availabilityRange) => {\n                const now = Date.now();\n                const rangeMs = range === 'week' ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;\n                const history = Array.isArray(server.history) ? server.history.filter(item => item && typeof item === 'object' && item.time && item.time >= now - rangeMs) : [];\n                const valid = history.filter(item => getHistoryStatus(item) !== 'unknown');\n                const online = valid.filter(item => getHistoryStatus(item) === 'online').length;\n                const offline = valid.reduce((count, item, index) => {\n                    if (getHistoryStatus(item) !== 'offline') return count;\n                    const previous = valid[index - 1];\n                    return !previous || getHistoryStatus(previous) !== 'offline' ? count + 1 : count;\n                }, 0);\n                return {\n                    total: valid.length,\n                    online,\n                    offline,\n                    uptime: valid.length ? ((online / valid.length) * 100).toFixed(1) : '---'\n                };\n            };\n\n            const stripProtocol = (value) => {\n                const text = String(value || '');\n                const lower = text.toLowerCase();\n                if (lower.startsWith('http://')) return text.slice(7);\n                if (lower.startsWith('https://')) return text.slice(8);\n                return text;\n            };\n            const cleanPortInput = (value) => value.split('').filter(ch => ch >= '0' && ch <= '9').join('').slice(0, 5);\n\n            const resetServerForm = () => {\n                setAddForm({ name: '', protocol: 'https://', host: '', port: '443' });\n                setFallbackUrls([]);\n                setMediaForm({ enabled: false, username: '', password: '' });\n                setQuickImportText('');\n                setEditingServerId(null);\n            };\n\n            const splitServerUrl = (value) => {\n                let raw = String(value || '').trim();\n                const lowerRaw = raw.toLowerCase();\n                if (!lowerRaw.startsWith('http://') && !lowerRaw.startsWith('https://')) raw = 'https://' + raw;\n                try {\n                    const parsed = new URL(raw);\n                    return { protocol: parsed.protocol === 'http:' ? 'http://' : 'https://', host: parsed.hostname, port: parsed.port || (parsed.protocol === 'http:' ? '80' : '443') };\n                } catch(e) {\n                    return { protocol: 'https://', host: value || '', port: '443' };\n                }\n            };\n\n            const updateHostFromInput = (value) => {\n                const parsed = splitServerUrl(value);\n                setAddForm({...addForm, protocol: parsed.protocol, host: parsed.host, port: parsed.port});\n            };\n\n            const normalizeFallbackUrlInput = (value) => {\n                let raw = String(value || '').trim();\n                if (!raw) return '';\n                const lowerRaw = raw.toLowerCase();\n                if (!lowerRaw.startsWith('http://') && !lowerRaw.startsWith('https://')) raw = 'https://' + raw;\n                try {\n                    const parsed = new URL(raw);\n                    parsed.hash = '';\n                    const normalized = parsed.toString();\n                    return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;\n                } catch(e) {\n                    return raw.endsWith('/') ? raw.slice(0, -1) : raw;\n                }\n            };\n\n            const normalizeFallbackUrlsForSave = (mainUrl) => {\n                const seen = new Set([String(mainUrl || '').toLowerCase()]);\n                const clean = [];\n                for (const value of fallbackUrls) {\n                    const normalized = normalizeFallbackUrlInput(value);\n                    const key = normalized.toLowerCase();\n                    if (!normalized || seen.has(key)) continue;\n                    seen.add(key);\n                    clean.push(normalized);\n                    if (clean.length >= 4) break;\n                }\n                return clean;\n            };\n\n            const updateFallbackUrl = (index, value) => {\n                setFallbackUrls((current) => current.map((item, i) => i === index ? value : item));\n            };\n\n            const addFallbackUrl = () => {\n                setFallbackUrls((current) => current.length >= 4 ? current : current.concat(''));\n            };\n\n            const removeFallbackUrl = (index) => {\n                setFallbackUrls((current) => current.filter((_, i) => i !== index));\n            };\n\n            const extractFieldFromText = (lines, labels, skipPattern) => {\n                const labelPattern = labels.join('|');\n                const directPattern = new RegExp('^(?:' + labelPattern + ')\\\\\\\\s*(?:[|:：=\\\\\\\\-]+)?\\\\\\\\s*(.+)\n    </script>\n    <script>\n        setTimeout(function() {\n            var root = document.getElementById('root');\n            if (!window.__EMBY_DASHBOARD_BOOTED__ && root && root.textContent.indexOf('页面加载中') !== -1) {\n                root.innerHTML = '<div style=\"max-width:760px;margin:48px auto;padding:20px;border:1px solid #7f1d1d;border-radius:16px;background:#1e293b;color:#fecaca;font-family:system-ui;white-space:pre-wrap;\">前端启动失败：React/Babel 脚本没有完成渲染。请确认部署的是最新 emby.js，并打开浏览器控制台查看具体报错。</div>';\n            }\n        }, 4500);\n    </script>\n</body>\n</html>\n, 'i');\n                for (const line of lines) {\n                    const clean = line.replace(/^[\\\\s·•*\\\\-_|▎]+/, '').trim();\n                    if (!clean || (skipPattern && skipPattern.test(clean))) continue;\n                    const directMatch = clean.match(directPattern);\n                    if (directMatch && directMatch[1]) return directMatch[1].trim();\n                    for (const label of labels) {\n                        const index = clean.toLowerCase().indexOf(label.toLowerCase());\n                        if (index < 0) continue;\n                        const rest = clean.slice(index + label.length).replace(/^[\\\\s|:：=\\\\-]+/, '').trim();\n                        if (rest) return rest;\n                    }\n                }\n                return '';\n            };\n\n            const parseQuickImportText = (value) => {\n                const text = String(value || '');\n                const lines = text.split(/\\\\r?\\\\n/);\n                const urlMatch = text.match(/https?:\\\\/\\\\/[^\\\\s\"'<>，。；、）)】]+/i);\n                const rawUrl = urlMatch ? urlMatch[0].replace(/[.,;，。；]+$/, '') : '';\n                return {\n                    username: extractFieldFromText(lines, ['用户名称', '用户名', '账号', '账户', 'user name', 'username', 'user'], /安全密码|到期|线路|服务器/i),\n                    password: extractFieldFromText(lines, ['用户密码', '登录密码', '密码', 'password', 'pass'], /安全密码|安全码|pin|到期|线路|服务器/i),\n                    url: rawUrl\n                };\n            };\n\n            const applyQuickImportText = () => {\n                const value = quickImportText.trim();\n                if (!value) return alert('请先粘贴包含服务器、用户名或密码的信息');\n                const parsed = parseQuickImportText(value);\n                const hasRecognizedField = Boolean(parsed.url || parsed.username || parsed.password);\n                if (!hasRecognizedField) return alert('没有识别到服务器地址、用户名或密码');\n                if (parsed.url) {\n                    const parsedUrl = splitServerUrl(parsed.url);\n                    setAddForm((current) => ({ ...current, name: current.name || parsed.username || parsedUrl.host, protocol: parsedUrl.protocol, host: parsedUrl.host, port: parsedUrl.port }));\n                } else if (parsed.username) {\n                    setAddForm((current) => ({ ...current, name: current.name || parsed.username }));\n                }\n                if (parsed.username || parsed.password) {\n                    setMediaForm((current) => ({ ...current, enabled: true, username: parsed.username || current.username, password: parsed.password || current.password }));\n                }\n            };\n\n            const toggleProtocol = () => {\n                const nextProtocol = addForm.protocol === 'https://' ? 'http://' : 'https://';\n                const defaultPort = nextProtocol === 'https://' ? '443' : '80';\n                setAddForm({...addForm, protocol: nextProtocol, port: (!addForm.port || addForm.port === '443' || addForm.port === '80') ? defaultPort : addForm.port});\n            };\n\n            const buildServerUrlFromForm = () => {\n                let host = addForm.host.trim();\n                const lowerHost = host.toLowerCase();\n                if (lowerHost.startsWith('http://')) host = host.slice(7);\n                if (lowerHost.startsWith('https://')) host = host.slice(8);\n                const slashIndex = host.indexOf('/');\n                if (slashIndex >= 0) host = host.slice(0, slashIndex);\n                const colonIndex = host.lastIndexOf(':');\n                const hasPort = colonIndex > 0 && !host.includes(']') && host.slice(colonIndex + 1).split('').every(ch => ch >= '0' && ch <= '9');\n                const hostParts = hasPort ? [host, host.slice(0, colonIndex), host.slice(colonIndex + 1)] : null;\n                const finalHost = hostParts ? hostParts[1] : host;\n                const port = (hostParts ? hostParts[2] : addForm.port).trim();\n                if (!finalHost) return '';\n                return addForm.protocol + finalHost + (port ? ':' + port : '');\n            };\n\n            const openAddServerModal = () => { resetServerForm(); setIsAddModalOpen(true); };\n            const openEditServerModal = (server) => {\n                const parsed = splitServerUrl(server.url || '');\n                setEditingServerId(server.id);\n                setAddForm({ name: server.name || '', protocol: parsed.protocol, host: parsed.host, port: parsed.port });\n                setFallbackUrls(Array.isArray(server.fallbackUrls) ? server.fallbackUrls.slice(0, 4) : []);\n                setMediaForm({\n                    enabled: Boolean(server.mediaStats && server.mediaStats.enabled),\n                    username: server.mediaStats ? server.mediaStats.username || '' : '',\n                    password: server.mediaStats ? server.mediaStats.password || '' : ''\n                });\n                setIsAddModalOpen(true);\n            };\n\n            const handleSaveServer = async () => {\n                if(!addForm.name || !addForm.host) return alert(\"请填写名称和地址\");\n                if (isSavingServer || isRefreshing) return;\n                setIsSavingServer(true);\n                try {\n                let finalUrl = buildServerUrlFromForm();\n                if (finalUrl.endsWith('/')) finalUrl = finalUrl.slice(0, -1);\n                const cleanFallbackUrls = normalizeFallbackUrlsForSave(finalUrl);\n\n                const buildMediaStats = (existing) => {\n                    const previousMedia = existing && existing.mediaStats ? existing.mediaStats : {};\n                    const credentialsChanged = previousMedia.username !== mediaForm.username.trim() || previousMedia.password !== mediaForm.password;\n                    return {\n                        enabled: mediaForm.enabled, username: mediaForm.enabled ? mediaForm.username.trim() : '', password: mediaForm.enabled ? mediaForm.password : '',\n                        deviceId: previousMedia.deviceId || ('forward-' + Date.now().toString(36)),\n                        accessToken: mediaForm.enabled && !credentialsChanged ? (previousMedia.accessToken || '') : '',\n                        lastCheck: mediaForm.enabled && !credentialsChanged ? (previousMedia.lastCheck || 0) : 0,\n                        lastError: '', counts: mediaForm.enabled && !credentialsChanged ? (previousMedia.counts || null) : null,\n                        previousCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.previousCounts || null) : null,\n                        delta24h: mediaForm.enabled && !credentialsChanged ? (previousMedia.delta24h || null) : null,\n                        todayCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.todayCounts || null) : null,\n                        yesterdayCounts: mediaForm.enabled && !credentialsChanged ? (previousMedia.yesterdayCounts || null) : null,\n                        dailyDelta: mediaForm.enabled && !credentialsChanged ? (previousMedia.dailyDelta || null) : null,\n                        dailyKey: mediaForm.enabled && !credentialsChanged ? (previousMedia.dailyKey || '') : ''\n                    };\n                };\n\n                let updatedServers;\n                let newServer = null;\n                if (editingServerId) {\n                    updatedServers = servers.map((server) => {\n                        if (server.id !== editingServerId) return server;\n                        const previousFallbackUrls = Array.isArray(server.fallbackUrls) ? server.fallbackUrls : [];\n                        const fallbackChanged = JSON.stringify(previousFallbackUrls) !== JSON.stringify(cleanFallbackUrls);\n                        const urlChanged = server.url !== finalUrl || fallbackChanged;\n                        return { ...server, name: addForm.name, url: finalUrl, fallbackUrls: cleanFallbackUrls, status: urlChanged ? 'updating' : server.status, latency: urlChanged ? 0 : server.latency, mediaStats: buildMediaStats(server) };\n                    });\n                } else {\n                    newServer = {\n                        id: Date.now(), name: addForm.name, url: finalUrl, fallbackUrls: cleanFallbackUrls, customIcon: null, status: 'updating',\n                        totalChecks: 0, successfulChecks: 0, uptime: \"0.0\", latency: 0, lastCheck: 0, history: [], mediaStats: buildMediaStats(null)\n                    };\n                    updatedServers = [...servers, newServer];\n                }\n\n                const savedUpdatedAt = await syncToCloud(updatedServers, iconLib, telegramForm, newServer ? { addServerOnConflict: newServer } : {});\n                const serversToPing = newServer ? [...servers.filter(server => server.id !== newServer.id), newServer] : updatedServers;\n                setIsAddModalOpen(false); resetServerForm(); setActiveTab('cards');\n                await manualPing(serversToPing, savedUpdatedAt);\n                } catch(e) {\n                    console.error('保存服务器失败', e);\n                    alert(e.message || '服务器保存失败，请稍后重试');\n                } finally {\n                    setIsSavingServer(false);\n                }\n            };\n\n            const handleSaveTelegram = async () => {\n                const nextTelegram = { enabled: Boolean(telegramForm.enabled), botToken: telegramForm.botToken.trim(), chatId: telegramForm.chatId.trim() };\n                try {\n                    setTelegramForm(nextTelegram);\n                    await syncToCloud(servers, iconLib, nextTelegram);\n                    setNotifyEnabled(nextTelegram.enabled && nextTelegram.botToken && nextTelegram.chatId);\n                    alert(\"Telegram 配置已保存\");\n                } catch(e) { alert(\"Telegram 配置保存失败\"); }\n            };\n\n            const handleSyncIcons = async () => {\n                if(!iconInput.includes('http')) return alert(\"请输入 JSON 链接\");\n                try {\n                    const r = await apiFetch(\"/api/fetch-icons?url=\" + encodeURIComponent(iconInput));\n                    if (!r.ok) throw new Error(await r.text() || '图标库拉取失败');\n                    const icons = await r.json();\n                    if (!icons || typeof icons !== 'object' || Array.isArray(icons) || Object.keys(icons).length === 0) throw new Error('没有从该 JSON 中识别到图片链接');\n                    setIconLib(icons); localStorage.setItem('last_icon_input', iconInput);\n                    await syncToCloud(servers, icons);\n                    alert(\"图标库拉取并提取成功！\");\n                } catch(e) { alert(\"解析失败：\" + (e.message || \"请检查 JSON 链接格式。\")); }\n            };\n\n            const checkForUpdate = async (showAlert = true) => {\n                setIsCheckingUpdate(true);\n                try {\n                    const r = await apiFetch('/api/update/check');\n                    if (r.status === 401) { if (showAlert) alert('请先输入正确的管理 Token'); return; }\n                    const data = await r.json();\n                    setUpdateInfo(data);\n                    if (showAlert) {\n                        const notes = Array.isArray(data.releaseNotes) && data.releaseNotes.length ? '\\\\n\\\\n更新内容：\\\\n' + data.releaseNotes.map(note => '- ' + note).join('\\\\n') : '';\n                        alert(data.hasUpdate ? ('发现新版本：' + data.latestVersion + notes) : '当前已经是最新版本');\n                    }\n                } catch(e) {\n                    if (showAlert) alert('检查更新失败：' + (e.message || '网络异常'));\n                } finally { setIsCheckingUpdate(false); }\n            };\n\n            const applyUpdate = async () => {\n                if (!updateInfo || !updateInfo.hasUpdate) return alert('当前没有可更新版本');\n                if (!updateInfo.canUpdate) return alert('当前 Worker 没有配置自更新环境变量，请按 README 配置 CF_ACCOUNT_ID、CF_WORKER_NAME、CF_API_TOKEN 和 UPDATE_ENABLED');\n                if (!confirm('确认更新到 ' + updateInfo.latestVersion + '？更新会覆盖当前 Worker 代码，但不会清空 KV 配置。')) return;\n                setIsApplyingUpdate(true);\n                try {\n                    const r = await apiFetch('/api/update/apply', { method: 'POST' });\n                    const data = await r.json().catch(() => ({}));\n                    if (!r.ok || !data.ok) throw new Error(data.error || '更新失败');\n                    const notes = Array.isArray(data.releaseNotes) && data.releaseNotes.length ? '\\\\n\\\\n更新内容：\\\\n' + data.releaseNotes.map(note => '- ' + note).join('\\\\n') : '';\n                    alert('更新完成，页面即将刷新' + notes);\n                    setTimeout(() => location.reload(), 1200);\n                } catch(e) { alert('更新失败：' + (e.message || 'Cloudflare API 调用异常')); } finally { setIsApplyingUpdate(false); }\n            };\n\n            if (accessDenied) return <div className=\"flex items-center justify-center min-h-screen p-6 text-center\"><div className=\"max-w-lg w-full glass-panel bg-white/80 rounded-[2rem] p-8 shadow-2xl border border-white\"><div className=\"text-rose-600 font-black text-lg mb-2\">访问被拒绝</div><div className=\"text-slate-600 text-sm font-semibold whitespace-pre-wrap\">{accessDenied}</div></div></div>;\n            if (isLoading) return <div className=\"flex items-center justify-center min-h-screen text-slate-500 font-bold\">读取云端配置中...</div>;\n\n            // 动态数据计算\n            const onlineCount = servers.filter(s => s.status === 'online').length;\n            const offlineCount = servers.filter(s => s.status === 'offline').length;\n            const validUptimeServers = servers.filter(s => getAvailabilityStats(s).uptime !== '---');\n            const avgUptime = validUptimeServers.length > 0\n                ? (validUptimeServers.reduce((acc, s) => acc + parseFloat(getAvailabilityStats(s).uptime), 0) / validUptimeServers.length).toFixed(1)\n                : '0.0';\n            const notifyLabel = notifyEnabled ? '已开启' : '未开启';\n            const hideServerName = privacyMode === 'all';\n            const hideServerUrl = privacyMode === 'url' || privacyMode === 'all';\n            const privacyLabel = privacyMode === 'all' ? '全部隐藏' : privacyMode === 'url' ? '隐藏地址' : '正常显示';\n            const privacyOptions = [\n                { mode: 'none', label: '正常显示', desc: '显示名称和地址' },\n                { mode: 'url', label: '只隐藏地址', desc: '保留名称和图标' },\n                { mode: 'all', label: '全部隐藏', desc: '隐藏名称、地址和图标' }\n            ];\n\n            const safeIconEntries = Object.entries(getSafeIconLib());\n            const iconSearchTerm = normalizeTextForMatch(iconSearch.trim());\n            const filteredIconEntries = iconSearchTerm\n                ? safeIconEntries.filter(([key, url]) => normalizeTextForMatch(key + ' ' + url).includes(iconSearchTerm))\n                : safeIconEntries;\n\n            const normalizedSearchQuery = normalizeTextForMatch(searchQuery);\n            const baseFilteredServers = servers.filter(s => {\n                const matchSearch = normalizeTextForMatch(s.name).includes(normalizedSearchQuery) || normalizeTextForMatch(s.url).includes(normalizedSearchQuery);\n                const matchStatus = statusFilter === 'all' || s.status === statusFilter;\n                return matchSearch && matchStatus;\n            });\n            const getAvailabilityScore = (server) => {\n                const uptime = getAvailabilityStats(server).uptime;\n                return uptime === '---' ? null : parseFloat(uptime);\n            };\n            const sortServers = (list) => {\n                const rank = { offline: 0, updating: 1, unknown: 2, online: 3 };\n                return [...list].sort((a, b) => {\n                    if (availabilitySort === 'asc' || availabilitySort === 'desc') {\n                        const aScore = getAvailabilityScore(a);\n                        const bScore = getAvailabilityScore(b);\n                        const aVal = aScore === null ? (availabilitySort === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY) : aScore;\n                        const bVal = bScore === null ? (availabilitySort === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY) : bScore;\n                        if (aVal !== bVal) return availabilitySort === 'asc' ? aVal - bVal : bVal - aVal;\n                    }\n                    const aRank = rank[a.status] !== undefined ? rank[a.status] : 2;\n                    const bRank = rank[b.status] !== undefined ? rank[b.status] : 2;\n                    const statusDiff = aRank - bRank;\n                    if (statusDiff !== 0) return statusDiff;\n                    return (b.latency || 0) - (a.latency || 0);\n                });\n            };\n            const filteredServers = sortServers(baseFilteredServers);\n            const sortedServers = filteredServers;\n            const availabilitySortArrow = availabilitySort === 'asc' ? '↑' : availabilitySort === 'desc' ? '↓' : '';\n            const nextAvailabilitySort = () => setAvailabilitySort(availabilitySort === 'none' ? 'asc' : availabilitySort === 'asc' ? 'desc' : 'none');\n\n            return (\n                <div className=\"app-shell min-h-screen relative overflow-x-hidden\">\n                    {toastMessage && (\n                        <div className=\"fixed right-4 bottom-4 z-[70] px-4 py-3 rounded-2xl bg-slate-900/90 text-white text-sm font-bold shadow-2xl border border-white/10 backdrop-blur-md\">\n                            {toastMessage}\n                        </div>\n                    )}\n                    <div className=\"bg-canvas\" aria-hidden=\"true\">\n                        <div className=\"orb orb-1\"></div>\n                        <div className=\"orb orb-2\"></div>\n                        <div className=\"orb orb-3\"></div>\n                        <div className=\"orb orb-4\"></div>\n                    </div>\n\n                    <div className=\"mobile-page w-full max-w-[1600px] mx-auto px-4 py-8 md:px-8 md:py-12 relative z-10\">\n                        {/* Header */}\n                        <header className=\"mobile-header flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6\">\n                            <div className=\"mobile-title-row\">\n                                <h1 className=\"text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3\">\n                                    <div className=\"brand-icon-shell w-14 h-14 rounded-[1.1rem] backdrop-blur-sm flex items-center justify-center\">\n                                        <Icons.Cloud className=\"w-8 h-8 text-sky-500 drop-shadow-sm\" />\n                                    </div>\n                                    <span className=\"brand-title\">\n                                        Emby 服务器探针\n                                    </span>\n                                </h1>\n                                <p className=\"mobile-subtitle text-[11px] text-slate-500 font-bold tracking-widest mt-3 uppercase flex items-center gap-2\">\n                                    <span className=\"w-2 h-2 rounded-full dot-online\"></span>\n                                    Emby server probe\n                                </p>\n                            </div>\n\n                            <div className=\"mobile-actions flex flex-wrap items-center gap-3\">\n                                {/* 辅助功能组 (Icon-only) */}\n                                <div className=\"mobile-icon-group flex items-center gap-2 mr-2\">\n                                    <div className=\"relative\" ref={privacyMenuRef}>\n                                        <button\n                                            onClick={() => setIsPrivacyMenuOpen(!isPrivacyMenuOpen)}\n                                            title={\"隐私显示：\" + privacyLabel}\n                                            className={\"w-11 h-11 rounded-[14px] transition-all flex items-center justify-center shadow-sm border border-slate-200/70 \" + (privacyMode !== 'none' ? \"bg-slate-200 text-slate-700 shadow-inner\" : \"bg-white/70 text-slate-500 hover:text-slate-800 hover:bg-white\")}\n                                        >\n                                            {privacyMode !== 'none' ? <Icons.EyeOff className=\"w-5 h-5\" /> : <Icons.Eye className=\"w-5 h-5\" />}\n                                        </button>\n                                        {isPrivacyMenuOpen && (\n                                            <div className=\"hidden md:block absolute right-0 top-12 z-40 w-44 rounded-2xl border border-white/80 bg-white/80 backdrop-blur-xl shadow-xl p-1.5\">\n                                                {privacyOptions.map((option) => (\n                                                    <button\n                                                        key={option.mode}\n                                                        onClick={() => { setPrivacyMode(option.mode); setIsPrivacyMenuOpen(false); }}\n                                                        className={\"w-full text-left rounded-xl px-3 py-2 transition-all \" + (privacyMode === option.mode ? \"bg-white text-slate-900 shadow-sm\" : \"text-slate-500 hover:bg-white/60 hover:text-slate-800\")}\n                                                    >\n                                                        <div className=\"text-xs font-black\">{option.label}</div>\n                                                        <div className=\"text-[10px] font-bold opacity-60 mt-0.5\">{option.desc}</div>\n                                                    </button>\n                                                ))}\n                                            </div>\n                                        )}\n                                    </div>\n                                    <button\n                                        onClick={() => setIsSettingsOpen(true)}\n                                        title=\"系统设置\"\n                                        className=\"relative w-11 h-11 rounded-[14px] bg-white/70 border border-slate-200/70 text-slate-500 hover:text-blue-600 hover:bg-white transition-all flex items-center justify-center shadow-sm\"\n                                    >\n                                        <Icons.Settings className=\"w-5 h-5\" />\n                                        {updateInfo && updateInfo.hasUpdate && <span className=\"absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_0_2px_rgba(255,255,255,0.92)]\"></span>}\n                                    </button>\n                                    <button\n                                        onClick={() => setShareModalTarget('public')}\n                                        title=\"公开页\"\n                                        className=\"md:hidden w-11 h-11 rounded-[14px] bg-white/70 border border-slate-200/70 text-slate-500 hover:text-blue-600 hover:bg-white transition-all flex items-center justify-center shadow-sm\"\n                                    >\n                                        <Icons.Share2 className=\"w-5 h-5\" />\n                                    </button>\n                                </div>\n\n                                {/* 核心操作组 */}\n                                <button onClick={() => setShareModalTarget('public')} className=\"hidden md:flex px-4 py-2.5 h-11 bg-white/70 hover:bg-white text-slate-600 rounded-[14px] text-sm font-bold border border-white shadow-sm transition-all items-center gap-2\">\n                                    <Icons.Share2 className=\"w-4 h-4\" /> 公开页\n                                </button>\n                                <button onClick={openAddServerModal} disabled={isRefreshing || isSavingServer} className=\"mobile-primary-btn px-5 py-2.5 h-11 bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-60 disabled:cursor-not-allowed rounded-[14px] text-sm font-bold shadow-[0_4px_14px_0_rgba(16,185,129,0.28)] transition-all flex items-center gap-2\">\n                                    <Icons.Plus className=\"w-4 h-4\" /> 添加服务器\n                                </button>\n                                <button\n                                    onClick={() => manualPing(servers, configUpdatedAt, { forceMedia: true })}\n                                    disabled={isRefreshing}\n                                    className=\"mobile-refresh-btn px-4 py-2.5 h-11 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60 rounded-[14px] text-sm font-bold shadow-[0_6px_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2 whitespace-nowrap\"\n                                >\n                                    <Icons.RefreshCw className={\"w-4 h-4 \" + (isRefreshing ? 'animate-spin' : '')} />\n                                    <span className=\"inline-flex items-center justify-center tabular-nums\">\n                                        {isRefreshing ? '正在刷新...' : '刷新状态/资源'}\n                                    </span>\n                                </button>\n                            </div>\n                        </header>\n\n                        {/* Overview Stats */}\n                        <div className=\"mobile-stats-strip grid grid-cols-2 md:grid-cols-4 gap-4 mb-10\">\n                            {[\n                                { label: '在线服务器', value: onlineCount + \"/\" + servers.length, icon: Icons.CheckCircle2, color: 'text-emerald-500', glow: 'glow-online', cardClass: 'overview-stat-online' },\n                                { label: '当前离线', value: offlineCount, icon: Icons.XCircle, color: 'text-rose-500', glow: 'glow-offline', cardClass: 'overview-stat-offline' },\n                                { label: (availabilityRange === 'week' ? '7天' : '24H') + ' 可用率', value: avgUptime + \"%\", icon: Icons.BarChart3, color: 'text-blue-500', glow: 'bg-blue-500/20', cardClass: 'overview-stat-uptime' },\n                                { label: '报警通知', value: notifyLabel, icon: Icons.AlertCircle, color: 'text-purple-500', glow: 'bg-purple-500/20', cardClass: 'overview-stat-alert' },\n                            ].map((item, idx) => (\n                                <div key={idx} className={\"mobile-stat-card overview-stat \" + item.cardClass + \" p-6 rounded-[2rem] flex items-center gap-5 relative overflow-hidden group hover:-translate-y-0.5 transition-transform\"}>\n                                    <div className={\"absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl \" + item.glow}></div>\n                                    <div className={\"stat-icon-shell w-12 h-12 rounded-2xl bg-white/60 border border-white flex items-center justify-center shadow-sm relative z-10 \" + item.color}>\n                                        <item.icon className=\"w-6 h-6\" />\n                                    </div>\n                                    <div className=\"relative z-10\">\n                                        <div className=\"stat-value text-2xl font-black text-slate-800 tracking-tight\">{item.value}</div>\n                                        <div className=\"stat-label text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest\">{item.label}</div>\n                                    </div>\n                                </div>\n                            ))}\n                        </div>\n\n                        {/* Action Bar: View Toggles & Search */}\n                        <div className=\"mobile-action-bar flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6\">\n                            <div className=\"mobile-tab-nav tab-nav w-fit\">\n                                <button onClick={() => setActiveTab('cards')} className={\"tab-btn \" + (activeTab === 'cards' ? 'active' : '')}>\n                                    <Icons.LayoutGrid className=\"w-4 h-4\" /> 看板\n                                </button>\n                                <button onClick={() => setActiveTab('dashboard')} className={\"tab-btn \" + (activeTab === 'dashboard' ? 'active' : '')}>\n                                    <Icons.Activity className=\"w-4 h-4\" /> 历史大盘\n                                </button>\n                            </div>\n\n                            <div className=\"mobile-controls flex flex-wrap items-center gap-3 w-full md:w-auto\">\n                                {/* 时间范围胶囊 (仅看板模式) */}\n                                <div className={\"mobile-control-row \" + (activeTab === 'cards' ? 'has-range' : 'no-range')}>\n                                    {activeTab === 'cards' && (\n                                    <div className=\"mobile-range-group mobile-filter-group hidden sm:flex glass-panel p-1.5 rounded-[14px]\">\n                                        <button onClick={() => setAvailabilityRange('day')} className={\"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all \" + (availabilityRange === 'day' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>24H</button>\n                                        <button onClick={() => setAvailabilityRange('week')} className={\"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all \" + (availabilityRange === 'week' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>7天</button>\n                                    </div>\n                                    )}\n                                {/* 状态筛选胶囊 */}\n                                <div className=\"mobile-status-group mobile-filter-group hidden sm:flex glass-panel p-1.5 rounded-[14px]\">\n                                    {['all', 'online', 'offline'].map((status) => (\n                                        <button key={status} onClick={() => setStatusFilter(status)} className={\"px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all \" + (statusFilter === status ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>\n                                            {status === 'all' ? '全部' : status === 'online' ? '在线' : '离线'}\n                                        </button>\n                                    ))}\n                                </div>\n                                <button\n                                    onClick={nextAvailabilitySort}\n                                    className={\"mobile-sort-button hidden sm:flex glass-panel px-3.5 py-2 rounded-[14px] text-[11px] font-bold uppercase tracking-wider transition-all items-center gap-1.5 \" + (availabilitySort === 'none' ? 'text-slate-500 hover:text-slate-700' : 'bg-white/80 text-slate-800 shadow-sm')}\n                                    title=\"点击切换：默认排序 / 可用率升序 / 可用率降序\"\n                                >\n                                    <Icons.BarChart3 className=\"w-3.5 h-3.5\" />\n                                    <span>排序</span>\n                                    {availabilitySortArrow && <span className=\"text-sm leading-none\">{availabilitySortArrow}</span>}\n                                </button>\n                                </div>\n                                {/* 搜索框 */}\n                                <div className=\"mobile-search relative w-full sm:w-64\">\n                                    <Icons.Search className=\"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400\" />\n                                    <input\n                                        type=\"text\"\n                                        placeholder=\"搜索服务器名称或地址...\"\n                                        value={searchQuery}\n                                        onChange={(e) => setSearchQuery(e.target.value)}\n                                        className=\"w-full pl-9 pr-4 py-2.5 rounded-[14px] text-sm glass-input text-slate-700 outline-none placeholder:text-slate-400\"\n                                    />\n                                </div>\n                            </div>\n                        </div>\n\n                        {/* 空状态 */}\n                        {filteredServers.length === 0 && (\n                            <div className=\"py-20 flex flex-col items-center justify-center text-center\">\n                                <div className=\"w-20 h-20 bg-slate-200/50 rounded-full flex items-center justify-center mb-4\"><Icons.Search className=\"w-8 h-8 text-slate-400\" /></div>\n                                <h3 className=\"text-lg font-bold text-slate-700 mb-1\">未找到匹配的服务器</h3>\n                                <p className=\"text-sm text-slate-500\">尝试更换搜索词或清除筛选条件，或点击右上角添加新服务器。</p>\n                            </div>\n                        )}\n\n                        {/* Cards View */}\n                        {activeTab === 'cards' && filteredServers.length > 0 && (\n                            <div className=\"mobile-server-grid grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6\">\n                                {filteredServers.map((s) => {\n                                    const iconImg = getDisplayIcon(s);\n                                    const isOnline = s.status === 'online';\n                                    const stats = getAvailabilityStats(s);\n\n                                    const statusColors = {\n                                        online: { text: 'text-emerald-700', bg: 'bg-emerald-500/10', border: 'border-emerald-200', dotClass: 'dot-online', glowClass: 'glow-online' },\n                                        offline: { text: 'text-rose-700', bg: 'bg-rose-500/10', border: 'border-rose-200', dotClass: 'dot-offline', glowClass: 'glow-offline' },\n                                        updating: { text: 'text-blue-700', bg: 'bg-blue-500/10', border: 'border-blue-200', dotClass: 'dot-updating', glowClass: 'bg-blue-400/20' },\n                                    }[s.status] || { text: 'text-slate-600', bg: 'bg-slate-200/50', border: 'border-slate-200', dotClass: 'bg-slate-400', glowClass: 'bg-slate-300/20' };\n\n                                    return (\n                                        <div key={s.id} className=\"mobile-card group server-card p-6 rounded-[2rem] transition-all duration-300 flex flex-col hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 relative\">\n\n                                            {/* 高级卡片呼吸背光 */}\n                                            <div className={\"absolute -right-16 -top-16 w-48 h-48 rounded-full blur-[50px] pointer-events-none \" + statusColors.glowClass}></div>\n\n                                            {/* Header Row */}\n                                            <div className={\"server-card-head flex justify-between items-start server-card-head-\" + (['online', 'offline', 'updating'].includes(s.status) ? s.status : 'unknown')}>\n                                                <div className=\"flex gap-4 items-center\">\n                                                    <div onClick={() => setIconModalTarget(s.id)} className=\"w-14 h-14 rounded-[1.2rem] bg-white/80 border border-white shadow-sm flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:shadow-md transition-shadow cursor-pointer overflow-hidden\" title=\"点击更换图标\">\n                                                        {hideServerName ? <Icons.Server className=\"w-6 h-6\" /> : (iconImg ? <img src={getProxyImgSrc(iconImg)} className=\"w-full h-full object-contain p-2\" onError={(e) => {e.target.style.display='none'}} /> : <span className=\"text-2xl font-black text-slate-700\">{s.name ? s.name[0] : '?'}</span>)}\n                                                    </div>\n                                                    <div className=\"min-w-0\">\n                                                        <h3 className=\"font-black text-xl text-slate-800 truncate tracking-tight\">{hideServerName ? 'Node Hidden' : s.name}</h3>\n                                                        <p className=\"text-[11px] text-slate-400 font-mono mt-1.5 font-semibold truncate bg-white/50 inline-block px-2 py-0.5 rounded-md border border-slate-100\">{hideServerUrl ? 'https://****.****' : stripProtocol(s.url)}</p>\n                                                    </div>\n                                                </div>\n\n                                                <div className={\"flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white/50 backdrop-blur-sm shadow-sm \" + statusColors.border + \" \" + statusColors.bg}>\n                                                    <span className={\"w-2.5 h-2.5 rounded-full \" + statusColors.dotClass} />\n                                                    <span className={\"text-[10px] font-black uppercase tracking-wider \" + statusColors.text}>\n                                                        {s.status === 'online' ? '运行中' : s.status === 'offline' ? '已掉线' : '测速中'}\n                                                    </span>\n                                                </div>\n                                            </div>\n\n                                            {/* 双栏指标区: 可用率与离线数 */}\n                                            <div className=\"server-card-section server-card-metrics grid grid-cols-2 gap-3 mb-6 relative z-10 rounded-2xl p-4\">\n                                                <div className=\"text-center relative\">\n                                                    <div className=\"text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-widest flex justify-center items-center gap-1\">\n                                                        {(availabilityRange === 'week' ? '7天' : '24H')}可用率\n                                                    </div>\n                                                    <div className=\"flex justify-center items-baseline gap-1\">\n                                                        <span className={\"text-3xl font-black tracking-tighter \" + (stats.uptime === '---' ? 'text-slate-400' : parseFloat(stats.uptime) > 95 ? 'text-emerald-500' : 'text-amber-500')}>\n                                                            {stats.uptime}\n                                                        </span>\n                                                        <span className=\"text-sm text-slate-400 font-bold\">{stats.uptime === '---' ? '' : '%'}</span>\n                                                    </div>\n                                                </div>\n                                                <div className=\"text-center relative\">\n                                                    <div className=\"absolute left-0 top-2 bottom-2 w-px bg-slate-200/60\"></div>\n                                                    <div className=\"text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-widest flex justify-center items-center gap-1\">\n                                                        {(availabilityRange === 'week' ? '7天' : '24H')}离线\n                                                    </div>\n                                                    <div className=\"flex justify-center items-baseline gap-1\">\n                                                        <span className={\"text-3xl font-black tracking-tighter \" + (stats.offline === 0 ? 'text-slate-400' : 'text-rose-500')}>\n                                                            {stats.offline}\n                                                        </span>\n                                                        <span className=\"text-sm text-slate-400 font-bold\">次</span>\n                                                    </div>\n                                                </div>\n                                            </div>\n\n                                            {/* 媒体库统计 */}\n                                            {s.mediaStats && s.mediaStats.enabled && (\n                                                <div className=\"server-card-section server-card-media rounded-2xl p-4 relative z-10\">\n                                                    <div className=\"flex items-center justify-between mb-3\">\n                                                        <span className=\"text-[10px] text-slate-500 font-bold uppercase tracking-widest\">资源库较昨日变化</span>\n                                                        {s.mediaStats.lastError && <button onClick={() => alert(s.mediaStats.lastError)} className=\"text-[10px] text-rose-500 font-bold\" title={s.mediaStats.lastError}>更新失败</button>}\n                                                    </div>\n                                                    <div className=\"grid grid-cols-3 gap-2 divide-x divide-slate-200/60 text-center\">\n                                                        {[\n                                                            { label: '电影', icon: Icons.Film, key: 'movie' },\n                                                            { label: '剧集', icon: Icons.Tv, key: 'series' },\n                                                            { label: '单集', icon: Icons.PlaySquare, key: 'episode' }\n                                                        ].map((stat, i) => {\n                                                            const count = s.mediaStats.counts ? s.mediaStats.counts[stat.key] : null;\n                                                            const delta = s.mediaStats.dailyDelta ? s.mediaStats.dailyDelta[stat.key] : (s.mediaStats.delta24h ? s.mediaStats.delta24h[stat.key] : 0);\n                                                            return (\n                                                                <div key={i} className=\"flex flex-col items-center justify-center px-1 min-w-0\">\n                                                                    <div className=\"flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1\">\n                                                                        <stat.icon className=\"w-3.5 h-3.5\" /> <span>{stat.label}</span>\n                                                                    </div>\n                                                                    <div className=\"w-full min-w-0 text-center\">\n                                                                        <div className=\"text-base font-black text-slate-700 tracking-tight truncate tabular-nums\" title={count === null ? '--' : String(count)}>\n                                                                            {count === null ? '--' : count}\n                                                                        </div>\n                                                                        <div className=\"mt-0.5 h-4 flex items-center justify-center\">\n                                                                            <span\n                                                                                className={\"max-w-full px-1.5 rounded-full text-[10px] leading-4 font-black tabular-nums truncate \" + (delta > 0 ? \"bg-emerald-50 text-emerald-600\" : delta < 0 ? \"bg-rose-50 text-rose-600\" : \"bg-slate-100 text-slate-400\")}\n                                                                                title={(delta > 0 ? '+' : '') + String(delta)}\n                                                                            >\n                                                                                {(delta > 0 ? '+' : '') + String(delta)}\n                                                                            </span>\n                                                                        </div>\n                                                                    </div>\n                                                                </div>\n                                                            );\n                                                        })}\n                                                    </div>\n                                                </div>\n                                            )}\n\n                                            {/* Footer */}\n                                            <div className=\"server-card-footer mt-5 flex justify-between items-center text-[10px] text-slate-400 font-bold relative z-10\">\n                                                <div className=\"flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded-full border border-white\">\n                                                    <Icons.Clock className=\"w-3 h-3\" />\n                                                    检测: {new Date(s.lastCheck).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}\n                                                </div>\n                                                <div className=\"mobile-card-actions flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity\">\n                                                    <button onClick={() => setShareModalTarget(s.id)} className=\"px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors\">分享</button>\n                                                    <button onClick={() => openEditServerModal(s)} className=\"px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors\">编辑</button>\n                                                    <button onClick={async () => {\n                                                        if(confirm('彻底删除该服务器?')) {\n                                                            const n = servers.filter(x => x.id !== s.id);\n                                                            await syncToCloud(n, iconLib);\n                                                        }\n                                                    }} className=\"px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors\">删除</button>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    );\n                                })}\n                            </div>\n                        )}\n\n                        {/* Dashboard View */}\n                        {activeTab === 'dashboard' && sortedServers.length > 0 && (\n                            <div className=\"mobile-dashboard dashboard-shell rounded-[2rem] p-5 flex flex-col gap-4 relative overflow-hidden\">\n                                <div className=\"absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none\"></div>\n                                {sortedServers.map((s) => {\n                                    const iconImg = getDisplayIcon(s);\n                                    const stats = getAvailabilityStats(s);\n                                    const rowClass = ['online', 'offline', 'updating'].includes(s.status) ? s.status : 'unknown';\n                                    return (\n                                        <div key={s.id} className={\"dashboard-row dashboard-row-\" + rowClass + \" p-4 sm:p-5 rounded-2xl transition-all grid grid-cols-1 xl:grid-cols-[minmax(240px,0.36fr)_minmax(0,1fr)] xl:items-center gap-4 sm:gap-5\"}>\n                                            <div className=\"dashboard-node-panel flex items-center gap-4 sm:gap-5 min-w-0 relative rounded-2xl px-4 py-4\">\n                                                <div className={\"absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full blur-[15px] \" + (s.status === 'online' ? 'glow-online' : s.status === 'offline' ? 'glow-offline' : 'bg-blue-400/20')}></div>\n                                                <div className=\"w-12 h-12 rounded-xl bg-white/80 border border-white shadow-sm flex items-center justify-center font-black text-xl text-slate-600 z-10 overflow-hidden flex-shrink-0\">\n                                                    {hideServerName ? <Icons.Server className=\"w-5 h-5\" /> : (iconImg ? <img src={getProxyImgSrc(iconImg)} className=\"w-full h-full object-contain p-1.5\" onError={(e) => {e.target.style.display='none'}} /> : s.name[0])}\n                                                </div>\n                                                <div className=\"z-10 min-w-0 flex-1\">\n                                                    <div className=\"font-black text-slate-800 text-lg truncate tracking-tight\">{hideServerName ? 'Node Hidden' : s.name}</div>\n                                                    <div className=\"mt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold\">\n                                                        <span className={\"inline-flex items-center gap-1 px-2.5 py-1 rounded-full border bg-white/65 backdrop-blur-sm \" + (s.status === 'online' ? 'border-emerald-200 text-emerald-700' : s.status === 'offline' ? 'border-rose-200 text-rose-700' : 'border-blue-200 text-blue-700')}>\n                                                            <span className={\"w-2 h-2 rounded-full flex-shrink-0 \" + (s.status === 'online' ? 'dot-online' : s.status === 'offline' ? 'dot-offline' : 'dot-updating')}></span>\n                                                            {s.status === 'online' ? '运行中' : s.status === 'offline' ? '已掉线' : '测速中'}\n                                                        </span>\n                                                        <span className=\"px-2.5 py-1 rounded-full bg-white/55 border border-white text-slate-500\">\n                                                            {stats.uptime}% 可用率\n                                                        </span>\n                                                        <span className=\"px-2.5 py-1 rounded-full bg-white/55 border border-white text-slate-500\">\n                                                            {stats.offline} 次离线\n                                                        </span>\n                                                    </div>\n                                                </div>\n                                            </div>\n                                            <div className=\"status-chart-shell w-full min-w-0 min-h-[5.25rem] rounded-[1.2rem] px-3 py-2 overflow-visible\">\n                                                <StatusBars history={s.history || []} currentStatus={s.status} currentLatency={s.latency} />\n                                            </div>\n                                        </div>\n                                    );\n                                })}\n                            </div>\n                        )}\n                    </div>\n\n                    {isPrivacyMenuOpen && (\n                        <div data-privacy-dialog=\"true\" className=\"md:hidden fixed inset-0 z-50 flex items-center justify-center p-4\">\n                            <div className=\"mobile-privacy-backdrop absolute inset-0\" onClick={() => setIsPrivacyMenuOpen(false)}></div>\n                            <div className=\"mobile-privacy-menu relative z-10 border border-white/80 bg-white/80 backdrop-blur-xl shadow-2xl\">\n                                <div className=\"mb-3 px-1\">\n                                    <div className=\"text-lg font-black text-slate-800\">隐藏显示</div>\n                                    <div className=\"text-xs font-bold text-slate-500 mt-1\">选择需要隐藏的服务器信息</div>\n                                </div>\n                                <div className=\"space-y-2\">\n                                    {privacyOptions.map((option) => (\n                                        <button\n                                            key={option.mode}\n                                            onClick={() => { setPrivacyMode(option.mode); setIsPrivacyMenuOpen(false); }}\n                                            className={\"w-full text-left transition-all \" + (privacyMode === option.mode ? \"bg-white text-slate-900 shadow-sm\" : \"text-slate-500 hover:bg-white/60 hover:text-slate-800\")}\n                                        >\n                                            <div className=\"text-sm font-black\">{option.label}</div>\n                                            <div className=\"text-[11px] font-bold opacity-60 mt-0.5\">{option.desc}</div>\n                                        </button>\n                                    ))}\n                                </div>\n                            </div>\n                        </div>\n                    )}\n\n                    {/* 专属设置弹窗 (Settings Modal) */}\n                    {isSettingsOpen && (\n                        <div className=\"mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4\">\n                            <div className=\"mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity\" onClick={() => setIsSettingsOpen(false)}></div>\n                            <div className=\"mobile-sheet mobile-form-sheet relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200\">\n                                <button onClick={() => setIsSettingsOpen(false)} className=\"absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors\">\n                                    <Icons.X className=\"w-4 h-4\" />\n                                </button>\n                                <h2 className=\"text-2xl font-black text-slate-800 mb-6 flex items-center gap-3\">\n                                    <Icons.Settings className=\"w-6 h-6 text-blue-500\" />系统设置\n                                </h2>\n\n                                <div className=\"mobile-form-body space-y-4\">\n                                    {/* 程序更新 */}\n                                    <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm\">\n                                        <div className=\"flex flex-col md:flex-row md:items-start justify-between gap-4\">\n                                            <div className=\"min-w-0 flex-1\">\n                                                <div className=\"flex items-center gap-2 mb-1 text-slate-700 font-bold\"><Icons.DownloadCloud className=\"w-4 h-4 text-blue-500\" />程序更新</div>\n                                                <div className=\"text-xs font-bold text-slate-500\">\n                                                    当前版本: {updateInfo ? updateInfo.currentVersion : APP_VERSION}\n                                                    {updateInfo && updateInfo.hasUpdate && <span className=\"ml-3 inline-block text-amber-500\">发现新版本: {updateInfo.latestVersion}</span>}\n                                                    {updateInfo && !updateInfo.hasUpdate && updateInfo.latestVersion && updateInfo.latestVersion !== 'unknown' && <span className=\"ml-3 inline-block text-emerald-600\">远端版本: {updateInfo.latestVersion}</span>}\n                                                </div>\n                                                {updateInfo && (updateInfo.error || (Array.isArray(updateInfo.missing) && updateInfo.missing.length > 0) || updateInfo.sourceUrl) && (\n                                                    <div className=\"mt-3 space-y-1 text-[11px] font-bold text-slate-500\">\n                                                        {updateInfo.error && <div className=\"text-rose-500\">检查失败：{updateInfo.error}</div>}\n                                                        {Array.isArray(updateInfo.missing) && updateInfo.missing.length > 0 && <div>缺少自更新配置：{updateInfo.missing.join(', ')}</div>}\n                                                        {updateInfo.sourceUrl && <div className=\"truncate\">更新源：{updateInfo.sourceUrl}</div>}\n                                                    </div>\n                                                )}\n                                                {updateInfo && updateInfo.hasUpdate && Array.isArray(updateInfo.releaseNotes) && updateInfo.releaseNotes.length > 0 && (\n                                                    <div className=\"mt-3 space-y-1 text-[11px] font-bold text-slate-500\">\n                                                        {updateInfo.releaseNotes.map((note, index) => (\n                                                            <div key={index} className=\"flex gap-2\">\n                                                                <span className=\"text-amber-500\">•</span>\n                                                                <span>{note}</span>\n                                                            </div>\n                                                        ))}\n                                                    </div>\n                                                )}\n                                                <div className=\"mt-4 border-t border-slate-200/70 pt-3 text-[10px] font-bold text-slate-400 leading-relaxed\">\n                                                    更新建议：公开页头像展示、大陆 IP 限制和公开链接设置已完善，建议尽快更新。\n                                                </div>\n                                            </div>\n                                            <div className=\"grid grid-cols-2 md:flex gap-2 md:flex-shrink-0\">\n                                                <button onClick={() => checkForUpdate(true)} disabled={isCheckingUpdate || isApplyingUpdate} className=\"px-3 sm:px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap\">\n                                                    {isCheckingUpdate ? '检查中...' : '检查更新'}\n                                                </button>\n                                                <button onClick={applyUpdate} disabled={!updateInfo || !updateInfo.hasUpdate || isApplyingUpdate || !updateInfo.canUpdate} className=\"px-3 sm:px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white disabled:opacity-40 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap\">\n                                                    {isApplyingUpdate ? '更新中...' : '一键更新'}\n                                                </button>\n                                            </div>\n                                        </div>\n                                    </div>\n\n                                    {/* Telegram 配置 */}\n                                    <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm\">\n                                        <div className=\"flex items-center justify-between mb-4\">\n                                            <div className=\"flex items-center gap-2 text-slate-700 font-bold\">\n                                                <Icons.MessageSquare className=\"w-4 h-4 text-emerald-500\" />通知配置 (Telegram)\n                                            </div>\n                                            <label className=\"flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer\">\n                                                <input type=\"checkbox\" checked={telegramForm.enabled} onChange={e => setTelegramForm({...telegramForm, enabled: e.target.checked})} className=\"w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500\" />\n                                                启用\n                                            </label>\n                                        </div>\n                                        {telegramForm.enabled && (\n                                            <div className=\"space-y-3\">\n                                                <div>\n                                                    <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">Bot Token</label>\n                                                    <input type=\"password\" value={telegramForm.botToken} onChange={e => setTelegramForm({...telegramForm, botToken: e.target.value})} placeholder=\"123456:ABC-DEF1234...\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                                </div>\n                                                <div>\n                                                    <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">Chat ID</label>\n                                                    <input type=\"text\" value={telegramForm.chatId} onChange={e => setTelegramForm({...telegramForm, chatId: e.target.value})} placeholder=\"填写接收通知的 Chat ID\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                                </div>\n                                                <button onClick={handleSaveTelegram} className=\"w-full mt-2 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-sm rounded-xl transition-colors border border-emerald-200\">应用 TG 配置</button>\n                                            </div>\n                                        )}\n                                    </div>\n\n                                    {/* 图标库 */}\n                                    <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm\">\n                                        <div className=\"flex items-center gap-2 mb-4 text-slate-700 font-bold\">\n                                            <Icons.ImageIcon className=\"w-4 h-4 text-purple-500\" />图标库 (JSON)\n                                        </div>\n                                        <div className=\"flex gap-2\">\n                                            <input type=\"text\" value={iconInput} onChange={e => setIconInput(e.target.value)} placeholder=\"https://example.com/icons.json\" className=\"flex-1 glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                            <button onClick={handleSyncIcons} className=\"px-4 py-2.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 transition-colors border border-blue-200\">拉取</button>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    )}\n\n                    {/* 添加/编辑服务器弹窗 (Add Server Modal) */}\n                    {isAddModalOpen && (\n                        <div className=\"mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4\">\n                            <div className=\"mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity\" onClick={() => setIsAddModalOpen(false)}></div>\n                            <div className=\"mobile-sheet mobile-form-sheet relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200\">\n                                <button onClick={() => setIsAddModalOpen(false)} className=\"absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors\">\n                                    <Icons.X className=\"w-4 h-4\" />\n                                </button>\n\n                                <h2 className=\"text-2xl font-black text-slate-800 mb-6 flex items-center gap-3\">\n                                    <Icons.Server className=\"w-6 h-6 text-emerald-500\" />\n                                    {editingServerId ? '编辑服务器' : '部署新服务器'}\n                                </h2>\n\n                                <div className=\"mobile-form-body space-y-4\">\n                                    {/* 快捷导入 */}\n                                    <div className=\"bg-white/60 p-4 rounded-3xl border border-white shadow-sm\">\n                                        <div className=\"flex items-center justify-between gap-3 mb-2\">\n                                            <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block\">快速粘贴解析</label>\n                                            <button\n                                                type=\"button\"\n                                                onClick={applyQuickImportText}\n                                                disabled={!quickImportText.trim()}\n                                                className=\"px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed border border-blue-100 hover:bg-blue-100 text-[11px] font-black transition-colors\"\n                                            >\n                                                立即识别\n                                            </button>\n                                        </div>\n                                        <textarea\n                                            className=\"w-full h-28 glass-input p-3 rounded-2xl outline-none text-sm resize-none\"\n                                            placeholder={\"示例：\\\\n服务器：https://emby.example.com:443\\\\n用户名：demo_user\\\\n密码：demo_password\"}\n                                            value={quickImportText}\n                                            onChange={e=>setQuickImportText(e.target.value)}\n                                        />\n                                    </div>\n\n                                    {/* 基础配置 */}\n                                    <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4\">\n                                        <div className=\"flex items-center gap-2 mb-2 text-slate-700 font-bold\">\n                                            <Icons.Link className=\"w-4 h-4 text-blue-500\" />基础路由信息\n                                        </div>\n                                        <div>\n                                            <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">服务器标识 (别名)</label>\n                                            <input type=\"text\" value={addForm.name} onChange={e=>setAddForm({...addForm, name: e.target.value})} placeholder=\"例如：US West Main\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                        </div>\n                                        <div>\n                                            <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">服务器地址</label>\n                                            <div className=\"grid grid-cols-[80px_1fr_80px] gap-2\">\n                                                <button onClick={toggleProtocol} className=\"glass-input rounded-xl text-xs font-black text-blue-600 transition-colors uppercase\">{addForm.protocol.replace('://', '')}</button>\n                                                <input type=\"text\" value={addForm.host} onChange={e=>updateHostFromInput(e.target.value)} placeholder=\"emby.example.com\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none\" />\n                                                <input type=\"text\" value={addForm.port} onChange={e=>setAddForm({...addForm, port: cleanPortInput(e.target.value)})} placeholder=\"443\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono text-center outline-none\" />\n                                            </div>\n                                        </div>\n                                    </div>\n\n                                    {/* 备用地址 */}\n                                    <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3\">\n                                        <div className=\"flex items-center justify-between gap-3\">\n                                            <div className=\"flex items-center gap-2 text-slate-700 font-bold\">\n                                                <Icons.Link className=\"w-4 h-4 text-emerald-500\" />备用地址\n                                            </div>\n                                            <button\n                                                type=\"button\"\n                                                onClick={addFallbackUrl}\n                                                disabled={fallbackUrls.length >= 4}\n                                                className=\"px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-100 hover:bg-emerald-100 text-[11px] font-black transition-colors\"\n                                            >\n                                                添加\n                                            </button>\n                                        </div>\n                                        {fallbackUrls.length === 0 ? (\n                                            <div className=\"text-xs text-slate-400 font-semibold bg-white/45 border border-white/70 rounded-2xl px-4 py-3\">主地址不可用时，将按顺序探测备用地址。</div>\n                                        ) : (\n                                            <div className=\"space-y-2\">\n                                                {fallbackUrls.map((fallbackUrl, index) => (\n                                                    <div key={index} className=\"grid grid-cols-[1fr_40px] gap-2\">\n                                                        <input type=\"text\" value={fallbackUrl} onChange={e=>updateFallbackUrl(index, e.target.value)} placeholder={\"https://backup\" + (index + 1) + \".example.com\"} className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none\" />\n                                                        <button type=\"button\" onClick={() => removeFallbackUrl(index)} className=\"w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 transition-colors\">\n                                                            <Icons.X className=\"w-4 h-4\" />\n                                                        </button>\n                                                    </div>\n                                                ))}\n                                            </div>\n                                        )}\n                                    </div>\n\n                                    {/* 媒体库配置 */}\n                                    <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-4\">\n                                        <div className=\"flex items-center justify-between\">\n                                            <div className=\"flex items-center gap-2 text-slate-700 font-bold\">\n                                                <Icons.ShieldCheck className=\"w-4 h-4 text-purple-500\" />启用媒体库资源统计\n                                            </div>\n                                            <label className=\"flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer\">\n                                                <input type=\"checkbox\" checked={mediaForm.enabled} onChange={e=>setMediaForm({...mediaForm, enabled: e.target.checked})} className=\"w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500\" />\n                                            </label>\n                                        </div>\n                                        {mediaForm.enabled && (\n                                            <div className=\"grid grid-cols-2 gap-3 pt-2\">\n                                                <div>\n                                                    <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">Emby 用户名</label>\n                                                    <input type=\"text\" value={mediaForm.username} onChange={e=>setMediaForm({...mediaForm, username: e.target.value})} placeholder=\"Admin\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                                </div>\n                                                <div>\n                                                    <label className=\"text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 block\">Emby 密码</label>\n                                                    <input type=\"password\" value={mediaForm.password} onChange={e=>setMediaForm({...mediaForm, password: e.target.value})} placeholder=\"••••••••\" className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm outline-none\" />\n                                                </div>\n                                            </div>\n                                        )}\n                                    </div>\n                                </div>\n\n                                <div className=\"mobile-form-footer mt-8\">\n                                    <button onClick={handleSaveServer} disabled={isSavingServer || isRefreshing} className=\"w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/10 transition-all flex justify-center items-center gap-2\">\n                                        {isSavingServer ? '保存中...' : (editingServerId ? '保存修改' : '确认部署')}\n                                    </button>\n                                </div>\n                            </div>\n                        </div>\n                    )}\n\n                    {/* 分享弹窗 */}\n                    {shareModalTarget && (() => {\n                        const targetServer = shareModalTarget === 'public' ? null : servers.find(server => String(server.id) === String(shareModalTarget));\n                        const publicUrl = getPublicUrl();\n                        const shareExpired = publicShareExpiresAt ? Date.now() >= publicShareExpiresAt : false;\n                        const shareExpiresText = publicShareExpiresAt ? new Date(publicShareExpiresAt).toLocaleString('zh-CN', { hour12: false }) : '';\n                        const cardShare = targetServer ? cardShareLinks[targetServer.id] : null;\n                        const cardShareExpired = cardShare && cardShare.expiresAt ? Date.now() >= cardShare.expiresAt : false;\n                        const cardShareExpiresText = cardShare && cardShare.expiresAt ? new Date(cardShare.expiresAt).toLocaleString('zh-CN', { hour12: false }) : '';\n                        return (\n                            <div className=\"mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4\">\n                                <div className=\"mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity\" onClick={() => setShareModalTarget(null)}></div>\n                                <div className=\"mobile-sheet relative w-full max-w-xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-200\">\n                                    <button onClick={() => setShareModalTarget(null)} className=\"absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors\">\n                                        <Icons.X className=\"w-4 h-4\" />\n                                    </button>\n\n                                    <h2 className=\"text-2xl font-black text-slate-800 mb-6 flex items-center gap-3\">\n                                        <Icons.Share2 className=\"w-6 h-6 text-emerald-500\" />\n                                        {targetServer ? '服务器卡片分享' : '公开链接'}\n                                    </h2>\n\n                                    <div className=\"space-y-4\">\n                                        {!targetServer && (\n                                        <React.Fragment>\n                                            <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3\">\n                                                <div className=\"flex items-center justify-between gap-3\">\n                                                    <div className=\"text-slate-700 font-bold\">公开大盘链接</div>\n                                                    <button onClick={generatePublicShareLink} disabled={isGeneratingPublicShare} className=\"px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 text-[11px] font-black transition-colors flex items-center gap-1.5 disabled:opacity-50\">\n                                                        <Icons.Share2 className=\"w-3.5 h-3.5\" /> {isGeneratingPublicShare ? '生成中...' : (publicShareLink ? '重新生成' : '生成')}\n                                                    </button>\n                                                </div>\n                                                <div className=\"grid grid-cols-2 gap-2\">\n                                                    <button type=\"button\" onClick={() => setPublicShareLifetime('hour')} className={\"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors \" + (publicShareLifetime === 'hour' ? \"bg-slate-800 text-white border-slate-800\" : \"bg-white/70 text-slate-600 border-white hover:bg-white\")}>1 小时有效</button>\n                                                    <button type=\"button\" onClick={() => setPublicShareLifetime('forever')} className={\"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors \" + (publicShareLifetime === 'forever' ? \"bg-slate-800 text-white border-slate-800\" : \"bg-white/70 text-slate-600 border-white hover:bg-white\")}>永久有效</button>\n                                                </div>\n                                                <label className=\"flex items-center gap-2 text-[11px] font-bold text-slate-600\">\n                                                    <input type=\"checkbox\" checked={publicShareIncludeProfile} onChange={e => setPublicShareIncludeProfile(e.target.checked)} className=\"w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500\" />\n                                                    <span>公开页显示 Telegram 名称和头像</span>\n                                                </label>\n                                                <div className=\"grid grid-cols-2 gap-2\">\n                                                    <button type=\"button\" onClick={() => setPublicShareHideCounts(false)} className={\"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors \" + (!publicShareHideCounts ? \"bg-slate-800 text-white border-slate-800\" : \"bg-white/70 text-slate-600 border-white hover:bg-white\")}>展示数量</button>\n                                                    <button type=\"button\" onClick={() => setPublicShareHideCounts(true)} className={\"px-3 py-2 rounded-xl text-[11px] font-black border transition-colors \" + (publicShareHideCounts ? \"bg-slate-800 text-white border-slate-800\" : \"bg-white/70 text-slate-600 border-white hover:bg-white\")}>隐藏数量</button>\n                                                </div>\n                                                <div className=\"text-[10px] font-bold text-slate-400 leading-relaxed\">\n                                                    隐藏后只保留前缀位数，例如 58690 变成 58***，500 变成 5**。\n                                                </div>\n                                                <div className=\"grid grid-cols-[1fr_44px] gap-2\">\n                                                    <input readOnly value={publicUrl} className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none\" />\n                                                    <button onClick={() => copyText(publicUrl, '公开大盘链接')} className=\"w-11 h-11 flex items-center justify-center rounded-xl bg-white text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors\">\n                                                        <Icons.Copy className=\"w-4 h-4\" />\n                                                    </button>\n                                                </div>\n                                                <div className=\"text-[11px] font-bold text-slate-500 flex items-center justify-between gap-3\">\n                                                    <span>有效期：{publicShareLifetime === 'forever' ? '永久' : '1 小时'}</span>\n                                                    {publicShareExpiresAt ? <span>{shareExpired ? '已过期' : '过期时间：' + shareExpiresText}</span> : (publicShareLink ? <span>永久有效</span> : null)}\n                                                </div>\n                                            </div>\n\n                                            <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3\">\n                                                <div className=\"flex items-center justify-between gap-3\">\n                                                    <div className=\"text-slate-700 font-bold\">公开页独立访问统计</div>\n                                                    <button onClick={fetchPublicShareStats} disabled={isLoadingPublicShareStats} className=\"px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 text-[11px] font-black transition-colors disabled:opacity-50\">\n                                                        {isLoadingPublicShareStats ? '刷新中...' : '刷新'}\n                                                    </button>\n                                                </div>\n                                                <div className=\"space-y-2 max-h-72 overflow-y-auto pr-1\">\n                                                    {publicShareStats.length === 0 && (\n                                                        <div className=\"py-8 text-center text-xs font-bold text-slate-400\">\n                                                            {isLoadingPublicShareStats ? '正在读取统计...' : '暂无公开页记录'}\n                                                        </div>\n                                                    )}\n                                                    {publicShareStats.map((item) => {\n                                                        const itemExpired = Number(item.expiresAt) > 0 && Date.now() >= Number(item.expiresAt);\n                                                        const itemUrl = item.url || (getShareBaseUrl() + '/public/' + item.token);\n                                                        const maskCount = (value, hide = false) => {\n                                                            const text = String(Math.max(0, Number(value) || 0));\n                                                            if (!hide) return text;\n                                                            if (text.length <= 1) return text + '**';\n                                                            const keep = text.length >= 5 ? 2 : 1;\n                                                            return text.slice(0, keep) + '*'.repeat(Math.max(2, text.length - keep));\n                                                        };\n                                                        return (\n                                                            <div key={item.token} className=\"rounded-2xl bg-white/70 border border-white p-3 space-y-2\">\n                                                                <div className=\"flex items-center justify-between gap-3\">\n                                                                    <div className=\"text-sm font-black text-slate-700 tabular-nums\">{Number(item.views) || 0} 个独立 IP</div>\n                                                                    <span className={\"px-2 py-1 rounded-full text-[10px] font-black \" + (itemExpired ? \"bg-slate-100 text-slate-500\" : \"bg-emerald-50 text-emerald-600\")}>{itemExpired ? '已过期' : (Number(item.expiresAt) ? '有效中' : '永久')}</span>\n                                                                </div>\n                                                                <div className=\"text-[11px] font-bold text-slate-500 space-y-1\">\n                                                                    <div>生成：{formatStatTime(item.createdAt)}</div>\n                                                                    <div>过期：{formatShareExpires(item.expiresAt)}</div>\n                                                                    <div>最后访问：{formatStatTime(item.lastViewedAt)}</div>\n                                                                </div>\n                                                                <div className=\"grid grid-cols-3 gap-2 text-center\">\n                                                                    <div className=\"rounded-xl bg-white/60 border border-white px-2 py-2\">\n                                                                        <div className=\"text-[9px] font-black text-slate-400\">电影</div>\n                                                                        <div className=\"mt-1 text-sm font-black text-slate-700 tabular-nums\">{maskCount(item.movieCount, item.hideCounts)}</div>\n                                                                    </div>\n                                                                    <div className=\"rounded-xl bg-white/60 border border-white px-2 py-2\">\n                                                                        <div className=\"text-[9px] font-black text-slate-400\">剧集</div>\n                                                                        <div className=\"mt-1 text-sm font-black text-slate-700 tabular-nums\">{maskCount(item.seriesCount, item.hideCounts)}</div>\n                                                                    </div>\n                                                                    <div className=\"rounded-xl bg-white/60 border border-white px-2 py-2\">\n                                                                        <div className=\"text-[9px] font-black text-slate-400\">总集数</div>\n                                                                        <div className=\"mt-1 text-sm font-black text-slate-700 tabular-nums\">{maskCount(item.episodeCount, item.hideCounts)}</div>\n                                                                    </div>\n                                                                </div>\n                                                                <div className=\"grid grid-cols-[1fr_38px_38px] gap-2\">\n                                                                    <input readOnly value={itemUrl} className=\"w-full glass-input px-3 py-2 rounded-xl text-[11px] font-mono outline-none\" />\n                                                                    <button onClick={() => copyText(itemUrl, '公开页链接')} className=\"w-[38px] h-[38px] flex items-center justify-center rounded-xl bg-white text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors\">\n                                                                        <Icons.Copy className=\"w-4 h-4\" />\n                                                                    </button>\n                                                                    <button onClick={() => deletePublicShareLink(item.token)} disabled={deletingPublicShareToken === item.token} className=\"w-[38px] h-[38px] flex items-center justify-center rounded-xl bg-white text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors disabled:opacity-50\">\n                                                                        <Icons.Trash2 className=\"w-4 h-4\" />\n                                                                    </button>\n                                                                </div>\n                                                            </div>\n                                                        );\n                                                    })}\n                                                </div>\n                                            </div>\n                                        </React.Fragment>\n                                        )}\n\n                                        {targetServer && (\n                                            <div className=\"bg-white/60 p-5 rounded-3xl border border-white shadow-sm space-y-3\">\n                                                <div className=\"flex items-center justify-between gap-3\">\n                                                    <div className=\"text-slate-700 font-bold truncate\">卡片图片快照</div>\n                                                    <button onClick={() => generateCardShareLink(targetServer.id)} disabled={generatingCardShareId === targetServer.id} className=\"px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 text-[11px] font-black transition-colors flex items-center gap-1.5 disabled:opacity-50\">\n                                                        <Icons.Share2 className=\"w-3.5 h-3.5\" /> {generatingCardShareId === targetServer.id ? '生成中...' : '生成'}\n                                                    </button>\n                                                </div>\n                                                {cardShare && (\n                                                    <div className=\"space-y-2\">\n                                                        <div className=\"rounded-2xl bg-white/70 border border-white p-3 flex justify-center overflow-hidden\">\n                                                            <img src={cardShare.url} alt=\"server card snapshot\" className=\"w-full max-w-md rounded-xl\" />\n                                                        </div>\n                                                        <div className=\"grid grid-cols-[1fr_44px] gap-2\">\n                                                            <input readOnly value={cardShare.url} className=\"w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono outline-none\" />\n                                                            <button onClick={() => copyText(cardShare.url, '卡片图片地址')} className=\"w-11 h-11 flex items-center justify-center rounded-xl bg-white text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors\">\n                                                                <Icons.Copy className=\"w-4 h-4\" />\n                                                            </button>\n                                                        </div>\n                                                        <div className=\"text-[11px] font-bold text-slate-500 flex items-center justify-between gap-3\">\n                                                            <span>有效期：1 小时</span>\n                                                            {cardShare.expiresAt && <span>{cardShareExpired ? '已过期' : '过期时间：' + cardShareExpiresText}</span>}\n                                                        </div>\n                                                    </div>\n                                                )}\n                                            </div>\n                                        )}\n\n                                    </div>\n                                </div>\n                            </div>\n                        );\n                    })()}\n\n                    {/* 图标选择弹窗 */}\n                    {iconModalTarget && (\n                        <div className=\"mobile-modal fixed inset-0 z-50 flex items-center justify-center p-4\">\n                            <div className=\"mobile-modal-backdrop absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity\" onClick={() => setIconModalTarget(null)}></div>\n                            <div className=\"mobile-sheet mobile-icon-sheet relative w-full max-w-4xl glass-panel bg-white/80 rounded-[2.5rem] shadow-2xl p-8 flex flex-col border border-white animate-in zoom-in-95 duration-200\">\n                                <button onClick={() => setIconModalTarget(null)} className=\"absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors z-10\">\n                                    <Icons.X className=\"w-4 h-4\" />\n                                </button>\n                                <h2 className=\"text-2xl font-black text-slate-800 mb-2 flex items-center gap-2\"><Icons.ImageIcon className=\"w-6 h-6 text-purple-500\" />图标选择</h2>\n                                <p className=\"text-xs text-slate-500 mb-6 font-bold\">点击下方图标为服务器应用自定义图标。</p>\n\n                                <div className=\"flex flex-col sm:flex-row gap-3 sm:items-center mb-4\">\n                                    <div className=\"relative flex-1\">\n                                        <Icons.Search className=\"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400\" />\n                                        <input type=\"text\" className=\"w-full pl-9 pr-4 py-2.5 glass-input rounded-xl text-sm outline-none\" placeholder=\"搜索图标名称...\" value={iconSearch} onChange={e => setIconSearch(e.target.value)} autoFocus />\n                                    </div>\n                                    <div className=\"text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 whitespace-nowrap\">\n                                        {filteredIconEntries.length} / {safeIconEntries.length}\n                                    </div>\n                                </div>\n\n                                <div className=\"overflow-y-auto pr-2 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 pb-4 mt-2 max-h-[60vh]\">\n                                    <div onClick={async () => {\n                                        const up = servers.map(s => s.id === iconModalTarget ? {...s, customIcon: null} : s);\n                                        await syncToCloud(up, iconLib);\n                                        setIconModalTarget(null);\n                                    }} className=\"aspect-square bg-slate-100 rounded-[1.2rem] border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors\">\n                                        <span className=\"text-[10px] font-bold text-slate-500\">自动匹配</span>\n                                    </div>\n                                    {filteredIconEntries.map(([key, url], idx) => (\n                                        <div key={idx} onClick={async () => {\n                                            const up = servers.map(s => s.id === iconModalTarget ? {...s, customIcon: url} : s);\n                                            await syncToCloud(up, iconLib);\n                                            setIconModalTarget(null);\n                                        }} className=\"aspect-square bg-white rounded-[1.2rem] border border-slate-100 p-3 cursor-pointer hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 flex items-center justify-center shadow-sm relative group transition-all\">\n                                            <img src={getProxyImgSrc(url)} className=\"w-full h-full object-contain drop-shadow-sm\" loading=\"lazy\" onError={(e) => {e.target.style.display='none'}} />\n                                            <div className=\"absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white bg-slate-800 px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-50 shadow-xl\">{key}</div>\n                                        </div>\n                                    ))}\n                                    {filteredIconEntries.length === 0 && (\n                                        <div className=\"col-span-full py-12 text-center text-slate-500 text-sm font-bold\">没有匹配的图标</div>\n                                    )}\n                                </div>\n                            </div>\n                        </div>\n                    )}\n                </div>\n            );\n        };\n        const rootEl = document.getElementById('root');\n        try {\n            if (!window.React || !window.ReactDOM) throw new Error('React 或 ReactDOM 未加载');\n            if (rootEl) { ReactDOM.createRoot(rootEl).render(<App />); window.__EMBY_DASHBOARD_BOOTED__ = true; }\n        } catch(e) { showBootError('React 渲染失败：' + (e.message || e.toString())); }\n    </script>\n    <script>\n{{BOOT_FALLBACK_SCRIPT}}\n    </script>\n</body>\n</html>\n";

export default {
  APP_VERSION: "2026.05.19.11",
  APP_UPDATE_NOTES: [
      "修复桌面端程序更新区域按钮被版本信息挤出的问题。"
  ],
  UPDATE_REPO_OWNER: 'pototazhang',
    UPDATE_REPO_NAME: 'emby-js',
    UPDATE_BRANCH: 'main',
    UPDATE_FILE: 'emby.js',
    HISTORY_LIMIT: 7 * 24 * 60,
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
          return new Response('海外敏感内容，大陆ip禁止访问', { status: 403, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
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

        if (request.method === 'GET') {
            const config = await this.loadConfig(env);
            return this.json({ ...config, notifyEnabled: this.isTelegramEnabled(env, config), telegram: this.getTelegramConfig(env, config), publicShareBaseUrl: this.getPublicShareBaseUrl(env), publicShareWildcardDomain: this.getPublicShareWildcardDomain(env) });
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

      if (url.pathname === '/api/ping-all' && request.method === 'POST') {
        const auth = this.requireAdmin(request, env);
        if (auth) return auth;

        const requestBody = await request.json().catch(() => ({}));
        const currentConfig = await this.loadConfig(env);
        const updatedConfig = await this.runProbeLogic(env, currentConfig, { forceMedia: Boolean(requestBody.forceMedia), cursor: Number(requestBody.cursor) || 0 });
        return this.json({ ...updatedConfig, notifyEnabled: this.isTelegramEnabled(env, updatedConfig) });
      }

      if (url.pathname === '/api/update/check' && request.method === 'GET') {
        const auth = this.requireStrictAdmin(request, env);
        if (auth) return auth;

        try {
            const latestSource = await this.fetchLatestWorkerSource(env);
            const latestVersion = this.extractAppVersion(latestSource) || 'unknown';
            const releaseNotes = this.extractUpdateNotes(latestSource);
            return this.json({
                currentVersion: this.APP_VERSION,
                latestVersion,
                hasUpdate: latestVersion !== 'unknown' && latestVersion !== this.APP_VERSION,
                releaseNotes,
                canUpdate: this.canSelfUpdate(env),
                sourceUrl: this.getUpdateRawUrl(env),
                missing: this.getMissingUpdateEnv(env)
            });
        } catch(e) {
            return this.json({
                currentVersion: this.APP_VERSION,
                latestVersion: 'unknown',
                hasUpdate: false,
                releaseNotes: [],
                canUpdate: this.canSelfUpdate(env),
                error: e.message || 'Check update failed',
                missing: this.getMissingUpdateEnv(env)
            }, 502);
        }
      }

      if (url.pathname === '/api/update/apply' && request.method === 'POST') {
        const auth = this.requireStrictAdmin(request, env);
        if (auth) return auth;

        if (!this.canSelfUpdate(env)) {
            return this.json({ ok: false, error: 'Self update is not configured', missing: this.getMissingUpdateEnv(env) }, 400);
        }
        try {
            const latestSource = await this.fetchLatestWorkerSource(env);
            const latestVersion = this.extractAppVersion(latestSource);
            if (!latestVersion) return this.json({ ok: false, error: 'Latest source has no APP_VERSION' }, 422);
            const releaseNotes = this.extractUpdateNotes(latestSource);
            if (latestVersion === this.APP_VERSION) return this.json({ ok: true, updated: false, version: this.APP_VERSION, releaseNotes });
            await this.deployWorkerSource(env, latestSource);
            return this.json({ ok: true, updated: true, previousVersion: this.APP_VERSION, version: latestVersion, releaseNotes });
        } catch(e) {
            return this.json({ ok: false, error: e.message || 'Update failed' }, 502);
        }
      }

      return new Response(HTML_CONTENT, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
    },

    async scheduled(event, env, ctx) {
        ctx.waitUntil(this.loadConfig(env).then((config) => this.runProbeLogic(env, config)));
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
            const wasOffline = previousStatus === 'offline';
            const previousOfflineSince = Number.isFinite(Number(server.offlineSince)) ? Number(server.offlineSince) : 0;
            const previousAlertSentAt = Number.isFinite(Number(server.offlineAlertSentAt)) ? Number(server.offlineAlertSentAt) : 0;
            server.offlineSince = wasOffline && previousOfflineSince > 0 ? previousOfflineSince : checkedAt;
            server.offlineAlertSentAt = wasOffline ? Math.max(0, previousAlertSentAt) : 0;
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
            '.public-grid{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}.public-card{overflow:hidden}.owner-banner{display:flex;align-items:center;gap:12px;margin:0 0 14px;padding:14px 16px;border-radius:22px;background:rgba(255,255,255,.62);border:1px solid rgba(255,255,255,.82);box-shadow:0 12px 34px -28px rgba(15,23,42,.2),inset 0 1px 0 rgba(255,255,255,.88)}.owner-avatar{width:42px;height:42px;border-radius:14px;flex-shrink:0;overflow:hidden;background:rgba(248,250,252,.95);border:1px solid rgba(226,232,240,.9);display:flex;align-items:center;justify-content:center;color:#475569;font-size:18px;font-weight:900}.owner-avatar img{width:100%;height:100%;object-fit:cover}.owner-meta{min-width:0;display:flex;flex-direction:column;gap:2px}.owner-name{font-size:13px;font-weight:900;color:#1e293b;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.metric-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.metric{min-width:0;overflow:visible;padding:12px 6px}.metric span{white-space:nowrap;overflow:visible !important;text-overflow:clip !important;font-size:10px}.metric strong{white-space:nowrap;overflow:visible !important;text-overflow:clip !important;letter-spacing:-0.02em}.metric-movie strong,.metric-series strong{font-size:20px}.metric-episode strong{font-size:15px;color:#64748b;font-weight:800}.public-footer{margin-top:28px;padding-top:14px;border-top:1px solid rgba(148,163,184,.22);text-align:center;color:#94a3b8;font-size:11px;font-weight:700;line-height:1.6}.public-footer a{color:inherit;text-decoration:none}.public-footer a:hover{color:#64748b}.public-footnote{margin-top:6px;font-size:10px;font-weight:700;color:#cbd5e1}@media(max-width:640px){.public-grid{grid-template-columns:1fr}}</style></head><body><div class="bg-canvas"><div class="orb orb-1"></div><div class="orb orb-2"></div><div class="orb orb-3"></div></div><main class="app-shell"><h1 class="brand-title">Emby Status</h1><p class="subtitle">状态数据由各服务器公开接口提供</p>' +
            ownerHtml +
            (cards ? '<section class="public-grid">' + cards + '</section>' : '<div class="empty">暂无服务器</div>') +
            '<footer class="public-footer"><div>项目地址：<a href="https://github.com/pototazhang/emby-js" target="_blank" rel="noopener noreferrer">github.com/pototazhang/emby-js</a></div><div class="public-footnote">更新建议：公开页头像展示、大陆 IP 限制和公开链接设置已完善，建议尽快更新。</div></footer>' +
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

  json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }); },

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

    getMissingUpdateEnv(env) {
        const missing = [];
        if (!['1', 'true', 'yes', 'on'].includes(String(env.UPDATE_ENABLED || '').toLowerCase())) missing.push('UPDATE_ENABLED');
        if (!env.CF_ACCOUNT_ID) missing.push('CF_ACCOUNT_ID');
        if (!env.CF_WORKER_NAME) missing.push('CF_WORKER_NAME');
        if (!env.CF_API_TOKEN) missing.push('CF_API_TOKEN');
        return missing;
    },

    canSelfUpdate(env) { return this.getMissingUpdateEnv(env).length === 0; },

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

  async loadConfig(env) {
        const raw = await env.EMBY_DB.get('config');
        if (!raw) return this.withRevision({ servers: [], icons: {}, updatedAt: 0 });
        try { return this.withRevision(JSON.parse(raw)); } catch(e) { return this.withRevision({ servers: [], icons: {}, updatedAt: 0 }); }
    },

    async saveConfig(env, config) {
        const cleanConfig = this.withRevision(config);
        await env.EMBY_DB.put('config', JSON.stringify(this.sanitizeConfig(cleanConfig)));
        return cleanConfig;
    },

    withRevision(config) {
        const clean = this.sanitizeConfig(config);
        clean.revision = this.configRevision(clean);
        return clean;
    },

    configRevision(config) {
        const clean = this.sanitizeConfig(config);
        const settingsOnly = {
            icons: clean.icons, telegram: clean.telegram,
            servers: clean.servers.map((server) => ({ id: server.id, name: server.name, url: server.url, fallbackUrls: server.fallbackUrls, customIcon: server.customIcon, mediaStats: { enabled: Boolean(server.mediaStats && server.mediaStats.enabled), username: server.mediaStats ? server.mediaStats.username : '', password: server.mediaStats ? server.mediaStats.password : '' } }))
        };
        const text = JSON.stringify(settingsOnly);
        let hash = 2166136261;
        for (let i = 0; i < text.length; i += 1) { hash ^= text.charCodeAt(i); hash = Math.imul(hash, 16777619); }
        return (hash >>> 0).toString(36);
    },

    sanitizeConfig(config) {
        const clean = { servers: [], icons: {}, telegram: { enabled: false, botToken: '', chatId: '' }, updatedAt: 0 };
        if (config && Number.isFinite(Number(config.updatedAt))) clean.updatedAt = Math.max(0, Number(config.updatedAt));
        if (config && config.telegram && typeof config.telegram === 'object') {
            clean.telegram = { enabled: Boolean(config.telegram.enabled), botToken: String(config.telegram.botToken || '').trim(), chatId: String(config.telegram.chatId || '').trim() };
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
                        .slice(0, 4) : [];
                    return {
                        id: s.id || Date.now(), name: String(s.name || parsed.hostname).slice(0, 80), url: mainUrl, fallbackUrls, customIcon: typeof s.customIcon === 'string' ? s.customIcon : null,
                        status: ['online', 'offline', 'updating', 'unknown'].includes(s.status) ? s.status : 'unknown',
                        totalChecks: Number.isFinite(Number(s.totalChecks)) ? Math.max(0, Number(s.totalChecks)) : 0, successfulChecks: Number.isFinite(Number(s.successfulChecks)) ? Math.max(0, Number(s.successfulChecks)) : 0,
                        uptime: typeof s.uptime === 'string' ? s.uptime : '0.0', latency: Number.isFinite(Number(s.latency)) ? Math.max(0, Number(s.latency)) : 0,
                        lastCheck: Number.isFinite(Number(s.lastCheck)) ? Number(s.lastCheck) : 0, offlineSince: Number.isFinite(Number(s.offlineSince)) ? Math.max(0, Number(s.offlineSince)) : 0,
                        offlineAlertSentAt: Number.isFinite(Number(s.offlineAlertSentAt)) ? Math.max(0, Number(s.offlineAlertSentAt)) : 0,
                        addressProbeResults: this.normalizeAddressProbeResults(s.addressProbeResults),
                        history: this.normalizeHistory(s.history, s.lastCheck), mediaStats: this.normalizeMediaStats(s.mediaStats)
                    };
                })
                .filter(Boolean);
        }
        if (config && config.icons && typeof config.icons === 'object' && !Array.isArray(config.icons)) clean.icons = this.extractIcons(config.icons);
        return clean;
    },

    normalizeAddressProbeResults(results) {
        if (!Array.isArray(results)) return [];
        return results.slice(0, 5).map((item) => {
            const parsed = this.normalizeServerUrl(item && item.url);
            if (!parsed) return null;
            return {
                url: parsed.toString().replace(/\/$/, ''),
                ok: Boolean(item.ok),
                latency: Number.isFinite(Number(item.latency)) ? Math.max(0, Number(item.latency)) : 0
            };
        }).filter(Boolean);
    },

    normalizeHistory(history, fallbackTime = 0) {
        if (!Array.isArray(history)) return [];
        const now = Date.now();
        const baseTime = Number.isFinite(Number(fallbackTime)) && Number(fallbackTime) > 0 ? Number(fallbackTime) : now;
        return history.slice(-this.HISTORY_LIMIT).map((entry, index, arr) => {
            if (entry && typeof entry === 'object') {
                const status = entry.status === 'online' || entry.status === 1 || entry.value === 1 ? 'online' : 'offline';
                const time = Number.isFinite(Number(entry.time)) && Number(entry.time) > 0 ? Number(entry.time) : baseTime - ((arr.length - index - 1) * 60000);
                return { status, time, latency: Number.isFinite(Number(entry.latency)) ? Math.max(0, Number(entry.latency)) : 0 };
            }
            return { status: entry ? 'online' : 'offline', time: baseTime - ((arr.length - index - 1) * 60000), latency: 0 };
        });
    },

    normalizeMediaStats(mediaStats) {
        const emptyCounts = { movie: 0, series: 0, episode: 0 };
        if (!mediaStats || typeof mediaStats !== 'object') {
            return { enabled: false, username: '', password: '', accessToken: '', deviceId: '', lastCheck: 0, lastError: '', counts: null, previousCounts: null, delta24h: null, todayCounts: null, yesterdayCounts: null, dailyDelta: null, dailyKey: '' };
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
            enabled: Boolean(mediaStats.enabled), username: String(mediaStats.username || '').slice(0, 120), password: String(mediaStats.password || ''), accessToken: String(mediaStats.accessToken || ''),
            deviceId: String(mediaStats.deviceId || ('forward-' + Math.random().toString(36).slice(2))).slice(0, 120), lastCheck: Number.isFinite(Number(mediaStats.lastCheck)) ? Number(mediaStats.lastCheck) : 0,
            lastError: String(mediaStats.lastError || '').slice(0, 160), counts: cleanCounts(mediaStats.counts), previousCounts: cleanCounts(mediaStats.previousCounts), delta24h: cleanDeltaCounts(mediaStats.delta24h),
            todayCounts: cleanCounts(mediaStats.todayCounts), yesterdayCounts: cleanCounts(mediaStats.yesterdayCounts), dailyDelta: cleanDeltaCounts(mediaStats.dailyDelta), dailyKey: String(mediaStats.dailyKey || '')
        };
        if (!clean.dailyDelta && clean.counts && clean.previousCounts) {
            clean.dailyDelta = { movie: clean.counts.movie - clean.previousCounts.movie, series: clean.counts.series - clean.previousCounts.series, episode: clean.counts.episode - clean.previousCounts.episode, time: clean.counts.time };
        }
        if (!clean.todayCounts && clean.counts) clean.todayCounts = clean.counts;
        if (!clean.yesterdayCounts && clean.previousCounts) clean.yesterdayCounts = clean.previousCounts;
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

  buildEmbyAuthHeader(server) {
        const media = server.mediaStats || {};
        return 'MediaBrowser Client="Forward", Device="Forward", DeviceId="' + (media.deviceId || server.id || 'forward') + '", Version="1.0.0"';
    },

    buildEmbyClientHeaders(server, token = '') {
        const media = server.mediaStats || {};
        const deviceId = media.deviceId || server.id || 'forward';
        const authHeader = this.buildEmbyAuthHeader(server);
        const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': authHeader, 'X-Emby-Authorization': authHeader, 'X-Emby-Client': 'Forward', 'X-Emby-Device-Name': 'Forward', 'X-Emby-Device-Id': String(deviceId), 'X-Emby-Client-Version': '1.0.0', 'User-Agent': 'Forward/1.0.0' };
        if (token) headers['X-Emby-Token'] = token;
        return headers;
    },

    async readShortResponse(response) { try { return (await response.text()).slice(0, 160); } catch(e) { return ''; } },

    getEmbyApiBases(server) {
        const target = this.normalizeServerUrl(server.url);
        if (!target) throw new Error('服务器地址无效');
        const base = target.toString().replace(/\/$/, '');
        const bases = [base];
        if (!base.toLowerCase().endsWith('/emby')) bases.push(base + '/emby');
        return [...new Set(bases)];
    },

    async loginEmbyForMedia(server) {
        const media = server.mediaStats || {};
        if (!media.username) throw new Error('缺少媒体库用户名');
        const bases = this.getEmbyApiBases(server);
        let lastError = '媒体库登录失败';
        for (const base of bases) {
            try {
                const response = await this.fetchWithTimeout(base + '/Users/AuthenticateByName', { method: 'POST', headers: this.buildEmbyClientHeaders(server), body: JSON.stringify({ Username: media.username, Pw: media.password || '', Password: media.password || '' }) }, 8000);
                if (!response.ok) {
                    const detail = await this.readShortResponse(response);
                    lastError = response.status === 401 ? '媒体库账号或密码错误' : '媒体库登录失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                    continue;
                }
                const data = await response.json();
                if (data.AccessToken) return data.AccessToken;
                lastError = '未获取到媒体库 Token';
            } catch(e) { lastError = e.name === 'AbortError' ? '媒体库登录超时' : (e.message || '媒体库登录失败'); }
        }
        throw new Error(lastError);
    },

    async fetchEmbyMediaCounts(server, token) {
        const bases = this.getEmbyApiBases(server);
        let lastError = '资源统计失败';
        for (const base of bases) {
            try {
                const response = await this.fetchWithTimeout(base + '/Items/Counts?api_key=' + encodeURIComponent(token), { method: 'GET', headers: this.buildEmbyClientHeaders(server, token) }, 8000);
                if (!response.ok) {
                    const detail = await this.readShortResponse(response);
                    lastError = response.status === 401 ? '媒体库 Token 失效' : '资源统计失败 HTTP ' + response.status + (detail ? ' / ' + detail : '');
                    continue;
                }
                const data = await response.json();
                return { movie: Number(data.MovieCount || 0), series: Number(data.SeriesCount || 0), episode: Number(data.EpisodeCount || 0), time: Date.now() };
            } catch(e) { lastError = e.name === 'AbortError' ? '资源统计超时' : (e.message || '资源统计失败'); }
        }
        throw new Error(lastError);
    },

  getShanghaiDayKey(time = Date.now(), offsetDays = 0) {
        const shanghaiTime = time + (8 * 60 * 60 * 1000) + (offsetDays * 24 * 60 * 60 * 1000);
        return new Date(shanghaiTime).toISOString().slice(0, 10);
    },

    isShanghaiMidnightWindow(time = Date.now()) {
        const shanghai = new Date(time + (8 * 60 * 60 * 1000));
        return shanghai.getUTCHours() === 0;
    },

    buildDailyMediaStats(media, counts, now = Date.now()) {
        const todayKey = this.getShanghaiDayKey(now);
        const yesterdayKey = this.getShanghaiDayKey(now, -1);
        const countsWithTime = { ...counts, time: counts.time || now };
        let todayCounts = media.todayCounts || null;
        let yesterdayCounts = media.yesterdayCounts || null;

        if (media.dailyKey && media.dailyKey !== todayKey) {
            if (media.dailyKey === yesterdayKey && todayCounts) { yesterdayCounts = todayCounts; } else if (!yesterdayCounts && media.counts) { yesterdayCounts = media.counts; }
            todayCounts = countsWithTime;
        } else if (!todayCounts) { todayCounts = countsWithTime; }

        if (this.isShanghaiMidnightWindow(now)) { todayCounts = countsWithTime; }

        const baseline = yesterdayCounts || media.previousCounts || null;
        const dailyDelta = baseline ? { movie: countsWithTime.movie - baseline.movie, series: countsWithTime.series - baseline.series, episode: countsWithTime.episode - baseline.episode, time: countsWithTime.time } : { movie: 0, series: 0, episode: 0, time: countsWithTime.time };

        return { todayCounts, yesterdayCounts, dailyDelta, dailyKey: todayKey };
    },

    async verifyWithLoginState(server) {
        const media = server.mediaStats || {};
        if (!media.enabled || !media.accessToken) return null;
        try {
            const start = Date.now();
            await this.fetchEmbyMediaCounts(server, media.accessToken);
            return { ok: true, latency: Date.now() - start };
        } catch(e) {
            if (String(e.message || '').includes('Token 失效')) return null;
            return { ok: false, latency: 0 };
        }
    },

    async fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), timeoutMs);
        try { return await fetch(url, { ...options, signal: c.signal }); } finally { clearTimeout(t); }
    },

    async probeEmbyServer(server, targetUrl) {
        const headers = { 'Accept': 'application/json,text/plain,*/*', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36' };
        const paths = ['/emby/System/Info/Public', '/System/Info/Public', '/emby/Users/Public'];
        const start = Date.now();
        for (const path of paths) {
            try {
                const r = await this.fetchWithTimeout(targetUrl + path, { method: 'GET', headers }, 5000);
                if (r.status >= 200 && r.status < 400) return { ok: true, latency: Date.now() - start };
                if (r.status === 401 || r.status === 403) return { ok: true, latency: Date.now() - start };
            } catch(e) {}
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

    async probeEmbyServerWithFallbacks(server) {
        const targets = this.getProbeTargets(server);
        const addressProbeResults = [];
        for (const targetUrl of targets) {
            let result = { ok: false, latency: 0 };
            try {
                result = await this.probeEmbyServer(server, targetUrl);
            } catch(e) {}
            addressProbeResults.push({ url: targetUrl, ok: Boolean(result.ok), latency: Number(result.latency) || 0 });
            if (result.ok) {
                return { ok: true, latency: Number(result.latency) || 0, addressProbeResults };
            }
        }
        return { ok: false, latency: 0, addressProbeResults };
    },

    async refreshMediaStatsIfNeeded(server, force = false) {
        const media = server.mediaStats || {};
        server.mediaStatsTouched = false;
        if (!media.enabled) return server;
        const now = Date.now();
        const todayKey = this.getShanghaiDayKey(now);
        const needsDailySnapshot = media.dailyKey !== todayKey || !media.todayCounts || !media.dailyDelta;
        if (!force && media.lastCheck && !needsDailySnapshot) return server;
        server.mediaStatsTouched = true;

        try {
            let token = media.accessToken;
            let counts;
            try {
                if (!token) token = await this.loginEmbyForMedia(server);
                counts = await this.fetchEmbyMediaCounts(server, token);
            } catch(e) {
                token = await this.loginEmbyForMedia(server);
                counts = await this.fetchEmbyMediaCounts(server, token);
            }
            const dailyStats = this.buildDailyMediaStats(media, counts, now);
            const previous = dailyStats.yesterdayCounts || media.previousCounts || media.counts || null;
            server.mediaStats = {
                ...media, accessToken: token, previousCounts: previous, counts, todayCounts: dailyStats.todayCounts, yesterdayCounts: dailyStats.yesterdayCounts, dailyDelta: dailyStats.dailyDelta, dailyKey: dailyStats.dailyKey,
                delta24h: previous ? { movie: counts.movie - previous.movie, series: counts.series - previous.series, episode: counts.episode - previous.episode, time: counts.time } : { movie: 0, series: 0, episode: 0, time: counts.time },
                lastCheck: counts.time, lastError: ''
            };
        } catch(e) { server.mediaStats = { ...media, lastError: e.message || '媒体库统计失败' }; }
        return server;
    },

    async runProbeLogic(env, config, options = {}) {
        if (!config || !config.servers || config.servers.length === 0) return config;
        const forceMedia = Boolean(options.forceMedia);
        const batchSize = forceMedia ? 4 : config.servers.length;
        const cursor = forceMedia ? Math.max(0, Number(options.cursor) || 0) : 0;
        const batchEnd = Math.min(config.servers.length, cursor + batchSize);
        const batchIds = new Set(config.servers.slice(cursor, batchEnd).map((s) => s.id));

        const probePromises = config.servers.filter((s) => batchIds.has(s.id)).map(async (s) => {
            const previousStatus = s.status;
            s.totalChecks = (s.totalChecks || 0) + 1;
            s.history = this.normalizeHistory(s.history, s.lastCheck);
            const checkedAt = Date.now();

            const probeTargets = this.getProbeTargets(s);
            if (!probeTargets.length) {
                s.status = 'offline'; s.latency = 0; s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
                s.addressProbeResults = [];
                if (s.history.length > this.HISTORY_LIMIT) s.history.shift();
                s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
                s.lastCheck = checkedAt; this.updateOfflineNotifyState(s, previousStatus, checkedAt);
                await this.refreshMediaStatsIfNeeded(s, forceMedia || !s.mediaStats || !s.mediaStats.lastCheck);
                s.previousStatus = previousStatus; return s;
            }

            let isAlive = false;
            let finalLatency = 0;
            let addressProbeResults = [];

            try {
                const result = await this.probeEmbyServerWithFallbacks(s);
                isAlive = result.ok; finalLatency = result.latency; addressProbeResults = result.addressProbeResults || [];
            } catch(e) { isAlive = false; }
            s.addressProbeResults = addressProbeResults;

            if (isAlive) {
                s.successfulChecks = (s.successfulChecks || 0) + 1; s.status = 'online'; s.latency = finalLatency; s.history.push({ status: 'online', time: checkedAt, latency: finalLatency });
            } else {
                s.status = 'offline'; s.latency = 0; s.history.push({ status: 'offline', time: checkedAt, latency: 0 });
            }

            if (s.history.length > this.HISTORY_LIMIT) s.history.shift();
            s.uptime = s.totalChecks > 0 ? ((s.successfulChecks / s.totalChecks) * 100).toFixed(1) : "0.0";
            s.lastCheck = checkedAt; this.updateOfflineNotifyState(s, previousStatus, checkedAt);
            await this.refreshMediaStatsIfNeeded(s, forceMedia || !s.mediaStats || !s.mediaStats.lastCheck);
            s.previousStatus = previousStatus; return s;
        });

        const probedServers = await Promise.all(probePromises);
        const probedById = new Map(probedServers.map((s) => [s.id, s]));
        const latestConfig = await this.loadConfig(env);
        const latestById = new Map(latestConfig.servers.map((s) => [s.id, s]));
        const notifyQueue = [];
        const sourceConfig = latestConfig;
        const baseConfig = this.sanitizeConfig({ icons: sourceConfig.icons !== undefined ? sourceConfig.icons : latestConfig.icons, telegram: sourceConfig.telegram !== undefined ? sourceConfig.telegram : latestConfig.telegram, servers: sourceConfig.servers, updatedAt: sourceConfig.updatedAt || latestConfig.updatedAt || 0 });
        const mergedConfig = {
            icons: baseConfig.icons, telegram: baseConfig.telegram, updatedAt: Math.max(baseConfig.updatedAt || 0, latestConfig.updatedAt || 0),
            servers: baseConfig.servers.map((latest) => {
                const probed = probedById.get(latest.id);
                if (!probed || probed.url !== latest.url) return latest;
                const previouslySaved = latestById.get(latest.id) || latest;
                const mergedServer = { ...latest, status: probed.status, totalChecks: probed.totalChecks, successfulChecks: probed.successfulChecks, uptime: probed.uptime, latency: probed.latency, lastCheck: probed.lastCheck, offlineSince: probed.offlineSince, offlineAlertSentAt: probed.offlineAlertSentAt, addressProbeResults: probed.addressProbeResults || [], history: probed.history, mediaStats: probed.mediaStatsTouched ? probed.mediaStats : latest.mediaStats };
                const oldStatus = previouslySaved.url === latest.url && JSON.stringify(previouslySaved.fallbackUrls || []) === JSON.stringify(latest.fallbackUrls || []) ? previouslySaved.status : probed.previousStatus;
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
                if (telegramEnabled && oldStatus === 'offline' && mergedServer.status === 'offline' && shouldSendOffline) {
                    notifyQueue.push({ message: this.buildStatusMessage(mergedServer, oldStatus, mergedServer.status), kind: 'offline', serverId: mergedServer.id, lastCheck: mergedServer.lastCheck });
                } else if (telegramEnabled && oldStatus === 'offline' && mergedServer.status === 'online' && previouslySaved.offlineAlertSentAt) {
                    notifyQueue.push({ message: this.buildStatusMessage({ ...mergedServer, offlineSince: previouslySaved.offlineSince || mergedServer.offlineSince }, oldStatus, mergedServer.status), kind: 'online' });
                }
                return mergedServer;
            })
        };
        if (forceMedia) {
            mergedConfig.nextCursor = batchEnd < baseConfig.servers.length ? batchEnd : 0;
            mergedConfig.hasMore = batchEnd < baseConfig.servers.length;
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
                if (!ok || !item || item.kind !== 'offline') continue;
                const targetId = item.serverId;
                const targetServer = mergedConfig.servers.find((server) => server.id === targetId);
                if (targetServer) {
                    targetServer.offlineAlertSentAt = item.lastCheck;
                    updated = true;
                }
            }
            if (updated) {
                mergedConfig.updatedAt = Math.max(mergedConfig.updatedAt || 0, Date.now());
            }
        }
        await this.saveConfig(env, mergedConfig);
        return mergedConfig;
    }
  ,
};

/*
 * 前端启动与白屏诊断脚本。
 *
 * 负责 CDN 加载失败、JSX 编译失败、React 启动失败和异步错误提示。
 * 这里的函数需要在 React/Babel CDN 前后按 build 脚本插入到 HTML 外壳中。
 */

/* @section head */
function showBootError(message) {
    var el = document.getElementById('boot-error');
    var root = document.getElementById('root');
    if (root) {
        root.innerHTML = '';
    }
    if (el) {
        el.style.display = 'block';
        el.style.position = 'fixed';
        el.style.left = '50%';
        el.style.top = '40px';
        el.style.transform = 'translateX(-50%)';
        el.style.zIndex = '99999';
        el.style.width = 'calc(100% - 32px)';
        el.textContent = message;
    }
}

/* @section body */
window.addEventListener('error', (event) => {
    if (event.message === 'Script error.') return;
    showBootError('页面脚本错误：' + (event.message || 'Unknown error') + (event.filename ? '\\n' + event.filename + ':' + event.lineno : ''));
});
window.addEventListener('DOMContentLoaded', function() {
    if (window.Babel && window.Babel.transform) {
        var scripts = document.querySelectorAll('script[type="text/babel"]');
        scripts.forEach(function(script) {
            try {
                window.Babel.transform(script.textContent || '', { presets: ['react'] });
            } catch(e) {
                showBootError('JSX 编译失败：' + (e.message || e.toString()));
            }
        });
    }
});
window.addEventListener('unhandledrejection', (event) => {
    showBootError('页面异步错误：' + ((event.reason && (event.reason.message || event.reason.toString())) || 'Unknown rejection'));
});
setTimeout(function() {
    var root = document.getElementById('root');
    var bootError = document.getElementById('boot-error');
    if (root && root.textContent.indexOf('页面加载中') !== -1 && bootError && bootError.style.display === 'none') {
        showBootError('前端没有启动：' + (window.Babel ? 'Babel 已加载但 JSX 脚本未执行。' : 'Babel CDN 未加载。') + '请清理缓存后重新加载，或检查浏览器控制台。');
    }
}, 3000);

/* @section fallback */
setTimeout(function() {
    var root = document.getElementById('root');
    if (!window.__EMBY_DASHBOARD_BOOTED__ && root && root.textContent.indexOf('页面加载中') !== -1) {
        root.innerHTML = '<div style="max-width:760px;margin:48px auto;padding:20px;border:1px solid #7f1d1d;border-radius:16px;background:#1e293b;color:#fecaca;font-family:system-ui;white-space:pre-wrap;">前端启动失败：React/Babel 脚本没有完成渲染。请确认部署的是最新 emby.js，并打开浏览器控制台查看具体报错。</div>';
    }
}, 4500);

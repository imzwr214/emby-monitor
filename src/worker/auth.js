/*
 * 后台管理鉴权。
 *
 * 负责 JSON 响应工具和后台管理 Token 校验。
 * `/api/config`、测速、分享管理和自更新等后台接口必须使用这里的鉴权。
 */
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

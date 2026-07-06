const { kvGet, kvSet, kvListAppend, kvListRange, json, readBody, requireKv } = require("./_kv");

module.exports = async function handler(req, res) {
  const missing = requireKv(res);
  if (missing) return;

  if (req.method === "POST") {
    const session = await readBody(req);
    if (!session || !session.session_id || !session.task_id) {
      return json(res, 400, { error: "Invalid session payload" });
    }
    const key = `session:${session.session_id}`;
    const exists = await kvGet(key);
    if (!exists) {
      await kvSet(key, session);
      await kvListAppend(`sessions:${session.task_id}`, session.session_id);
    }
    return json(res, 200, { sessionId: session.session_id });
  }

  if (req.method === "GET") {
    const taskId = req.query.taskId;
    if (!taskId) return json(res, 400, { error: "Missing taskId" });
    const ids = await kvListRange(`sessions:${taskId}`, 0, 100);
    const sessions = [];
    for (const id of ids) {
      const session = await kvGet(`session:${id}`);
      if (session) sessions.push(session);
    }
    return json(res, 200, { sessions });
  }

  return json(res, 405, { error: "Method not allowed" });
};

const { kvGet, kvSet, json, readBody, requireKv } = require("./_kv");

module.exports = async function handler(req, res) {
  const missing = requireKv(res);
  if (missing) return;

  if (req.method === "POST") {
    const task = await readBody(req);
    if (!task || !task.task_id || !Array.isArray(task.words)) {
      return json(res, 400, { error: "Invalid task payload" });
    }
    await kvSet(`task:${task.task_id}`, task);
    return json(res, 200, { taskId: task.task_id });
  }

  if (req.method === "GET") {
    const id = req.query.id;
    if (!id) return json(res, 400, { error: "Missing task id" });
    const task = await kvGet(`task:${id}`);
    if (!task) return json(res, 404, { error: "Task not found" });
    return json(res, 200, { task });
  }

  return json(res, 405, { error: "Method not allowed" });
};

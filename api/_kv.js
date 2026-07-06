const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function requireKv(res) {
  if (KV_URL && KV_TOKEN) return false;
  json(res, 501, {
    error: "Cloud storage is not configured",
    hint: "Add Vercel KV / Upstash Redis and set KV_REST_API_URL and KV_REST_API_TOKEN.",
  });
  return true;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : null;
}

async function kvCommand(command) {
  const response = await fetch(KV_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`KV command failed: ${response.status}`);
  const data = await response.json();
  return data.result;
}

async function kvGet(key) {
  const raw = await kvCommand(["get", key]);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

async function kvSet(key, value) {
  return kvCommand(["set", key, JSON.stringify(value)]);
}

async function kvListAppend(key, value) {
  return kvCommand(["lpush", key, value]);
}

async function kvListRange(key, start, stop) {
  const result = await kvCommand(["lrange", key, String(start), String(stop)]);
  return Array.isArray(result) ? result : [];
}

module.exports = { kvGet, kvSet, kvListAppend, kvListRange, json, readBody, requireKv };

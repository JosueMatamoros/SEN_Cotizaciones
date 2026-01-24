const API_URL = import.meta.env.VITE_API_URL;

function buildUrl(path) {
  const base = String(API_URL || "").replace(/\/+$/, "");
  const p = String(path || "").replace(/^\/+/, "");
  return `${base}/${p}`;
}

async function request(path, options) {
  const res = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options && options.headers ? options.headers : {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      typeof body === "object" && body && body.error
        ? body.error
        : `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return body;
}

export async function createProforma(payload) {
  return request("/proformas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

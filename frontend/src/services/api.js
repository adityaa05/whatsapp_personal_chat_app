const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getHeaders = (isJson = true) => {
  const token = localStorage.getItem("kb_token");
  const h = {};
  if (isJson) h["Content-Type"] = "application/json";
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
};

const handle = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
};

export const api = {
  login: async (username, password) => {
    const body = new URLSearchParams({ username, password });
    return handle(
      await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }),
    );
  },
  getNotes: async (q = null, pinned = null) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (pinned !== null) params.set("pinned", pinned);
    const url = `${API_URL}/notes/${params.toString() ? "?" + params : ""}`;
    return handle(await fetch(url, { headers: getHeaders(false) }));
  },
  createNote: async (content) =>
    handle(
      await fetch(`${API_URL}/notes/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ content, type: "text" }),
      }),
    ),
  togglePin: async (noteId) =>
    handle(
      await fetch(`${API_URL}/notes/${noteId}/pin`, {
        method: "PATCH",
        headers: getHeaders(false),
      }),
    ),
  deleteNote: async (noteId) =>
    handle(
      await fetch(`${API_URL}/notes/${noteId}`, {
        method: "DELETE",
        headers: getHeaders(false),
      }),
    ),
  addComment: async (noteId, content) =>
    handle(
      await fetch(`${API_URL}/notes/${noteId}/comments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ content }),
      }),
    ),
  deleteComment: async (noteId, commentId) =>
    handle(
      await fetch(`${API_URL}/notes/${noteId}/comments/${commentId}`, {
        method: "DELETE",
        headers: getHeaders(false),
      }),
    ),
};

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

  getNotes: (tag = null, q = null, pinned = null) => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (q) params.set("q", q);
    if (pinned !== null) params.set("pinned", pinned);
    const url = `${API_URL}/notes/${params.toString() ? "?" + params : ""}`;
    return handle(fetch(url, { headers: getHeaders(false) }));
  },

  getTags: () =>
    handle(fetch(`${API_URL}/tags/`, { headers: getHeaders(false) })),

  createNote: (content) =>
    handle(
      fetch(`${API_URL}/notes/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ content, type: "text" }),
      }),
    ),

  togglePin: (noteId) =>
    handle(
      fetch(`${API_URL}/notes/${noteId}/pin`, {
        method: "PATCH",
        headers: getHeaders(false),
      }),
    ),

  deleteNote: (noteId) =>
    handle(
      fetch(`${API_URL}/notes/${noteId}`, {
        method: "DELETE",
        headers: getHeaders(false),
      }),
    ),

  addComment: (noteId, content) =>
    handle(
      fetch(`${API_URL}/notes/${noteId}/comments`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ content }),
      }),
    ),

  deleteComment: (noteId, commentId) =>
    handle(
      fetch(`${API_URL}/notes/${noteId}/comments/${commentId}`, {
        method: "DELETE",
        headers: getHeaders(false),
      }),
    ),
};

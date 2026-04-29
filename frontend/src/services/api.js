const API_URL = "http://localhost:8000/api";

// Helper function to attach the VIP pass (JWT token) to every request
const getHeaders = (isJson = true) => {
  const token = localStorage.getItem("kb_token");
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export const api = {
  // NEW: Login endpoint
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (!response.ok) throw new Error("Invalid username or password");
    return response.json();
  },

  getNotes: async (tag = null) => {
    const url = tag ? `${API_URL}/notes/?tag=${tag}` : `${API_URL}/notes/`;
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error("Failed to fetch notes");
    return response.json();
  },

  getTags: async () => {
    const response = await fetch(`${API_URL}/tags/`, { headers: getHeaders() });
    if (!response.ok) throw new Error("Failed to fetch tags");
    return response.json();
  },

  createNote: async (content, type = "text") => {
    const response = await fetch(`${API_URL}/notes/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ content, type }),
    });
    if (!response.ok) throw new Error("Failed to create note");
    return response.json();
  },

  addComment: async (noteId, content) => {
    const response = await fetch(`${API_URL}/notes/${noteId}/comments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error("Failed to add comment");
    return response.json();
  },
};

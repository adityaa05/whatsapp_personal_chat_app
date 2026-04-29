const API_URL = "http://localhost:8000/api";

export const api = {
  // Now accepts an optional tag parameter
  getNotes: async (tag = null) => {
    const url = tag ? `${API_URL}/notes/?tag=${tag}` : `${API_URL}/notes/`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch notes");
    return response.json();
  },

  createNote: async (content, type = "text") => {
    const response = await fetch(`${API_URL}/notes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, type }),
    });
    if (!response.ok) throw new Error("Failed to create note");
    return response.json();
  },
};

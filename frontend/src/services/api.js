// Local dev URL. We will move this to .env later for production.
const API_URL = "http://localhost:8000/api";

export const api = {
  // Fetch all notes
  getNotes: async () => {
    const response = await fetch(`${API_URL}/notes/`);
    if (!response.ok) throw new Error("Failed to fetch notes");
    return response.json();
  },

  // Create a new note
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

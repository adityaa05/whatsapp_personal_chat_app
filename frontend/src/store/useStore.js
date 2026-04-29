import { create } from "zustand";
import { api } from "../services/api";

export const useStore = create((set, get) => ({
  // Auth State
  token: localStorage.getItem("kb_token") || null,
  authError: null,
  isLoggingIn: false,

  // App State
  notes: [],
  tags: [],
  activeTag: null,
  isLoading: false,
  error: null,

  // NEW: Auth Actions
  login: async (username, password) => {
    set({ isLoggingIn: true, authError: null });
    try {
      const data = await api.login(username, password);
      localStorage.setItem("kb_token", data.access_token);
      set({ token: data.access_token, isLoggingIn: false });

      // Fetch data immediately after successful login
      get().fetchTags();
      get().fetchNotes();
    } catch (error) {
      set({ authError: error.message, isLoggingIn: false });
    }
  },

  logout: () => {
    localStorage.removeItem("kb_token");
    // Clear all sensitive data from memory
    set({ token: null, notes: [], tags: [], activeTag: null, authError: null });
  },

  // Existing Actions
  setActiveTag: (tag) => {
    set({ activeTag: tag });
    get().fetchNotes();
  },

  fetchTags: async () => {
    if (!get().token) return; // Don't fetch if not logged in
    try {
      const tags = await api.getTags();
      set({ tags });
    } catch (error) {
      console.error("Failed to fetch tags", error);
    }
  },

  fetchNotes: async () => {
    if (!get().token) return; // Don't fetch if not logged in
    set({ isLoading: true });
    try {
      const notes = await api.getNotes(get().activeTag);
      set({ notes, isLoading: false, error: null });
    } catch (error) {
      // If unauthorized, log the user out
      if (error.message.includes("401")) get().logout();
      set({ error: error.message, isLoading: false });
    }
  },

  addNote: async (content) => {
    try {
      await api.createNote(content);
      get().fetchNotes();
      get().fetchTags();
    } catch (error) {
      set({ error: error.message });
    }
  },

  addComment: async (noteId, content) => {
    try {
      await api.addComment(noteId, content);
      get().fetchNotes();
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  },
}));

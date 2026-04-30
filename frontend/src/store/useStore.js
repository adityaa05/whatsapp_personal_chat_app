import { create } from "zustand";
import { api } from "../services/api";

export const useStore = create((set, get) => ({
  // Auth
  token: localStorage.getItem("kb_token") || null,
  authError: null,
  isLoggingIn: false,

  // UI state
  notes: [],
  tags: [],
  activeTag: null,
  searchQuery: "",
  isLoading: false,
  error: null,
  isSaving: false,

  login: async (username, password) => {
    set({ isLoggingIn: true, authError: null });
    try {
      const data = await api.login(username, password);
      localStorage.setItem("kb_token", data.access_token);
      set({ token: data.access_token, isLoggingIn: false });
      get().fetchTags();
      get().fetchNotes();
    } catch (err) {
      set({ authError: err.message, isLoggingIn: false });
    }
  },

  logout: () => {
    localStorage.removeItem("kb_token");
    set({
      token: null,
      notes: [],
      tags: [],
      activeTag: null,
      searchQuery: "",
      authError: null,
    });
  },

  setActiveTag: (tag) => {
    set({ activeTag: tag, searchQuery: "" });
    get().fetchNotes();
  },

  setSearchQuery: (q) => {
    set({ searchQuery: q });
  },

  fetchTags: async () => {
    if (!get().token) return;
    try {
      const tags = await api.getTags();
      set({ tags });
    } catch (e) {
      console.error("fetchTags:", e);
    }
  },

  fetchNotes: async () => {
    if (!get().token) return;
    set({ isLoading: true });
    try {
      const { activeTag, searchQuery } = get();
      const notes = await api.getNotes(activeTag, searchQuery || null);
      set({ notes, isLoading: false, error: null });
    } catch (err) {
      if (err.message.includes("401")) get().logout();
      set({ error: err.message, isLoading: false });
    }
  },

  addNote: async (content) => {
    if (!content.trim()) return;
    set({ isSaving: true });
    try {
      await api.createNote(content.trim());
      await get().fetchNotes();
      await get().fetchTags();
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isSaving: false });
    }
  },

  togglePin: async (noteId) => {
    try {
      const updated = await api.togglePin(noteId);
      set((state) => ({
        notes: state.notes
          .map((n) => (n.id === noteId ? updated : n))
          .sort(
            (a, b) =>
              b.is_pinned - a.is_pinned ||
              new Date(b.created_at) - new Date(a.created_at),
          ),
      }));
    } catch (err) {
      console.error("togglePin:", err);
    }
  },

  deleteNote: async (noteId) => {
    try {
      await api.deleteNote(noteId);
      set((state) => ({ notes: state.notes.filter((n) => n.id !== noteId) }));
      get().fetchTags();
    } catch (err) {
      console.error("deleteNote:", err);
    }
  },

  addComment: async (noteId, content) => {
    try {
      const comment = await api.addComment(noteId, content);
      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === noteId
            ? { ...n, comments: [...(n.comments || []), comment] }
            : n,
        ),
      }));
    } catch (err) {
      console.error("addComment:", err);
    }
  },

  deleteComment: async (noteId, commentId) => {
    try {
      await api.deleteComment(noteId, commentId);
      set((state) => ({
        notes: state.notes.map((n) =>
          n.id === noteId
            ? { ...n, comments: n.comments.filter((c) => c.id !== commentId) }
            : n,
        ),
      }));
    } catch (err) {
      console.error("deleteComment:", err);
    }
  },
}));

import { create } from "zustand";
import { api } from "../services/api";

export const useStore = create((set, get) => ({
  notes: [],
  tags: [],
  activeTag: null,
  isLoading: false,
  error: null,

  setActiveTag: (tag) => {
    set({ activeTag: tag });
    get().fetchNotes();
  },

  fetchTags: async () => {
    try {
      const tags = await api.getTags();
      set({ tags });
    } catch (error) {
      console.error("Failed to fetch tags", error);
    }
  },

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const currentTag = get().activeTag;
      const notes = await api.getNotes(currentTag);
      set({ notes, isLoading: false, error: null });
    } catch (error) {
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

  // NEW: Submit a comment and refresh the feed
  addComment: async (noteId, content) => {
    try {
      await api.addComment(noteId, content);
      get().fetchNotes(); // Instantly re-fetch to show the new comment
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  },
}));

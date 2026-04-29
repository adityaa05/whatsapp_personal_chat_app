import { create } from "zustand";
import { api } from "../services/api";

export const useStore = create((set, get) => ({
  notes: [],
  activeTag: null, // Keeps track of what we are filtering by
  isLoading: false,
  error: null,

  // Set the active tag and fetch notes immediately
  setActiveTag: (tag) => {
    set({ activeTag: tag });
    get().fetchNotes();
  },

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      // Pass the current active tag to the API
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
      // Refresh the list to show the new note (and apply current filters)
      get().fetchNotes();
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

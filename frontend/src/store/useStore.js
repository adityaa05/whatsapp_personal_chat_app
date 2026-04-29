import { create } from "zustand";
import { api } from "../services/api";

export const useStore = create((set) => ({
  notes: [],
  isLoading: false,
  error: null,

  // Action to load notes from the backend
  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const notes = await api.getNotes();
      set({ notes, isLoading: false, error: null });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Action to post a new note and update the UI immediately
  addNote: async (content) => {
    try {
      const newNote = await api.createNote(content);
      // Put the new note at the top of the array
      set((state) => ({ notes: [newNote, ...state.notes] }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

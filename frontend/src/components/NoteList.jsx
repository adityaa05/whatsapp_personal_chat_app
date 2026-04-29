import React, { useEffect } from "react";
import { useStore } from "../store/useStore";
import MarkdownRenderer from "./MarkdownRenderer";

export default function NoteList() {
  const { notes, fetchNotes, isLoading, error } = useStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (isLoading)
    return (
      <div className="text-center text-slate-500 mt-10">
        Loading your knowledge base...
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Database Error: {error}
      </div>
    );
  if (notes.length === 0)
    return (
      <div className="text-center text-slate-400 mt-10">
        No notes found. Start pasting below!
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          {/* Note Metadata Header */}
          <div className="text-xs text-slate-400 mb-4 flex justify-between border-b border-slate-50 pb-2">
            <span>{new Date(note.created_at).toLocaleString()}</span>
            <span className="bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-wider">
              {note.type}
            </span>
          </div>

          {/* The actual content */}
          <MarkdownRenderer content={note.content} />
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import MarkdownRenderer from "./MarkdownRenderer";

// Individual Note Component so each note can manage its own comment text input
const NoteItem = ({ note, addComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(note.id, commentText);
    setCommentText(""); // Clear input after posting
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header: Timestamp and Tags */}
      <div className="text-xs text-slate-400 mb-4 flex justify-between items-center border-b border-slate-50 pb-2">
        <span>{new Date(note.created_at).toLocaleString()}</span>
        <div className="flex gap-2">
          {note.tags &&
            note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium tracking-wide"
              >
                #{tag}
              </span>
            ))}
        </div>
      </div>

      {/* The Core Content */}
      <MarkdownRenderer content={note.content} />

      {/* Context Comments Section */}
      <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-5 -mb-5 p-5 rounded-b-xl">
        {/* Render Existing Comments */}
        {note.comments && note.comments.length > 0 && (
          <div className="space-y-2 mb-4">
            {note.comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-700 shadow-sm"
              >
                <span className="font-semibold text-slate-400 mr-2 text-xs">
                  Note to self:
                </span>
                {comment.content}
              </div>
            ))}
          </div>
        )}

        {/* Add New Comment Input */}
        <form onSubmit={handleCommentSubmit} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add context or thoughts to this snippet..."
            className="flex-1 text-sm border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

// Main List Component
export default function NoteList() {
  const { notes, fetchNotes, isLoading, error, addComment } = useStore();

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
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} addComment={addComment} />
      ))}
    </div>
  );
}

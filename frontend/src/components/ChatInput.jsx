import React, { useState } from "react";
import { useStore } from "../store/useStore";

export default function ChatInput() {
  const [content, setContent] = useState("");
  const addNote = useStore((state) => state.addNote);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    await addNote(content);
    setContent(""); // Clear the box after successful save
  };

  const handleKeyDown = (e) => {
    // Submit on Enter, but allow Shift+Enter for a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-slate-50 border-t border-slate-200"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm"
        rows="4"
        placeholder="Paste ChatGPT Markdown, Code, or thoughts here... (Press Enter to save, Shift+Enter for new line)"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={!content.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-md font-medium transition-colors"
        >
          Save Note
        </button>
      </div>
    </form>
  );
}

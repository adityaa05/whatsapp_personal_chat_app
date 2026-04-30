import React, { useState } from "react";
import { useStore } from "../store/useStore";

export default function ChatInput() {
  const [content, setContent] = useState("");
  const addNote = useStore((state) => state.addNote);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;
    await addNote(content);
    setContent("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div id="chat-input-area">
      <div style={{ marginBottom: "4px" }}>
        <span
          style={{
            background: "#003b73",
            color: "white",
            fontSize: "11px",
            fontWeight: "700",
            padding: "3px 10px",
            display: "inline-block",
            borderRadius: "3px 3px 0 0",
          }}
        >
          Add New Note
        </span>
      </div>
      <div
        style={{
          background: "#f6f6f6",
          border: "1px solid #cfcfcf",
          padding: "8px",
          boxShadow: "inset 0 1px 0 #fff, inset 0 -1px 0 #d6d6d6",
        }}
      >
        <div className="input-row">
          <textarea
            className="erp-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="Paste Markdown, code snippets, or notes here... (Enter to save, Shift+Enter for new line)"
            style={{ fontSize: "12px" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "6px",
            marginTop: "6px",
          }}
        >
          <button
            className="btn-secondary"
            type="button"
            onClick={() => setContent("")}
            disabled={!content.trim()}
          >
            Clear
          </button>
          <button
            className="btn-primary"
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

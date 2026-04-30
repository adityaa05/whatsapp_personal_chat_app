import React, { useState, useRef } from "react";
import { useStore } from "../store/useStore";

export default function NoteInput() {
  const [content, setContent] = useState("");
  const { addNote, isSaving } = useStore();
  const ref = useRef(null);

  const submit = async () => {
    if (!content.trim() || isSaving) return;
    await addNote(content);
    setContent("");
    ref.current?.focus();
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const charCount = content.length;

  return (
    <div id="input-area">
      <div className="input-tab">+ Add New Note</div>
      <div className="input-panel">
        <textarea
          ref={ref}
          className="erp-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={onKey}
          rows={3}
          placeholder="Paste text, Markdown, code, links, or anything... Enter to save, Shift+Enter for new line."
        />
        <div className="input-footer">
          <div className="input-hint">
            <kbd>Enter</kbd> to save &nbsp; &nbsp; <kbd>Shift+Enter</kbd> new
            line &nbsp; &nbsp;
            <span
              style={{ color: charCount > 1000 ? "var(--gold)" : "inherit" }}
            >
              {charCount > 0 ? `${charCount} chars` : ""}
            </span>
          </div>
          <div className="input-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setContent("")}
              disabled={!content.trim()}
            >
              Clear
            </button>
            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={!content.trim() || isSaving}
            >
              {isSaving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

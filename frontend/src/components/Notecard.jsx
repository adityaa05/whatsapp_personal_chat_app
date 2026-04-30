import React, { useState } from "react";
import { useStore } from "../store/useStore";
import MarkdownRenderer from "./MarkdownRenderer";

function formatDate(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function NoteCard({ note, index }) {
  const { togglePin, deleteNote, addComment, deleteComment } = useStore();
  const [commentText, setCommentText] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(note.id, commentText.trim());
    setCommentText("");
  };

  const handleDelete = () => {
    if (showConfirmDelete) {
      deleteNote(note.id);
    } else {
      setShowConfirmDelete(true);
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  const isLong = note.content.length > 800;
  const [showFull, setShowFull] = useState(!isLong);

  return (
    <div className={`note-card${note.is_pinned ? " pinned" : ""}`}>
      {/* Header */}
      <div className="note-header">
        <span className="note-num">#{String(index).padStart(4, "0")}</span>
        <span className="note-date">🗓️ {formatDate(note.created_at)}</span>
        {note.is_pinned && (
          <span className="note-tag pinned-tag">📌 PINNED</span>
        )}
        <div className="note-actions">
          <button
            className={`na-btn pin${note.is_pinned ? " active-pin" : ""}`}
            onClick={() => togglePin(note.id)}
            title={note.is_pinned ? "Unpin" : "Pin to top"}
          >
            📌
          </button>
          <button
            className="na-btn"
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "🔽" : "▶️"}
          </button>
          <button
            className={`na-btn del${showConfirmDelete ? " active-pin" : ""}`}
            onClick={handleDelete}
            title={
              showConfirmDelete
                ? "Click again to confirm delete"
                : "Delete note"
            }
            style={
              showConfirmDelete
                ? { color: "var(--red)", borderColor: "var(--red)" }
                : {}
            }
          >
            {showConfirmDelete ? "⚠️ Confirm?" : "🗑️"}
          </button>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <>
          <div className="note-body">
            <MarkdownRenderer
              content={
                showFull ? note.content : note.content.slice(0, 800) + "..."
              }
            />
            {isLong && (
              <button
                onClick={() => setShowFull((v) => !v)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--link-color)",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontFamily: "inherit",
                  fontWeight: "700",
                  marginTop: "6px",
                  padding: 0,
                }}
              >
                {showFull ? "🔼 Show less" : "🔽 Show full note"}
              </button>
            )}
          </div>

          {/* Comments */}
          <div className="note-comments">
            <div className="comments-label">Annotations / Context</div>
            {note.comments && note.comments.length > 0 && (
              <div style={{ marginBottom: 5 }}>
                {note.comments.map((c) => (
                  <div key={c.id} className="comment-item">
                    <span className="comment-dot">💬</span>
                    <span className="comment-text">{c.content}</span>
                    <button
                      className="comment-del"
                      onClick={() => deleteComment(note.id, c.id)}
                      title="Remove annotation"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleComment} className="comment-form">
              <input
                className="ei comment-form .ei"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add annotation or context..."
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={!commentText.trim()}
                style={{ height: "24px", fontSize: "10px" }}
              >
                Add
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

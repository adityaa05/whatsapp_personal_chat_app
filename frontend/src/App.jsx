import React, { useEffect, useState, useCallback } from "react";
import Login from "./components/Login";
import NoteCard from "./components/Notecard";
import NoteInput from "./components/NoteList";
import { useStore } from "./store/useStore";

function HeaderClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  const d = `${pad(t.getDate())}/${pad(t.getMonth() + 1)}/${t.getFullYear()}`;
  const time = `${pad(t.getHours())}:${pad(t.getMinutes())}`;
  return (
    <span className="header-time">
      ⏱ {d} {time}
    </span>
  );
}

export default function App() {
  const {
    token,
    logout,
    notes,
    tags,
    isLoading,
    error,
    activeTag,
    setActiveTag,
    searchQuery,
    setSearchQuery,
    fetchNotes,
    fetchTags,
  } = useStore();

  const [searchDraft, setSearchDraft] = useState("");

  useEffect(() => {
    if (token) {
      fetchTags();
      fetchNotes();
    }
  }, [token]);

  // Debounced search
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchQuery(searchDraft);
    }, 350);
    return () => clearTimeout(id);
  }, [searchDraft]);

  useEffect(() => {
    if (token) fetchNotes();
  }, [searchQuery, activeTag]);

  if (!token) return <Login />;

  const pinnedCount = notes.filter((n) => n.is_pinned).length;

  return (
    <div id="shell">
      {/* HEADER */}
      <header id="header">
        <div className="header-brand">
          <div className="brand-logo">KB</div>
          <div className="brand-name">
            Knowledge<em>BASE</em>®
          </div>
        </div>

        <div className="header-center">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search notes..."
            value={searchDraft}
            onChange={(e) => {
              setSearchDraft(e.target.value);
              if (activeTag) setActiveTag(null);
            }}
          />
        </div>

        <div className="header-right">
          <span className="header-welcome">Welcome, administrator!</span>
          <HeaderClock />
          <button className="hbtn">?</button>
          <button className="hbtn danger" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* BODY */}
      <div id="body">
        {/* SIDEBAR */}
        <nav id="sidebar">
          <div className="sidebar-section-label">Navigation</div>

          <div
            className={`nav-item${!activeTag && !searchQuery ? " active" : ""}`}
            onClick={() => {
              setActiveTag(null);
              setSearchDraft("");
            }}
          >
            <span className="nav-icon">📋</span>
            All Notes
            <span className="nav-badge">{notes.length}</span>
          </div>

          {pinnedCount > 0 && (
            <div
              className={`nav-item${activeTag === "__pinned__" ? " active" : ""}`}
              onClick={() => {
                setSearchDraft("");
                setActiveTag(null);
                useStore.setState({ notes: notes.filter((n) => n.is_pinned) });
              }}
              style={{
                color: activeTag === "__pinned__" ? "white" : "#f5c842",
              }}
            >
              <span className="nav-icon">📌</span>
              Pinned
              <span className="nav-badge" style={{ background: "#c9860a" }}>
                {pinnedCount}
              </span>
            </div>
          )}

          {tags.length > 0 && (
            <>
              <div className="sidebar-section-label" style={{ marginTop: 6 }}>
                Tags
              </div>
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className={`nav-item${activeTag === tag.name ? " active" : ""}`}
                  onClick={() => {
                    setActiveTag(tag.name);
                    setSearchDraft("");
                  }}
                >
                  <span className="nav-icon" style={{ fontSize: "10px" }}>
                    #
                  </span>
                  <span className="truncate">{tag.name}</span>
                </div>
              ))}
            </>
          )}

          <div className="sidebar-spacer" />

          <div
            className="nav-item"
            onClick={logout}
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="nav-icon">🔓</span>
            Sign Out
          </div>
        </nav>

        {/* CONTENT */}
        <div id="content">
          {/* TOOLBAR */}
          <div id="toolbar">
            <span className="toolbar-title">My Notes</span>
            {(activeTag || searchQuery) && (
              <>
                <span className="toolbar-sep">/</span>
                <span className="toolbar-crumb">
                  {activeTag ? `#${activeTag}` : `Search: "${searchQuery}"`}
                </span>
              </>
            )}

            <div className="toolbar-right">
              <span className="record-count">
                {isLoading
                  ? "Loading..."
                  : `${notes.length} record${notes.length !== 1 ? "s" : ""}`}
              </span>
              {(activeTag || searchQuery) && (
                <button
                  className="tb-filter-btn"
                  onClick={() => {
                    setActiveTag(null);
                    setSearchDraft("");
                  }}
                >
                  ✕ Clear filter
                </button>
              )}
            </div>
          </div>

          {/* NOTE LIST */}
          <div id="note-scroll">
            {isLoading ? (
              <div className="state-box">
                <div className="state-icon">⏳</div>
                <div className="state-label">Loading records...</div>
              </div>
            ) : error ? (
              <div className="state-box">
                <div className="state-icon">⚠</div>
                <div className="state-label">Database Error</div>
                <div className="state-sub">{error}</div>
              </div>
            ) : notes.length === 0 ? (
              <div className="state-box">
                <div className="state-icon">📭</div>
                <div className="state-label">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "No notes yet"}
                </div>
                <div className="state-sub">
                  {searchQuery
                    ? "Try a different search term or clear the filter"
                    : "Use the input below to start adding notes. Paste anything — links, code, text, markdown."}
                </div>
              </div>
            ) : (
              notes.map((note, i) => (
                <NoteCard key={note.id} note={note} index={notes.length - i} />
              ))
            )}
          </div>

          {/* INPUT */}
          <NoteInput />
        </div>
      </div>

      {/* FOOTER */}
      <footer id="footer">
        <span className="footer-left">FastAPI + PostgreSQL + React</span>
        <span>Powered by KnowledgeBASE® v2.0</span>
      </footer>
    </div>
  );
}

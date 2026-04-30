import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import NoteCard from "./components/Notecard";
import NoteInput from "./components/Noteinput";
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
      {d} {time}
    </span>
  );
}

export default function App() {
  const {
    token,
    logout,
    notes,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    fetchNotes,
  } = useStore();
  
  const [searchDraft, setSearchDraft] = useState("");

  useEffect(() => {
    if (token) {
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
  }, [searchQuery]);

  if (!token) return <Login />;
  
  const pinnedCount = notes.filter((n) => n.is_pinned).length;

  return (
    <div id="shell">
      {/* HEADER */}
      <header id="header">
        <div className="header-brand">
          <div className="brand-logo">KB</div>
          <div className="brand-name">
            Knowledge<em>BASE</em>
          </div>
        </div>
        <div className="header-center">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search notes and annotations..."
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
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
            className={`nav-item${!searchQuery ? " active" : ""}`}
            onClick={() => setSearchDraft("")}
          >
            <span className="nav-icon">📄</span>
            All Notes
            <span className="nav-badge">{notes.length}</span>
          </div>
          {pinnedCount > 0 && (
            <div
              className="nav-item"
              onClick={() => {
                setSearchDraft("");
                useStore.setState({ notes: notes.filter((n) => n.is_pinned) });
              }}
            >
              <span className="nav-icon">📌</span>
              Pinned
              <span className="nav-badge" style={{ background: "#c9860a" }}>
                {pinnedCount}
              </span>
            </div>
          )}

          <div className="sidebar-spacer" />
          <div
            className="nav-item"
            onClick={logout}
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="nav-icon">🚪</span>
            Sign Out
          </div>
        </nav>

        {/* CONTENT */}
        <div id="content">
          {/* TOOLBAR */}
          <div id="toolbar">
            <span className="toolbar-title">My Notes</span>
            {searchQuery && (
              <>
                <span className="toolbar-sep">/</span>
                <span className="toolbar-crumb">
                  Search: "{searchQuery}"
                </span>
              </>
            )}
            <div className="toolbar-right">
              <span className="record-count">
                {isLoading
                  ? "Loading..."
                  : `${notes.length} record${notes.length !== 1 ? "s" : ""}`}
              </span>
              {searchQuery && (
                <button
                  className="tb-filter-btn"
                  onClick={() => setSearchDraft("")}
                >
                  ❌ Clear filter
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
                <div className="state-icon">❌</div>
                <div className="state-label">Database Error</div>
                <div className="state-sub">{error}</div>
              </div>
            ) : notes.length === 0 ? (
              <div className="state-box">
                <div className="state-icon">📝</div>
                <div className="state-label">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "No notes yet"}
                </div>
                <div className="state-sub">
                  {searchQuery
                    ? "Try a different search term or clear the filter"
                    : "Use the input below to start adding notes. Paste anything: links, code, text, markdown."}
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
        <span>Powered by KnowledgeBASE v2.0</span>
      </footer>
    </div>
  );
}
import React, { useEffect } from "react";
import NoteList from "./components/NoteList";
import ChatInput from "./components/ChatInput";
import Login from "./components/Login";
import { useStore } from "./store/useStore";

function App() {
  const { tags, activeTag, setActiveTag, fetchTags, token, logout } =
    useStore();

  // Only load tags if we are logged in
  useEffect(() => {
    if (token) fetchTags();
  }, [token, fetchTags]);

  // THE BOUNCER: If no token, show login screen
  if (!token) {
    return <Login />;
  }

  // If logged in, show the secure app
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-64 bg-slate-900 text-slate-300 p-4 hidden md:flex flex-col overflow-y-auto">
        <h1 className="text-xl font-bold text-white mb-6 tracking-tight">
          Knowledge Base
        </h1>

        <div className="text-sm space-y-2 flex-1">
          <p
            onClick={() => setActiveTag(null)}
            className={`cursor-pointer px-2 py-1.5 rounded-md transition-colors font-medium ${
              activeTag === null
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800 hover:text-white text-slate-400"
            }`}
          >
            # All Notes
          </p>

          <div className="my-4 border-b border-slate-700"></div>

          {tags.map((tag) => (
            <p
              key={tag.id}
              onClick={() => setActiveTag(tag.name)}
              className={`cursor-pointer px-2 py-1.5 rounded-md transition-colors ${
                activeTag === tag.name
                  ? "bg-slate-700 text-blue-400 font-medium"
                  : "hover:bg-slate-800 hover:text-white text-slate-400"
              }`}
            >
              # {tag.name}
            </p>
          ))}
        </div>

        {/* NEW: Logout Button */}
        <div className="pt-4 mt-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full text-left px-2 py-1.5 text-sm text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full max-w-5xl mx-auto border-x border-slate-200 bg-white shadow-sm w-full relative">
        <header className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            {activeTag ? `Filtering: #${activeTag}` : "My Scratchpad"}
          </h2>
        </header>

        <NoteList />
        <ChatInput />
      </div>
    </div>
  );
}

export default App;

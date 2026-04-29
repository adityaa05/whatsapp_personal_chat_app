import React from "react";
import NoteList from "./components/NoteList";
import ChatInput from "./components/ChatInput";

function App() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 p-4 hidden md:flex flex-col">
        <h1 className="text-xl font-bold text-white mb-6 tracking-tight">
          Knowledge Base
        </h1>
        <div className="text-sm space-y-3 flex-1">
          <p className="hover:text-white cursor-pointer transition-colors text-blue-400 font-medium">
            # All Notes
          </p>
          <p className="hover:text-white cursor-pointer transition-colors">
            # Code Snippets
          </p>
          <p className="hover:text-white cursor-pointer transition-colors">
            # Ideas
          </p>
        </div>
        <div className="text-xs text-slate-600 border-t border-slate-700 pt-4 mt-auto">
          PostgreSQL Connected
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full max-w-5xl mx-auto border-x border-slate-200 bg-white shadow-sm w-full">
        <header className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            My Scratchpad
          </h2>
        </header>

        {/* Real Dynamic Components */}
        <NoteList />
        <ChatInput />
      </div>
    </div>
  );
}

export default App;

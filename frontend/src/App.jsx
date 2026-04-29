import React from "react";

function App() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar / Left Column (For future tag filtering) */}
      <div className="w-64 bg-slate-900 text-slate-300 p-4 hidden md:block">
        <h1 className="text-xl font-bold text-white mb-6">Knowledge Base</h1>
        <div className="text-sm">
          <p className="mb-2 hover:text-white cursor-pointer"># All Notes</p>
          <p className="mb-2 hover:text-white cursor-pointer">
            # Code Snippets
          </p>
          <p className="mb-2 hover:text-white cursor-pointer"># Ideas</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto border-x border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            My Scratchpad
          </h2>
        </header>

        {/* Scrollable Notes Area (Placeholder) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-center text-slate-400 mt-10">
            Notes will appear here...
          </div>
        </div>

        {/* Input Area (Placeholder) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <textarea
            className="w-full w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            rows="3"
            placeholder="Paste your markdown or thoughts here..."
          ></textarea>
          <div className="flex justify-end mt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

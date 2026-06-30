import React from 'react';

export default function Dashboard({ children, activeSection, setActiveSection }) {
  const navItems = [
    { id: 'tasks', label: 'Task Board' },
    { id: 'goals', label: 'Goal Tracker' },
    { id: 'focus', label: 'Focus Timer' },
    { id: 'mood', label: 'Mood Board' },
  ];

  return (
    <div className="flex min-h-screen bg-[#0d0e12] text-[#e3e6eb] font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#14161d] border-r border-[#222531] p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-bold tracking-wider uppercase text-emerald-400">Cipher MVP</h1>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-[#1c1f2b] text-emerald-400 border-l-4 border-emerald-500 pl-3'
                    : 'text-gray-400 hover:bg-[#161822] hover:text-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="text-xs text-gray-600 px-2 border-t border-[#222531] pt-4">
          Local Persistence Active
        </div>
      </aside>

      {/* Main Container Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-5xl mx-auto w-full">
        <header className="mb-8 border-b border-[#222531] pb-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold capitalize tracking-wide text-gray-100">
            {activeSection === 'focus' ? '🎯 Focus Session' : `${activeSection} board`}
          </h2>
          <div className="text-xs bg-[#1c1f2b] text-gray-400 px-3 py-1.5 rounded border border-[#222531]">
            React-A2 MVP Framework
          </div>
        </header>
        <section className="animate-fadeIn">{children}</section>
      </main>
    </div>
  );
}
import React, { useState } from 'react';

export default function GoalTracker({ goals, setGoals }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const addGoal = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setGoals([...goals, { id: crypto.randomUUID(), title: title.trim(), targetDate: date, progress: 0 }]);
    setTitle('');
    setDate('');
  };

  const adjustProgress = (id, amount) => {
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, progress: Math.min(100, Math.max(0, g.progress + amount)) } : g
      )
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addGoal} className="bg-[#14161d] border border-[#222531] p-4 rounded-lg flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Goal tracking description..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#0d0e12] border border-[#222531] rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-[#0d0e12] border border-[#222531] rounded px-3 py-2 text-sm text-gray-400"
        />
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium">
          Create Goal
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-[#14161d] border border-[#222531] p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              {editingId === goal.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => {
                    setGoals(goals.map((g) => (g.id === goal.id ? { ...g, title: editTitle } : g)));
                    setEditingId(null);
                  }}
                  className="bg-[#1c1f2b] border border-emerald-500 rounded px-2 py-0.5 text-sm w-full"
                  autoFocus
                />
              ) : (
                <div>
                  <h4 onClick={() => { setEditingId(goal.id); setEditTitle(goal.title); }} className="text-sm font-medium hover:text-emerald-400 cursor-pointer">{goal.title}</h4>
                  {goal.targetDate && <p className="text-xs text-gray-500 mt-0.5">Target: {goal.targetDate}</p>}
                </div>
              )}
              <button onClick={() => setGoals(goals.filter((g) => g.id !== goal.id))} className="text-xs text-red-400 hover:text-red-300">Remove</button>
            </div>

            {/* Progress Visualization */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-[#0d0e12] h-2 rounded-full overflow-hidden border border-[#222531]">
                <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${goal.progress}%` }} />
              </div>
            </div>

            <div className="flex justify-end gap-1">
              <button onClick={() => adjustProgress(goal.id, -10)} className="bg-[#1c1f2b] px-2 py-1 rounded text-xs border border-[#222531] hover:text-white">-10%</button>
              <button onClick={() => adjustProgress(goal.id, -5)} className="bg-[#1c1f2b] px-2 py-1 rounded text-xs border border-[#222531] hover:text-white">-5%</button>
              <button onClick={() => adjustProgress(goal.id, 5)} className="bg-[#1c1f2b] px-2 py-1 rounded text-xs border border-[#222531] hover:text-white">+5%</button>
              <button onClick={() => adjustProgress(goal.id, 10)} className="bg-[#1c1f2b] px-2 py-1 rounded text-xs border border-[#222531] hover:text-white">+10%</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
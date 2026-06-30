import React from 'react';
import { useTimer } from '../hooks/useTimer';

export default function FocusTimer({ tasks, activeTaskId, setActiveTaskId }) {
  const { secondsRemaining, isRunning, start, pause, reset } = useTimer(1500);

  // Formatting minutes/seconds manually
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const selectedTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <div className="max-w-md mx-auto bg-[#14161d] border border-[#222531] rounded-2xl p-8 text-center space-y-6">
      {/* Relational Dropdown Component Selection */}
      <div className="space-y-2 text-left">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Link Session to Task</label>
        <select
          value={activeTaskId || ''}
          onChange={(e) => setActiveTaskId(e.target.value || null)}
          className="w-full bg-[#0d0e12] border border-[#222531] rounded-lg p-2.5 text-sm text-gray-300 focus:outline-none"
        >
          <option value="">No linked task (Generic Session)</option>
          {incompleteTasks.map((task) => (
            <option key={task.id} value={task.id}>{task.title}</option>
          ))}
        </select>
      </div>

      {selectedTask && (
        <div className="bg-[#1c1f2b] border border-emerald-500/20 text-emerald-400 text-sm py-2 px-4 rounded-lg inline-block animate-pulse">
          Focusing on: <strong className="text-white">{selectedTask.title}</strong>
        </div>
      )}

      {/* Primary Visual Ticker Text */}
      <div className="text-6xl font-mono tracking-tight font-bold text-gray-100 py-6 select-none">
        {formatTime(secondsRemaining)}
      </div>

      <div className="flex justify-center gap-3">
        {isRunning ? (
          <button onClick={pause} className="bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors w-28">
            Pause
          </button>
        ) : (
          <button onClick={start} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors w-28">
            Start
          </button>
        )}
        <button onClick={() => reset(1500)} className="bg-[#222531] border border-[#313547] text-gray-300 hover:text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors">
          Reset
        </button>
      </div>
    </div>
  );
}
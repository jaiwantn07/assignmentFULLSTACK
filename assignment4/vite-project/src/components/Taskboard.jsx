import React, { useState } from 'react';

// Pure computation function executing at render time
function groupTasks(tasks) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const groups = { overdue: [], today: [], upcoming: [], noDate: [], completed: [] };

  tasks.forEach((task) => {
    if (task.completed) {
      groups.completed.push(task);
      return;
    }
    if (!task.dueDate) {
      groups.noDate.push(task);
      return;
    }
    if (task.dueDate < todayStr) {
      groups.overdue.push(task);
    } else if (task.dueDate === todayStr) {
      groups.today.push(task);
    } else {
      groups.upcoming.push(task);
    }
  });

  return groups;
}

export default function TaskBoard({ tasks, setTasks, subtasks, setSubtasks }) {
  const [newTitle, setNewTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [activePickerId, setActivePickerId] = useState(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState({});
  const [fadingTasks, setFadingTasks] = useState({});

  const addTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask = { id: crypto.randomUUID(), title: newTitle.trim(), dueDate: '', completed: false };
    setTasks([newTask, ...tasks]);
    setNewTitle('');
  };

  const handleToggleComplete = (taskId) => {
    setFadingTasks((prev) => ({ ...prev, [taskId]: true }));
    setTimeout(() => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
      );
      setFadingTasks((prev) => {
        const copy = { ...prev };
        delete copy[taskId];
        return copy;
      });
    }, 400); // 400ms visual fade transition
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    setSubtasks(subtasks.filter((s) => s.parentId !== taskId)); // Cascade deletions
  };

  const updateDueDate = (taskId, dateStr) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, dueDate: dateStr } : t)));
    setActivePickerId(null);
  };

  const addSubtask = (taskId) => {
    const title = newSubtaskTitle[taskId]?.trim();
    if (!title) return;
    const newSub = { id: crypto.randomUUID(), parentId: taskId, title, completed: false };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle({ ...newSubtaskTitle, [taskId]: '' });
  };

  const grouped = groupTasks(tasks);

  return (
    <div className="space-y-8">
      {/* Quick Add Interface */}
      <form onSubmit={addTask} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Quick add task title..."
          className="flex-1 bg-[#14161d] border border-[#222531] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
        />
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
          Add Task
        </button>
      </form>

      {/* Render Lists */}
      {['overdue', 'today', 'upcoming', 'noDate', 'completed'].map((groupKey) => {
        if (grouped[groupKey].length === 0) return null;
        return (
          <div key={groupKey} className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-gray-500 capitalize">{groupKey}</h3>
            <div className="space-y-2">
              {grouped[groupKey].map((task) => {
                const taskSubs = subtasks.filter((s) => s.parentId === task.id);
                const compSubs = taskSubs.filter((s) => s.completed).length;
                const isFading = fadingTasks[task.id];

                return (
                  <div
                    key={task.id}
                    className={`bg-[#14161d] border border-[#222531] rounded-lg p-4 transition-all duration-400 ${
                      isFading ? 'opacity-0 scale-95' : 'opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleComplete(task.id)}
                          className="h-4 w-4 rounded border-gray-600 text-emerald-500 accent-emerald-500"
                        />
                        {editingTaskId === task.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => {
                              setTasks(tasks.map((t) => (t.id === task.id ? { ...t, title: editTitle } : t)));
                              setEditingTaskId(null);
                            }}
                            className="bg-[#1c1f2b] border border-emerald-500 rounded px-2 py-0.5 text-sm w-full"
                            autoFocus
                          />
                        ) : (
                          <span
                            onClick={() => { setEditingTaskId(task.id); setEditTitle(task.title); }}
                            className={`text-sm cursor-pointer hover:text-emerald-400 ${task.completed ? 'line-through text-gray-500' : ''}`}
                          >
                            {task.title}
                          </span>
                        )}
                      </div>

                      {/* Control Panel Actions */}
                      <div className="flex items-center gap-2 relative">
                        {taskSubs.length > 0 && (
                          <span className="text-xs bg-[#1c1f2b] px-2 py-0.5 rounded text-gray-400">
                            {compSubs}/{taskSubs.length}
                          </span>
                        )}
                        <button
                          onClick={() => setActivePickerId(activePickerId === task.id ? null : task.id)}
                          className="text-xs bg-[#1c1f2b] px-2 py-1 rounded border border-[#222531] hover:text-white"
                        >
                          📅 {task.dueDate || 'Set Date'}
                        </button>
                        {activePickerId === task.id && (
                          <div className="absolute top-8 right-0 bg-[#1c1f2b] border border-[#222531] rounded p-2 z-10 space-y-1 text-xs">
                            <button onClick={() => updateDueDate(task.id, new Date().toISOString().split('T')[0])} className="block w-full text-left p-1 hover:bg-[#222531]">Today</button>
                            <button onClick={() => {
                              const tom = new Date(); tom.setDate(tom.getDate() + 1);
                              updateDueDate(task.id, tom.toISOString().split('T')[0]);
                            }} className="block w-full text-left p-1 hover:bg-[#222531]">Tomorrow</button>
                            <input type="date" onChange={(e) => updateDueDate(task.id, e.target.value)} className="bg-[#14161d] p-1 rounded mt-1 text-white border border-[#222531]" />
                          </div>
                        )}
                        <button onClick={() => deleteTask(task.id)} className="text-xs text-red-400 hover:text-red-300 ml-2">Delete</button>
                      </div>
                    </div>

                    {/* Subtasks Relational List Array View */}
                    {!task.completed && (
                      <div className="mt-3 pl-7 space-y-1.5 border-l border-[#222531]">
                        {taskSubs.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={sub.completed}
                                onChange={() => setSubtasks(subtasks.map((s) => (s.id === sub.id ? { ...s, completed: !s.completed } : s)))}
                                className="h-3.5 w-3.5 accent-emerald-500"
                              />
                              <span className={sub.completed ? 'line-through text-gray-600' : ''}>{sub.title}</span>
                            </div>
                            <button onClick={() => setSubtasks(subtasks.filter((s) => s.id !== sub.id))} className="text-gray-600 hover:text-red-400">×</button>
                          </div>
                        ))}
                        <div className="flex gap-1 mt-2">
                          <input
                            type="text"
                            placeholder="Add subtask..."
                            value={newSubtaskTitle[task.id] || ''}
                            onChange={(e) => setNewSubtaskTitle({ ...newSubtaskTitle, [task.id]: e.target.value })}
                            className="bg-[#14161d] border border-[#222531] rounded px-2 py-1 text-xs flex-1 focus:outline-none"
                          />
                          <button onClick={() => addSubtask(task.id)} className="text-xs bg-[#222531] px-2 rounded hover:text-emerald-400">+</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
import React, { useState } from 'react';

export default function MoodBoard({ moodItems, setMoodItems }) {
  const [inputVal, setInputVal] = useState('');

  const addItem = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    let type = 'color';
    // Match URL image strings safely
    if (inputVal.startsWith('http://') || inputVal.startsWith('https://') || inputVal.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      type = 'image';
    }

    setMoodItems([...moodItems, { id: crypto.randomUUID(), type, value: inputVal.trim() }]);
    setInputVal('');
  };

  const removeItem = (id) => {
    setMoodItems(moodItems.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addItem} className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Paste a Hex Color (#e53e3e) or Image URL..."
          className="flex-1 bg-[#14161d] border border-[#222531] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
        />
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
          Add
        </button>
      </form>

      {/* Grid Canvas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {moodItems.map((item) => (
          <div
            key={item.id}
            onClick={() => removeItem(item.id)}
            className="aspect-square rounded-xl overflow-hidden border border-[#222531] cursor-pointer relative group transition-all transform hover:scale-[1.02] hover:border-red-500/50"
          >
            {item.type === 'color' ? (
              <div className="w-full h-full" style={{ backgroundColor: item.value }} />
            ) : (
              <img src={item.value} alt="Mood item" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs text-red-400 font-medium">Remove Element</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import GoalTracker from './components/GoalTracker';
import FocusTimer from './components/FocusTimer';
import MoodBoard from './components/MoodBoard';

export default function App() {
  const [activeSection, setActiveSection] = useLocalStorage('cipher_section', 'tasks');
  const [tasks, setTasks] = useLocalStorage('cipher_tasks', []);
  const [subtasks, setSubtasks] = useLocalStorage('cipher_subtasks', []);
  const [goals, setGoals] = useLocalStorage('cipher_goals', []);
  const [moodItems, setMoodItems] = useLocalStorage('cipher_mood', []);
  const [activeTaskId, setActiveTaskId] = useLocalStorage('cipher_active_task_id', null);

  const renderContent = () => {
    switch (activeSection) {
      case 'tasks':
        return (
          <TaskBoard 
            tasks={tasks} 
            setTasks={setTasks} 
            subtasks={subtasks} 
            setSubtasks={setSubtasks} 
          />
        );
      case 'goals':
        return <GoalTracker goals={goals} setGoals={setGoals} />;
      case 'focus':
        return (
          <FocusTimer 
            tasks={tasks} 
            activeTaskId={activeTaskId} 
            setActiveTaskId={setActiveTaskId} 
          />
        );
      case 'mood':
        return <MoodBoard moodItems={moodItems} setMoodItems={setMoodItems} />;
      default:
        return <div className="text-gray-400">Section not found</div>;
    }
  };

  return (
    <Dashboard activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderContent()}
    </Dashboard>
  );
}
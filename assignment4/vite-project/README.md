# Cipher MVP - Responsive Productivity Dashboard

Cipher MVP is a responsive, high-fidelity productivity dashboard framework built using the modern React ecosystem. The application provides localized, persistent modules to streamline personal organization, goal tracking, focus management, and daily reflection.

## 🚀 Features

- **Local Persistence Active:** Implements a dynamic data synchronization engine utilizing browser `localStorage`. All user tasks, goals, and logs automatically persist across page reloads and session closures.
- **Dynamic Navigation Layout:** A responsive sidebar interface built with React state-driven rendering, permitting instantaneous switching between application panels without triggering browser reloads.
- **Interactive Modules:**
  - **Tasks Board:** A fully dynamic task management board supporting immediate objective creation, tracking, and localized updates.
  - **Goal Tracker:** A dedicated system for logging and monitoring long-term milestones.
  - **Focus Timer:** An integrated deep-work management utility designed to control focused structural intervals.
  - **Mood Board:** A data log for recording daily mental metrics and reflections.

## 🛠️ Tech Stack

- **Frontend Library:** React (Functional components, custom hooks, and unified state management)
- **Build Tool & Dev Server:** Vite (Configured with Hot Module Replacement for optimized local building)
- **Styling Architecture:** Tailwind CSS v4 (Utility-first CSS compiler coupled with PostCSS processing for the specialized dark-theme system)

## 📊 Application State Architecture

The application manages global dashboard metrics via structured React states that mirror directly into storage. Below is the technical schema representing the structural shape of the data tracking system:

```text
Global Application State (App.jsx)
 ├── currentTab: "Task Board" | "Goal Tracker" | "Focus Timer" | "Mood Board"
 ├── tasks: Array<TaskItem>
 │    └── TaskItem: { id: string, title: string, completed: boolean, subtasks: Array<SubTask> }
 │         └── SubTask: { id: string, text: string, completed: boolean }
 ├── goals: Array<GoalItem>
 │    └── GoalItem: { id: string, target: string, category: string, deadline: string, achieved: boolean }
 └── moodItems: Array<MoodLog>
      └── MoodLog: { id: string, timestamp: string, score: number, reflection: string }

import React from 'react';
import SimplifiedPracticeArea from './pages/SimplifiedPracticeArea';

export default function PracticeAreaApp() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-blue-600 text-white py-3 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">CodeTutor AI</h1>
          <span className="bg-blue-700 text-xs px-2 py-1 rounded-full">Practice Area</span>
        </div>
      </header>
      
      <main className="flex-1 py-6">
        <SimplifiedPracticeArea />
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-800 py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>CodeTutor AI Practice Area &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
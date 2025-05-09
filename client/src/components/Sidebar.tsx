import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PROGRAMMING_LANGUAGES } from "@/lib/constants";

interface SidebarProps {
  userName?: string;
  userLevel?: string;
}

export default function Sidebar({ userName = "John Doe", userLevel = "Advanced Level" }: SidebarProps) {
  const [location] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<number[]>([2]); // Default expand Python

  const toggleCategory = (languageId: number) => {
    setExpandedCategories(prev => 
      prev.includes(languageId) 
        ? prev.filter(id => id !== languageId) 
        : [...prev, languageId]
    );
  };

  return (
    <aside className="bg-dark text-white w-64 flex-shrink-0 flex flex-col h-full overflow-y-auto hidden md:block">
      <div className="p-4 border-b border-gray-700 flex items-center gap-2">
        <i className="ri-code-box-line text-2xl text-primary"></i>
        <h1 className="text-xl font-bold">CodeTutor AI</h1>
      </div>
      
      {/* User Profile */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-700">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <span className="font-medium text-white">
            {userName.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-xs text-gray-400">{userLevel}</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="px-4 py-2">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Learning Paths</p>
        </div>
        
        {PROGRAMMING_LANGUAGES.map(language => (
          <div className="mb-2" key={language.id}>
            <button 
              className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
              onClick={() => toggleCategory(language.id)}
            >
              <div className="flex items-center gap-2">
                <i className={`${language.icon} text-[${language.color}]`} style={{ color: language.color }}></i>
                <span>{language.name}</span>
              </div>
              <i className={`ri-arrow-${expandedCategories.includes(language.id) ? 'down' : 'right'}-s-line`}></i>
            </button>
            
            {expandedCategories.includes(language.id) && (
              <div className="pl-10 pr-4 py-1">
                {language.id === 2 && ( // Python courses
                  <>
                    <Link href="/courses/3">
                      <a className={`block py-1 text-sm ${location === '/courses/3' ? 'text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>
                        Introduction
                      </a>
                    </Link>
                    <Link href="/courses/4">
                      <a className={`block py-1 text-sm ${location.startsWith('/courses/4') ? 'text-primary font-medium' : 'text-gray-300 hover:text-white'} transition-colors`}>
                        Data Science 
                        {location.startsWith('/courses/4') && <span className="bg-primary bg-opacity-20 text-xs px-1 rounded ml-1">Current</span>}
                      </a>
                    </Link>
                  </>
                )}
                {language.id === 1 && ( // JavaScript courses
                  <>
                    <Link href="/courses/1">
                      <a className={`block py-1 text-sm ${location === '/courses/1' ? 'text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>
                        Basics
                      </a>
                    </Link>
                    <Link href="/courses/2">
                      <a className={`block py-1 text-sm ${location === '/courses/2' ? 'text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>
                        Advanced
                      </a>
                    </Link>
                  </>
                )}
                {language.id !== 1 && language.id !== 2 && (
                  <Link href={`/languages/${language.id}`}>
                    <a className="block py-1 text-sm text-gray-300 hover:text-white transition-colors">
                      Coming Soon
                    </a>
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
        
        <div className="px-4 py-2 mt-4">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Activities</p>
        </div>
        
        <Link href="/practice">
          <a className={`flex items-center gap-2 px-4 py-2 ${location === '/practice' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition-colors`}>
            <i className="ri-terminal-line"></i>
            <span>Practice Area</span>
          </a>
        </Link>
        
        <Link href="/challenges">
          <a className={`flex items-center gap-2 px-4 py-2 ${location === '/challenges' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition-colors`}>
            <i className="ri-trophy-line"></i>
            <span>Challenges</span>
          </a>
        </Link>
        
        <Link href="/projects">
          <a className={`flex items-center gap-2 px-4 py-2 ${location === '/projects' ? 'bg-gray-700' : 'hover:bg-gray-700'} transition-colors`}>
            <i className="ri-book-open-line"></i>
            <span>My Projects</span>
          </a>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <Link href="/settings">
          <a className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <i className="ri-settings-3-line"></i>
            <span>Settings</span>
          </a>
        </Link>
        <Link href="/help">
          <a className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mt-2">
            <i className="ri-question-line"></i>
            <span>Help Center</span>
          </a>
        </Link>
      </div>
    </aside>
  );
}

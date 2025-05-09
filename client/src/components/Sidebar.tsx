import { Link, useLocation } from "wouter";
import { PROGRAMMING_LANGUAGES } from "@/lib/constants";

interface SidebarProps {
  userName?: string;
  userLevel?: string;
}

export default function Sidebar({ userName = "John Doe", userLevel = "Advanced Level" }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside className="bg-white w-64 flex-shrink-0 flex flex-col h-full overflow-y-auto hidden md:block shadow-md">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <i className="ri-code-box-line text-2xl text-primary"></i>
        <h1 className="text-xl font-bold text-gray-800">CodeTutor AI</h1>
      </div>
      
      {/* User Profile */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="font-medium text-white">
            {userName.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-800">{userName}</p>
          <p className="text-xs text-gray-500">{userLevel}</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="px-4 py-2">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Learning Paths</p>
        </div>
        
        {PROGRAMMING_LANGUAGES.map(language => (
          <div className="mb-4" key={language.id}>
            {/* Language Header (Always Visible) */}
            <div className="flex items-center px-4 py-2">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-3">
                <i className={language.icon} style={{ color: language.color }}></i>
              </div>
              <span className="font-bold text-blue-400">{language.name}</span>
            </div>
            
            {/* Course List (Always Visible) */}
            <div className="pl-10 pr-4 py-1">
              {language.id === 1 && ( // JavaScript courses
                <>
                  <Link href="/courses/1">
                    <a className={`block py-1.5 text-sm ${location === '/courses/1' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Fundamentals
                    </a>
                  </Link>
                  <Link href="/courses/2">
                    <a className={`block py-1.5 text-sm ${location === '/courses/2' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Advanced
                    </a>
                  </Link>
                  <Link href="/courses/10">
                    <a className={`block py-1.5 text-sm ${location === '/courses/10' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      DOM Manipulation
                    </a>
                  </Link>
                </>
              )}
              
              {language.id === 2 && ( // Python courses
                <>
                  <Link href="/courses/3">
                    <a className={`block py-1.5 text-sm ${location === '/courses/3' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Introduction
                    </a>
                  </Link>
                  <Link href="/courses/4">
                    <a className={`block py-1.5 text-sm ${location.startsWith('/courses/4') ? 'text-primary font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Data Science 
                      {location.startsWith('/courses/4') && <span className="bg-primary bg-opacity-20 text-xs px-1 rounded ml-1">Current</span>}
                    </a>
                  </Link>
                </>
              )}
              
              {language.id === 3 && ( // React courses
                <>
                  <Link href="/courses/5">
                    <a className={`block py-1.5 text-sm ${location === '/courses/5' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Fundamentals
                    </a>
                  </Link>
                  <Link href="/courses/6">
                    <a className={`block py-1.5 text-sm ${location === '/courses/6' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Advanced Patterns
                    </a>
                  </Link>
                  <Link href="/courses/11">
                    <a className={`block py-1.5 text-sm ${location === '/courses/11' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Hooks In Depth
                    </a>
                  </Link>
                </>
              )}
              
              {language.id === 4 && ( // SQL courses
                <>
                  <Link href="/courses/7">
                    <a className={`block py-1.5 text-sm ${location === '/courses/7' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Basics
                    </a>
                  </Link>
                  <Link href="/courses/8">
                    <a className={`block py-1.5 text-sm ${location === '/courses/8' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Advanced Techniques
                    </a>
                  </Link>
                </>
              )}
              
              {language.id === 5 && ( // HTML & CSS courses
                <>
                  <Link href="/courses/9">
                    <a className={`block py-1.5 text-sm ${location === '/courses/9' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Web Fundamentals
                    </a>
                  </Link>
                  <Link href="/courses/12">
                    <a className={`block py-1.5 text-sm ${location === '/courses/12' ? 'text-black font-medium' : 'text-gray-800 hover:text-black'} transition-colors`}>
                      Advanced CSS
                    </a>
                  </Link>
                </>
              )}
              
              {language.id !== 1 && language.id !== 2 && language.id !== 3 && language.id !== 4 && language.id !== 5 && (
                <div className="py-1.5 text-sm text-gray-600">
                  Coming Soon
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="px-4 py-2 mt-4">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Activities</p>
        </div>
        
        <Link href="/practice">
          <a className={`flex items-center gap-2 px-4 py-2 ${location === '/practice' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'} rounded transition-colors`}>
            <i className="ri-terminal-line text-blue-500"></i>
            <span>Practice Area</span>
          </a>
        </Link>
        
        <Link href="/challenges">
          <a className={`flex items-center gap-2 px-4 py-2 ${location === '/challenges' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'} rounded transition-colors mt-1`}>
            <i className="ri-trophy-line text-blue-500"></i>
            <span>Challenges</span>
          </a>
        </Link>
        
        <Link href="/projects">
          <a className={`flex items-center gap-2 px-4 py-2 ${location === '/projects' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'} rounded transition-colors mt-1`}>
            <i className="ri-book-open-line text-blue-500"></i>
            <span>My Projects</span>
          </a>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link href="/settings">
          <a className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <i className="ri-settings-3-line"></i>
            <span>Settings</span>
          </a>
        </Link>
        <Link href="/help">
          <a className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mt-2">
            <i className="ri-question-line"></i>
            <span>Help Center</span>
          </a>
        </Link>
      </div>
    </aside>
  );
}

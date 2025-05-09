import { Link, useLocation } from "wouter";
import { PROGRAMMING_LANGUAGES } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();

  return (
    <div 
      className={`fixed inset-0 bg-white z-20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2">
            <i className="ri-code-box-line text-2xl text-blue-500"></i>
            <h1 className="text-xl font-bold text-gray-800">CodeTutor AI</h1>
          </div>
          <button onClick={onClose} aria-label="Close menu" className="text-gray-600">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        {/* Mobile navigation menu */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="uppercase text-xs text-gray-400 font-semibold tracking-wider mb-2">Learning Paths</p>
          
          {PROGRAMMING_LANGUAGES.map(language => (
            <div key={language.id} className="mb-4">
              {/* Language Header */}
              <div className="flex items-center py-3 px-3">
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mr-3">
                  <i className={language.icon} style={{ color: language.color }}></i>
                </div>
                <span className="font-bold text-blue-400">{language.name}</span>
              </div>
              
              {/* Course List */}
              <div className="pl-12 pr-3 py-2">
                {language.id === 1 && ( // JavaScript courses
                  <>
                    <Link href="/courses/1">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Fundamentals
                      </a>
                    </Link>
                    <Link href="/courses/2">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Advanced
                      </a>
                    </Link>
                    <Link href="/courses/10">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        DOM Manipulation
                      </a>
                    </Link>
                  </>
                )}
                {language.id === 2 && ( // Python courses
                  <>
                    <Link href="/courses/3">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Introduction
                      </a>
                    </Link>
                    <Link href="/courses/4">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Data Science
                      </a>
                    </Link>
                  </>
                )}
                {language.id === 3 && ( // React courses
                  <>
                    <Link href="/courses/5">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Fundamentals
                      </a>
                    </Link>
                    <Link href="/courses/6">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Advanced Patterns
                      </a>
                    </Link>
                    <Link href="/courses/11">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Hooks In Depth
                      </a>
                    </Link>
                  </>
                )}
                {language.id === 4 && ( // SQL courses
                  <>
                    <Link href="/courses/7">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Basics
                      </a>
                    </Link>
                    <Link href="/courses/8">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Advanced Techniques
                      </a>
                    </Link>
                  </>
                )}
                {language.id === 5 && ( // HTML & CSS courses
                  <>
                    <Link href="/courses/9">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Web Fundamentals
                      </a>
                    </Link>
                    <Link href="/courses/12">
                      <a 
                        className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors"
                        onClick={onClose}
                      >
                        Advanced CSS
                      </a>
                    </Link>
                  </>
                )}
                {(language.id !== 1 && language.id !== 2 && language.id !== 3 && language.id !== 4 && language.id !== 5) && (
                  <span className="block py-2 text-sm text-gray-600">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))}
          
          <p className="uppercase text-xs text-gray-400 font-semibold tracking-wider mt-6 mb-2">Activities</p>
          
          <Link href="/practice">
            <a 
              className={`flex items-center gap-2 py-3 px-2 ${location === '/practice' ? 'bg-gray-800' : 'hover:bg-gray-800'} rounded transition-colors`}
              onClick={onClose}
            >
              <i className="ri-terminal-line"></i>
              <span>Practice Area</span>
            </a>
          </Link>
          
          <Link href="/challenges">
            <a 
              className={`flex items-center gap-2 py-3 px-2 ${location === '/challenges' ? 'bg-gray-800' : 'hover:bg-gray-800'} rounded transition-colors`}
              onClick={onClose}
            >
              <i className="ri-trophy-line"></i>
              <span>Challenges</span>
            </a>
          </Link>
          
          <Link href="/projects">
            <a 
              className={`flex items-center gap-2 py-3 px-2 ${location === '/projects' ? 'bg-gray-800' : 'hover:bg-gray-800'} rounded transition-colors`}
              onClick={onClose}
            >
              <i className="ri-book-open-line"></i>
              <span>My Projects</span>
            </a>
          </Link>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <Link href="/settings">
            <a 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors py-2"
              onClick={onClose}
            >
              <i className="ri-settings-3-line"></i>
              <span>Settings</span>
            </a>
          </Link>
          <Link href="/help">
            <a 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors py-2"
              onClick={onClose}
            >
              <i className="ri-question-line"></i>
              <span>Help Center</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

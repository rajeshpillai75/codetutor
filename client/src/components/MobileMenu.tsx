import { useLocation } from "wouter";
import { PROGRAMMING_LANGUAGES } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location, navigate] = useLocation();
  
  const navigateTo = (path: string) => {
    navigate(path);
    onClose();
  };

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
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/1')}
                    >
                      Fundamentals
                    </div>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/2')}
                    >
                      Advanced
                    </div>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/10')}
                    >
                      DOM Manipulation
                    </div>
                  </>
                )}
                {language.id === 2 && ( // Python courses
                  <>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/3')}
                    >
                      Introduction
                    </div>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/4')}
                    >
                      Data Science
                    </div>
                  </>
                )}
                {language.id === 3 && ( // React courses
                  <>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/5')}
                    >
                      Fundamentals
                    </div>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/6')}
                    >
                      Advanced Patterns
                    </div>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/11')}
                    >
                      Hooks In Depth
                    </div>
                  </>
                )}
                {language.id === 4 && ( // SQL courses
                  <>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/7')}
                    >
                      Basics
                    </div>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/8')}
                    >
                      Advanced Techniques
                    </div>
                  </>
                )}
                {language.id === 5 && ( // HTML & CSS courses
                  <>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/9')}
                    >
                      Web Fundamentals
                    </div>
                    <div 
                      className="block py-2 text-sm text-gray-800 hover:text-black font-medium transition-colors cursor-pointer"
                      onClick={() => navigateTo('/courses/12')}
                    >
                      Advanced CSS
                    </div>
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
          
          <div 
            className={`flex items-center gap-2 py-3 px-3 ${location === '/practice' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'} rounded transition-colors cursor-pointer`}
            onClick={() => navigateTo('/practice')}
          >
            <i className="ri-terminal-line text-blue-500"></i>
            <span className="text-gray-800">Practice Area</span>
          </div>
          
          <div 
            className={`flex items-center gap-2 py-3 px-3 ${location === '/challenges' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'} rounded transition-colors mt-2 cursor-pointer`}
            onClick={() => navigateTo('/challenges')}
          >
            <i className="ri-trophy-line text-blue-500"></i>
            <span className="text-gray-800">Challenges</span>
          </div>
          
          <div 
            className={`flex items-center gap-2 py-3 px-3 ${location === '/projects' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'} rounded transition-colors mt-2 cursor-pointer`}
            onClick={() => navigateTo('/projects')}
          >
            <i className="ri-book-open-line text-blue-500"></i>
            <span className="text-gray-800">My Projects</span>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors py-2 cursor-pointer"
            onClick={() => navigateTo('/settings')}
          >
            <i className="ri-settings-3-line"></i>
            <span>Settings</span>
          </div>
          <div 
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors py-2 cursor-pointer"
            onClick={() => navigateTo('/help')}
          >
            <i className="ri-question-line"></i>
            <span>Help Center</span>
          </div>
        </div>
      </div>
    </div>
  );
}
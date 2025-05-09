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
      className={`fixed inset-0 bg-dark bg-opacity-95 z-20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden`}
    >
      <div className="flex flex-col h-full text-white">
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">
            <i className="ri-code-box-line text-2xl text-primary"></i>
            <h1 className="text-xl font-bold">CodeTutor AI</h1>
          </div>
          <button onClick={onClose}>
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        {/* Mobile navigation menu */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="uppercase text-xs text-gray-400 font-semibold tracking-wider mb-2">Learning Paths</p>
          
          {PROGRAMMING_LANGUAGES.map(language => (
            <Link key={language.id} href={`/languages/${language.id}`}>
              <a 
                className={`flex items-center gap-2 py-3 px-2 ${location.includes(`/languages/${language.id}`) ? 'bg-gray-800 text-primary' : 'hover:bg-gray-800'} rounded transition-colors`}
                onClick={onClose}
              >
                <i className={`${language.icon}`} style={{ color: language.color }}></i>
                <span>{language.name}</span>
              </a>
            </Link>
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

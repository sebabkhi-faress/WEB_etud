import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className={`
        flex items-center gap-2 px-2 py-1 rounded-full transition-colors duration-200
        border border-[#E5E7EB] dark:border-[#334155]
        bg-[#E0F2FE] dark:bg-[#1E293B]
        text-[#2563EB] dark:text-[#F1F5F9]
        hover:bg-[#3B82F6] hover:text-white dark:hover:bg-[#3B82F6] dark:hover:text-white
        shadow-sm
      `}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="hidden md:inline font-medium">
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle; 
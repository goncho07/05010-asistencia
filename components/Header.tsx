
import React from 'react';
import { DoubleArrowLeftIcon, SunIcon, MoonIcon } from './icons/Icons';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="flex-shrink-0 h-20 flex items-center justify-between px-6 lg:px-10 bg-transparent">
            <div className="flex items-center">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/10 hover:text-sky-500 dark:hover:text-sky-400 transition-all"
                    aria-label="Toggle sidebar"
                >
                    <DoubleArrowLeftIcon className={`h-6 w-6 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} />
                </button>
            </div>
            
             <div className="flex items-center">
                 <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/10 hover:text-sun-500 dark:hover:text-sun-400 transition-all"
                    aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
                >
                    {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                </button>
            </div>
        </header>
    );
};
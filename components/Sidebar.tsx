
import React from 'react';
import { HomeIcon, UsersIcon, EnrollmentIcon, AcademicIcon, AttendanceIcon, QrCodeIcon, ChatIcon, ReportBarIcon, FolderIcon, FinanceIcon, SettingsIcon, HelpIcon } from './icons/Icons';
import type { View } from '../types';

interface SidebarProps {
    isOpen: boolean;
    activeView: View;
    setActiveView: (view: View) => void;
}

type NavItem = {
    name: View | string; // Use View type for main items
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    type: 'item';
}

type NavHeading = {
    name: string;
    type: 'heading';
}

const navItems: (NavItem | NavHeading)[] = [
    { name: 'Principal', type: 'heading' },
    { name: 'Inicio', icon: HomeIcon, type: 'item' },
    { name: 'Asistencia', icon: AttendanceIcon, type: 'item' },
    { name: 'Gestión', type: 'heading' },
    { name: 'Usuarios', icon: UsersIcon, type: 'item' },
    { name: 'Matrícula', icon: EnrollmentIcon, type: 'item' },
    { name: 'Académico', icon: AcademicIcon, type: 'item' },
    { name: 'Comunicaciones', icon: ChatIcon, type: 'item' },
    { name: 'Reportes', icon: ReportBarIcon, type: 'item' },
    { name: 'Recursos', icon: FolderIcon, type: 'item' },
    { name: 'Finanzas', icon: FinanceIcon, type: 'item' },
    { name: 'Sistema', type: 'heading' },
    { name: 'Scanner QR', icon: QrCodeIcon, type: 'item' },
    { name: 'Configuración', icon: SettingsIcon, type: 'item' },
    { name: 'Ayuda', icon: HelpIcon, type: 'item' },
];

const Logo: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="12" fill="url(#paint0_linear_1_2)"/>
        <path d="M12 30V15.75C12 13.679 13.679 12 15.75 12H20M12 30H20M12 30V24.375C12 22.304 13.679 20.625 15.75 20.625H20M20 12V30M20 12C20 10 21 10 22.5 10C24 10 25 10 25 12C25 14 24 14 22.5 14C21 14 20 14 20 12ZM28 17.625C28 15.554 26.321 13.875 24.25 13.875H20V27.375H24.25C26.321 27.375 28 25.696 28 23.625V17.625Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8"/>
                <stop offset="1" stopColor="#3b82f6"/>
            </linearGradient>
        </defs>
    </svg>
)

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, setActiveView }) => {
    
    const isNavigable = (name: string): name is View => {
        return ['Asistencia', 'Usuarios'].includes(name);
    }

    return (
        <aside className={`flex flex-col bg-white dark:bg-slate-900/95 backdrop-blur-sm text-slate-600 dark:text-slate-400 transition-width duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 ${isOpen ? 'w-80' : 'w-24'}`}>
            <div className="flex items-center h-20 border-b border-slate-200 dark:border-slate-800 px-6 flex-shrink-0">
                <Logo />
                {isOpen && (
                    <div className="ml-4 animate-fade-in whitespace-nowrap overflow-hidden">
                        <p className="font-bold text-slate-800 dark:text-white text-lg leading-tight">IEE 6049</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-tight">Ricardo Palma</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-6">
                <ul>
                    {navItems.map((item, index) => {
                        if (item.type === 'heading') {
                            return (
                                <li key={index} className={`px-6 mt-6 mb-2 ${isOpen ? 'animate-fade-in' : 'hidden'}`}>
                                    <span className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500">{item.name}</span>
                                </li>
                            );
                        }
                        
                        const isActive = item.name === activeView;
                        const isClickable = isNavigable(item.name);

                        return (
                            <li key={item.name} className="px-6 py-2">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // FIX: The type guard `isNavigable` must be called inside the event handler
                                        // for TypeScript to correctly narrow the type of `item.name`.
                                        // The previous implementation lost the type information because `isClickable`
                                        // was just a boolean within the closure.
                                        if (isNavigable(item.name)) {
                                            setActiveView(item.name);
                                        }
                                    }}
                                    aria-label={!isOpen ? item.name : undefined}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`flex items-center p-4 rounded-xl transition-colors duration-200 ${
                                        isActive 
                                        ? 'bg-primary-600 text-white font-bold shadow-lg shadow-primary-200 dark:shadow-lg dark:shadow-primary-600/20' 
                                        : isClickable ? 'hover:bg-slate-100 dark:hover:bg-slate-800' : 'opacity-50 cursor-not-allowed'
                                    } ${!isOpen ? 'justify-center' : ''}`}
                                >
                                    <item.icon className={`h-6 w-6 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                                    {isOpen && <span className="ml-4 font-semibold text-xl">{item.name}</span>}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

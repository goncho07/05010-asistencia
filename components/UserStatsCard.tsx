
import React from 'react';

interface UserStatsCardProps {
    title: string;
    count: number;
    icon: React.ReactElement;
    isActive: boolean;
    onClick: () => void;
}

export const UserStatsCard: React.FC<UserStatsCardProps> = ({ title, count, icon, isActive, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                isActive 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-800 hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:-translate-y-1'
            }`}
        >
            <div className={`flex items-center gap-3 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                {icon}
                <span className="font-bold text-base">{title}</span>
            </div>
            <p className={`mt-2 text-4xl font-extrabold ${isActive ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                {count.toLocaleString('es-PE')}
            </p>
        </button>
    );
};


import React from 'react';
import { Dropdown, DropdownItem } from './Dropdown';
import { MoreVerticalIcon, TrendingUpIcon, TrendingDownIcon } from './icons/Icons';
import type { TimeRange } from '../types';

interface KpiCardProps {
    title: string;
    value: number | string;
    previousValue?: number;
    timeRange: TimeRange;
    icon: React.ReactElement<{ className?: string }>;
    colorClass: string;
    delay?: string;
    unit?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, previousValue, timeRange, icon, colorClass, delay = '0ms', unit }) => {
    const cardId = `kpi-title-${title.replace(/\s+/g, '-').toLowerCase()}`;
    
    const hasComparison = typeof previousValue === 'number';
    let comparisonChange: number | null = null;
    let changeText = 'Sin cambios';
    let changeColor = 'text-slate-500 dark:text-slate-400';
    let ChangeIcon = null;

    if (hasComparison) {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        comparisonChange = numericValue - previousValue;
        if (comparisonChange > 0) {
            changeText = `+${comparisonChange} vs periodo anterior`;
            changeColor = 'text-grass-600 dark:text-grass-400';
            ChangeIcon = TrendingUpIcon;
        } else if (comparisonChange < 0) {
            changeText = `${comparisonChange} vs periodo anterior`;
            changeColor = 'text-rose-600 dark:text-rose-400';
            ChangeIcon = TrendingDownIcon;
        }
    }
    
    return (
        <div 
            className="relative bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-5 transition-transform duration-300 hover:-translate-y-1 animate-pop-in ring-1 ring-black/5 dark:ring-white/10 flex flex-col justify-between h-[150px]"
            style={{ animationDelay: delay }}
            role="region"
            aria-labelledby={cardId}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-700/50 ${colorClass}`}>
                       {React.cloneElement(icon, { className: "h-6 w-6" })}
                    </div>
                    <p id={cardId} className="text-lg font-bold text-slate-700 dark:text-slate-200">{title}</p>
                </div>
                 <Dropdown
                    align="right"
                    trigger={
                        <button aria-label={`Acciones para ${title}`} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <MoreVerticalIcon className="h-5 w-5" />
                        </button>
                    }
                 >
                    <DropdownItem onSelect={() => console.log('Ver detalle de', title)}>Ver detalle</DropdownItem>
                    <DropdownItem onSelect={() => console.log('Tooltip para', title)}>¿Cómo se calcula?</DropdownItem>
                 </Dropdown>
            </div>
            
            <div className="mt-2">
                <p className="text-5xl font-extrabold text-slate-800 dark:text-white">
                    {value}
                    {unit && <span className="text-3xl ml-1 font-semibold text-slate-500 dark:text-slate-400">{unit}</span>}
                </p>
                {hasComparison && ChangeIcon && (
                    <div className={`flex items-center gap-1 text-sm font-semibold mt-1 ${changeColor}`}>
                        <ChangeIcon className="h-4 w-4" />
                        <span>{changeText}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

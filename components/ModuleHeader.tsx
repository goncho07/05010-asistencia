
import React, { useState, useEffect } from 'react';
import { ChevronRightIcon } from './icons/Icons';

interface ModuleHeaderProps {
    onGenerateReport: () => void;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({ onGenerateReport }) => {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        setCurrentDate(new Intl.DateTimeFormat('es-PE', options).format(now));
    }, []);

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 animate-pop-in">
            {/* Left side: Breadcrumb and Title */}
            <div>
                <nav className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                    <a href="#" className="hover:text-primary-500">Inicio</a>
                    <ChevronRightIcon className="h-4 w-4 mx-1 flex-shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-white">Asistencia</span>
                </nav>
                <div className="flex items-baseline gap-3 mt-1">
                     <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Panel de Asistencia</h1>
                     <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-grass-500 animate-pulse"></div>
                        <p className="text-sm font-medium">Datos actualizados: {currentDate}</p>
                     </div>
                </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-2">
                 <button 
                    onClick={onGenerateReport}
                    className="text-base font-bold text-white bg-primary-600 px-5 py-2.5 rounded-lg shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    accessKey='r'
                >
                    Generar Reporte
                 </button>
            </div>
        </div>
    );
};
import React, { useEffect } from 'react';
import type { Alert } from '../types';
import { XIcon, AlertTriangleIcon, UsersIcon, MailIcon, CheckCircleIcon } from './icons/Icons';

interface AlertDetailDrawerProps {
    alert: Alert | null;
    isOpen: boolean;
    onClose: () => void;
}

const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({ alert, isOpen, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    
    const animationClass = isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right';

    if (!alert) return null;

    return (
        <div 
            className={`fixed inset-0 z-40 ${isOpen ? 'visible' : 'invisible'}`}
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col ${animationClass}`} aria-labelledby="alert-drawer-title">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <AlertTriangleIcon className={`h-6 w-6 ${alert.severity === 'error' ? 'text-rose-500' : 'text-sun-500'}`} />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Detalle de Alerta</h2>
                    </div>
                     <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <XIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <h3 id="alert-drawer-title" className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{alert.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">{alert.description}</p>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                            <p className="font-bold text-slate-700 dark:text-slate-200">Contexto</p>
                            <p className="text-slate-500 dark:text-slate-400">{alert.details?.context || 'No disponible'}</p>
                        </div>
                        
                        {alert.details?.students && alert.details.students.length > 0 && (
                            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                                <p className="font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><UsersIcon className="h-5 w-5" />Estudiantes Involucrados</p>
                                <ul className="space-y-2">
                                    {alert.details.students.map(student => (
                                        <li key={student.id} className="text-slate-500 dark:text-slate-400">
                                            <span className="font-semibold text-slate-600 dark:text-slate-300">{student.name}:</span> {student.reason}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-3">
                     <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-base font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-md">
                        <MailIcon className="h-5 w-5" />
                        Contactar / Notificar
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-base font-bold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                       <CheckCircleIcon className="h-5 w-5" />
                       Registrar Seguimiento
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDetailDrawer;
import React from 'react';
import type { Alert } from '../types';
import { AlertTriangleIcon, InfoIcon, MoreVerticalIcon, CheckCircleIcon, ArchiveIcon } from './icons/Icons';
import { Dropdown, DropdownItem } from './Dropdown';

interface AlertsProps {
    alerts: Alert[];
    onAlertClick: (alert: Alert) => void;
}

const severityConfig = {
    error: { icon: <AlertTriangleIcon className="h-5 w-5 text-rose-500" />, ring: 'ring-rose-500/20' },
    warning: { icon: <AlertTriangleIcon className="h-5 w-5 text-sun-500" />, ring: 'ring-sun-500/20' },
    info: { icon: <InfoIcon className="h-5 w-5 text-sky-500" />, ring: 'ring-sky-500/20' },
}

export const Alerts: React.FC<AlertsProps> = ({ alerts, onAlertClick }) => {
    return (
        <div className="h-full w-full bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 ring-1 ring-black/5 dark:ring-white/10 animate-pop-in flex flex-col" style={{ animationDelay: '300ms'}}>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex-shrink-0">Alertas de Asistencia</h3>
            
            {alerts && alerts.length > 0 ? (
                <ul className="space-y-3 overflow-y-auto flex-grow -mr-2 pr-2">
                    {alerts.map(alert => (
                        <li key={alert.id} className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ring-1 ring-inset ring-slate-200 dark:ring-slate-700">
                            <div className={`mt-1 flex-shrink-0 p-1 rounded-full bg-white dark:bg-slate-700 ring-4 ${severityConfig[alert.severity].ring}`}>
                                {severityConfig[alert.severity].icon}
                            </div>
                            <div className="ml-3 flex-grow">
                                <p className="text-base font-bold text-slate-800 dark:text-slate-200">{alert.title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{alert.description}</p>
                                <div className="flex items-center justify-between mt-2">
                                     <p className="text-xs text-slate-400 dark:text-slate-500">{alert.timestamp}</p>
                                     <button onClick={() => onAlertClick(alert)} className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                                        Ver detalle
                                    </button>
                                </div>
                            </div>
                             <Dropdown
                                align="right"
                                trigger={
                                    <button aria-label={`Acciones para la alerta: ${alert.title}`} className="p-1 -mr-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors flex-shrink-0">
                                        <MoreVerticalIcon className="h-4 w-4" />
                                    </button>
                                }
                             >
                                <DropdownItem onSelect={() => onAlertClick(alert)}><CheckCircleIcon className="h-4 w-4 mr-2" />Marcar como revisada</DropdownItem>
                                <DropdownItem onSelect={() => console.log('Archivar', alert.id)}><ArchiveIcon className="h-4 w-4 mr-2" />Archivar alerta</DropdownItem>
                             </Dropdown>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                    <div className="p-4 bg-grass-100 dark:bg-grass-500/20 rounded-full">
                        <CheckCircleIcon className="h-10 w-10 text-grass-500" />
                    </div>
                    <p className="mt-4 font-bold text-slate-700 dark:text-slate-200">Todo en orden</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">No hay alertas esta semana. ¡Buen trabajo!</p>
                </div>
            )}
        </div>
    );
}
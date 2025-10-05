
import React, { useState, useEffect } from 'react';
import { XIcon, FileTextIcon, DownloadIcon } from './icons/Icons';
import type { Level, TimeRange, PopulationFocus } from '../types';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        level: Level;
        timeRange: TimeRange;
        populationFocus: PopulationFocus;
        grade: string;
        section: string;
    }
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, filters }) => {
    const [format, setFormat] = useState<'PDF' | 'XLSX'>('PDF');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleGenerate = () => {
        setIsGenerating(true);
        console.log('Generating report with filters:', filters, 'and format:', format);
        setTimeout(() => {
            setIsGenerating(false);
            onClose();
            // Here you would trigger a download and show a success toast/snackbar
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" style={{ animationDuration: '200ms' }}>
            <div 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4 animate-pop-in ring-1 dark:ring-slate-700" 
                style={{ animationDuration: '300ms' }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="report-modal-title"
            >
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <FileTextIcon className="h-6 w-6 text-primary-500" />
                        <h2 id="report-modal-title" className="text-xl font-bold text-slate-800 dark:text-white">Generar Reporte de Asistencia</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <XIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-slate-600 dark:text-slate-300 mb-4">Se generará un reporte con los filtros actualmente seleccionados. Puedes cambiar el formato de salida a continuación.</p>
                    
                    <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg text-sm mb-6 space-y-1">
                        <p><span className="font-semibold inline-block w-20">Población:</span> {filters.populationFocus}</p>
                        <p><span className="font-semibold inline-block w-20">Periodo:</span> {filters.timeRange}</p>
                        <p><span className="font-semibold inline-block w-20">Nivel:</span> {filters.level}</p>
                        <p><span className="font-semibold inline-block w-20">Grado:</span> {filters.grade === 'all' ? 'Todos' : filters.grade}</p>
                        <p><span className="font-semibold inline-block w-20">Sección:</span> {filters.section === 'all' ? 'Todas' : filters.section}</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-base font-bold text-slate-700 dark:text-slate-200 mb-2">Formato de Salida</label>
                        <div className="flex gap-2">
                             {(['PDF', 'XLSX'] as const).map(f => (
                                <button 
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={`w-full p-3 rounded-lg text-left font-bold border-2 transition-all ${format === f ? 'bg-primary-50 dark:bg-primary-500/20 border-primary-500 text-primary-600 dark:text-primary-300' : 'bg-transparent border-slate-200 dark:border-slate-600 hover:border-primary-400'}`}
                                >
                                    {f}
                                </button>
                             ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-700 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-base font-bold text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center justify-center gap-2 w-40 px-4 py-2 text-base font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-md disabled:bg-primary-400 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Generando...
                            </>
                        ) : (
                            <>
                                <DownloadIcon className="h-5 w-5"/>
                                Generar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;

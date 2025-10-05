
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { XIcon, DownloadIcon } from './icons/Icons';
import { IdCard } from './IdCard';
import { getFilteredUsers } from '../hooks/useUserData';
import type { User, Level, UserTypeFilter } from '../types';

interface CardGenerationFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const gradesAndSections = {
    Inicial: {
        '3 AÑOS': ['Margaritas', 'Crisantemos'],
        '4 AÑOS': ['Jasminez', 'Rosas', 'Lirios', 'Geranios'],
        '5 AÑOS': ['Orquideas', 'Tulipanes', 'Girasoles', 'Claveles'],
    },
    Primaria: { '1°': ['A', 'B', 'C'], '2°': ['A', 'B', 'C'], '3°': ['A', 'B', 'C'], '4°': ['A', 'B', 'C', 'D'], '5°': ['A', 'B', 'C'], '6°': ['A', 'B', 'C'] },
    Secundaria: { '1°': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], '2°': ['A', 'B', 'C', 'D', 'E', 'F', 'G'], '3°': ['A', 'B', 'C', 'D', 'E', 'F', 'G'], '4°': ['A', 'B', 'C', 'D', 'E', 'F'], '5°': ['A', 'B', 'C', 'D', 'E', 'F'] }
};

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className={`w-full px-4 py-2 text-base font-bold bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 rounded-lg border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${props.className}`} />
);

const chunk = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const generateCardsPdf = async (users: User[], onProgress: (p: number) => void): Promise<void> => {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    document.body.appendChild(tempContainer);
    
    const root = ReactDOM.createRoot(tempContainer);
    
    const CARDS_PER_PAGE = 10;
    const userChunks = chunk(users, CARDS_PER_PAGE);
    const totalPages = userChunks.length * 2; // Front and back
    let pagesProcessed = 0;

    const renderPage = async (pageUsers: User[], side: 'front' | 'back') => {
        const PageLayout = ({ users, side }: { users: User[], side: 'front' | 'back' }) => (
            <div style={{ width: '297mm', height: '210mm', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '5mm', padding: '10mm', backgroundColor: 'white' }}>
                {users.map(user => <IdCard key={`${user.id}-${side}`} user={user} side={side} />)}
            </div>
        );
        
        await new Promise<void>(resolve => {
            root.render(<PageLayout users={pageUsers} side={side} />);
            setTimeout(resolve, 50);
        });
        
        const canvas = await html2canvas(tempContainer.children[0] as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        return imgData;
    };
    
    for (let i = 0; i < userChunks.length; i++) {
        const imgData = await renderPage(userChunks[i], 'front');
        if (i > 0) pdf.addPage('a4', 'landscape');
        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
        pagesProcessed++;
        onProgress(pagesProcessed / totalPages);
    }
    
    for (let i = 0; i < userChunks.length; i++) {
        const chunk = userChunks[i];
        const mirroredChunk = [...chunk];
        const row1 = mirroredChunk.slice(0, 5).reverse();
        const row2 = mirroredChunk.slice(5, 10).reverse();
        const finalMirroredChunk = [...row1, ...row2];

        const imgData = await renderPage(finalMirroredChunk, 'back');
        pdf.addPage('a4', 'landscape');
        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
        pagesProcessed++;
        onProgress(pagesProcessed / totalPages);
    }
    
    root.unmount();
    document.body.removeChild(tempContainer);
    pdf.save('carnets-generados.pdf');
};


const CardGenerationFilterModal: React.FC<CardGenerationFilterModalProps> = ({ isOpen, onClose }) => {
    const [userType, setUserType] = useState<UserTypeFilter>('Estudiantes');
    const [level, setLevel] = useState<Level>('Todos');
    const [grade, setGrade] = useState('all');
    const [section, setSection] = useState('all');
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setUserType('Estudiantes');
            setLevel('Todos');
            setGrade('all');
            setSection('all');
            setIsGenerating(false);
            setProgress(0);
        }
    }, [isOpen]);

    const handleUserTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUserType(e.target.value as UserTypeFilter);
        setLevel('Todos');
        setGrade('all');
        setSection('all');
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLevel(e.target.value as Level);
        setGrade('all');
        setSection('all');
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGrade(e.target.value);
        setSection('all');
    };
    
    const handleGenerate = async () => {
        setIsGenerating(true);
        setProgress(0);
        const usersToPrint = getFilteredUsers({ userType, level, grade, section });
        if (usersToPrint.length === 0) {
            alert('No se encontraron usuarios con los filtros seleccionados.');
            setIsGenerating(false);
            return;
        }
        await generateCardsPdf(usersToPrint, setProgress);
        setIsGenerating(false);
        onClose();
    };

    if (!isOpen) return null;

    const areStudentFiltersDisabled = userType === 'Docentes';
    const currentGrades = (!areStudentFiltersDisabled && level !== 'Todos') ? gradesAndSections[level as 'Inicial'|'Primaria'|'Secundaria'] : {};
    const currentSections = (!areStudentFiltersDisabled && grade !== 'all') ? currentGrades[grade as keyof typeof currentGrades] || [] : [];
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" style={{ animationDuration: '200ms' }}>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4 animate-pop-in ring-1 dark:ring-slate-700" role="dialog" aria-modal="true" aria-labelledby="card-filter-modal-title">
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 id="card-filter-modal-title" className="text-xl font-bold text-slate-800 dark:text-white">Generar Carnets en PDF</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><XIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" /></button>
                </div>
                
                <div className="p-6 space-y-4">
                    <p className="text-slate-600 dark:text-slate-300">Seleccione los filtros para generar los carnets. Se exportará un PDF optimizado para impresión A4 a doble cara.</p>
                    
                    <div>
                        <label className="font-bold text-slate-700 dark:text-slate-200">Tipo de Usuario</label>
                        <Select value={userType} onChange={handleUserTypeChange}>
                           <option value="Estudiantes">Estudiantes</option>
                           <option value="Docentes">Docentes</option>
                           <option value="Todos">Todos (Estudiantes y Docentes)</option>
                        </Select>
                    </div>
                    <div>
                        <label className="font-bold text-slate-700 dark:text-slate-200">Nivel</label>
                        <Select value={level} onChange={handleLevelChange} disabled={areStudentFiltersDisabled}>
                            <option value="Todos">Todos los Niveles</option>
                            {(['Inicial', 'Primaria', 'Secundaria'] as const).map(lvl => (
                                <option key={lvl} value={lvl}>{lvl}</option>
                             ))}
                        </Select>
                    </div>
                     <div>
                        <label className="font-bold text-slate-700 dark:text-slate-200">Grado</label>
                        <Select value={grade} onChange={handleGradeChange} disabled={areStudentFiltersDisabled || level === 'Todos'}>
                            <option value="all">Todos los Grados</option>
                            {Object.keys(currentGrades).map(g => <option key={g} value={g}>{g}</option>)}
                        </Select>
                    </div>
                     <div>
                        <label className="font-bold text-slate-700 dark:text-slate-200">Sección</label>
                        <Select value={section} onChange={(e) => setSection(e.target.value)} disabled={areStudentFiltersDisabled || level === 'Todos' || grade === 'all'}>
                            <option value="all">Todas las Secciones</option>
                            {currentSections.map(s => <option key={s} value={s}>{s}</option>)}
                        </Select>
                    </div>
                     {isGenerating && (
                        <div className="pt-2">
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Generando PDF... {Math.round(progress * 100)}%</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${progress * 100}%`, transition: 'width 0.2s' }}></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-700 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-base font-bold text-slate-700 dark:text-slate-200 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancelar</button>
                    <button onClick={handleGenerate} disabled={isGenerating} className="flex items-center justify-center gap-2 w-48 px-4 py-2 text-base font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-md disabled:bg-primary-400 disabled:cursor-not-allowed">
                        {isGenerating ? 'Generando...' : <><DownloadIcon className="h-5 w-5"/> Exportar PDF</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardGenerationFilterModal;
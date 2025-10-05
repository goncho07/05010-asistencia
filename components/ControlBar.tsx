
import React from 'react';
import type { Level, TimeRange, PopulationFocus } from '../types';

interface ControlBarProps {
    level: Level;
    setLevel: (l: Level) => void;
    grade: string;
    setGrade: (g: string) => void;
    section: string;
    setSection: (s: string) => void;
    timeRange: TimeRange;
    setTimeRange: (t: TimeRange) => void;
    populationFocus: PopulationFocus;
    setPopulationFocus: (p: PopulationFocus) => void;
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

const SegmentedButton: React.FC<{
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    label: string;
}> = ({ options, selected, onSelect, label }) => (
    <div role="group" aria-label={label} className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-700/60 rounded-lg">
        {options.map(opt => (
            <button
                key={opt}
                onClick={() => onSelect(opt)}
                aria-pressed={selected === opt}
                className={`px-4 py-2 rounded-md text-base font-bold transition-all duration-200 whitespace-nowrap ${
                    selected === opt 
                        ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-white shadow-sm' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                }`}
            >
                {opt}
            </button>
        ))}
    </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className={`px-4 py-2 text-base font-bold bg-slate-200/80 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 rounded-lg border-none focus:ring-2 focus:ring-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${props.className}`} />
);

export const ControlBar: React.FC<ControlBarProps> = ({ level, setLevel, grade, setGrade, section, setSection, timeRange, setTimeRange, populationFocus, setPopulationFocus }) => {
    
    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setGrade(e.target.value);
        setSection('all'); // Reset section when grade changes
    };

    const currentGrades = (level === 'Inicial' || level === 'Primaria' || level === 'Secundaria') ? gradesAndSections[level] : {};
    const currentSections = grade !== 'all' ? currentGrades[grade as keyof typeof currentGrades] || [] : [];
    
    return (
        <div className="w-full bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 ring-1 ring-black/5 dark:ring-white/10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 animate-pop-in" style={{ animationDelay: '100ms' }}>
            
            <div className="flex items-center gap-4 flex-wrap">
                <SegmentedButton 
                    label="Seleccionar población"
                    options={['Estudiantes', 'Docentes']} 
                    selected={populationFocus} 
                    onSelect={(val) => setPopulationFocus(val as PopulationFocus)}
                />
                 <SegmentedButton 
                    label="Seleccionar período de tiempo"
                    options={['Hoy', 'Semana', 'Mes', 'Bimestre']} 
                    selected={timeRange} 
                    onSelect={(val) => setTimeRange(val as TimeRange)}
                />
            </div>

            <div className="flex items-center gap-2">
                <Select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as Level)}
                    aria-label="Seleccionar nivel educativo"
                >
                     {(['Todos', 'Inicial', 'Primaria', 'Secundaria'] as Level[]).map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                     ))}
                </Select>
                <Select
                    value={grade}
                    onChange={handleGradeChange}
                    aria-label="Seleccionar grado"
                    disabled={level === 'Todos'}
                >
                    <option value="all">Todos los Grados</option>
                    {Object.keys(currentGrades).map(g => <option key={g} value={g}>{g}</option>)}
                </Select>
                <Select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    aria-label="Seleccionar sección"
                    disabled={grade === 'all' || level === 'Todos'}
                >
                    <option value="all">Todas las Secciones</option>
                    {currentSections.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
            </div>
        </div>
    );
};
import { useState, useEffect } from 'react';
import type { Level, TimeRange, MockData, AttendanceBreakdown, TrendDataPoint, Alert, PopulationFocus } from '../types';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateAttendanceBreakdown = (basePopulation: number): AttendanceBreakdown => {
    const unjustified = random(0, Math.floor(basePopulation * 0.05));
    const tardiness = random(1, Math.floor(basePopulation * 0.1));
    const attended = basePopulation - unjustified - tardiness;
    const percentage = parseFloat(((attended / basePopulation) * 100).toFixed(1));
    
    const unjustifiedPrev = Math.max(0, unjustified + random(-5, 5));
    const tardinessPrev = Math.max(0, tardiness + random(-5, 5));
    const attendedPrev = basePopulation - unjustifiedPrev - tardinessPrev;
    const percentagePrev = parseFloat(((attendedPrev / basePopulation) * 100).toFixed(1));

    return { attended, tardiness, unjustified, percentage, attendedPrev, tardinessPrev, unjustifiedPrev, percentagePrev };
};

const generateTrendData = (timeRange: TimeRange): TrendDataPoint[] => {
    const now = new Date();
    
    const generatePoint = (): Omit<TrendDataPoint, 'name' | 'isCurrent'> => ({
        Asistencia: random(85, 99),
        // Simular porcentajes de tardanzas y faltas, ej. 0% a 8%
        Tardanzas: parseFloat((random(0, 80) / 10).toFixed(1)),
        Faltas: parseFloat((random(0, 50) / 10).toFixed(1)),
    });

    switch (timeRange) {
        case 'Hoy': {
            const dayName = now.toLocaleDateString('es-ES', { weekday: 'long' });
            const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            return [{ name: `Hoy`, ...generatePoint() }];
        }
        case 'Semana': {
            const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
            return weekDays.map(name => ({ name, ...generatePoint() }));
        }
        case 'Mes': {
            return ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'].map(name => ({ name, ...generatePoint() }));
        }
        case 'Bimestre': {
            const currentMonth = now.getMonth(); // 0-11
            // Simple quarters for demo: Jan-Mar, Apr-Jun, Jul-Sep, Oct-Dec
            const currentBimesterIndex = Math.floor(currentMonth / 3);
            const bimesters = ['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4'];
            return bimesters.map((name, index) => ({
                name,
                ...generatePoint(),
                isCurrent: index === currentBimesterIndex,
            }));
        }
        default:
            return [];
    }
};

const generateAlerts = (): Alert[] => {
    return [
        { id: '1', title: 'Asistencia Crítica: 5to B', description: 'La sección tiene una asistencia por debajo del umbral del 80% esta semana.', severity: 'error', timestamp: 'hace 2 horas', details: { context: 'Sección 5to Grado B, Turno Mañana, Semana del 20-24 de Mayo', students: [{id: 's1', name: 'Ana García', reason: 'Falta injustificada (3 días)'}, {id: 's2', name: 'Luis Torres', reason: 'Tardanza recurrente'}] } },
        { id: '2', title: 'Tardanzas recurrentes: J. Perez', description: 'El docente Juan Perez ha acumulado 3 tardanzas esta semana.', severity: 'warning', timestamp: 'ayer' },
        { id: '3', title: 'Reporte Mensual Disponible', description: 'El reporte consolidado del mes anterior ya puede ser generado.', severity: 'info', timestamp: 'hace 3 días' },
        { id: '4', title: 'Asistencia Baja: 2do A', description: 'La sección ha mostrado una baja en asistencia del 10% vs la semana pasada.', severity: 'warning', timestamp: 'hace 4 días' },
    ]
}


const generateMockData = ({ level, timeRange, population }: { level: Level, timeRange: TimeRange, population: PopulationFocus }): MockData => {
    let studentBase: number;
    let teacherBase: number;

    const studentTotals = {
        Inicial: 286,
        Primaria: 740,
        Secundaria: 655
    };

    const teacherTotals = {
        Inicial: 17,
        Primaria: 52,
        Secundaria: 43
    };

    switch (level) {
        case 'Todos':
            studentBase = studentTotals.Inicial + studentTotals.Primaria + studentTotals.Secundaria; // 1681
            teacherBase = teacherTotals.Inicial + teacherTotals.Primaria + teacherTotals.Secundaria;   // 112
            break;
        case 'Inicial':
            studentBase = studentTotals.Inicial;
            teacherBase = teacherTotals.Inicial;
            break;
        case 'Primaria':
            studentBase = studentTotals.Primaria;
            teacherBase = teacherTotals.Primaria;
            break;
        case 'Secundaria':
            studentBase = studentTotals.Secundaria;
            teacherBase = teacherTotals.Secundaria;
            break;
        default:
            studentBase = 0;
            teacherBase = 0;
    }
    
    const studentAttendance = generateAttendanceBreakdown(studentBase);
    const teacherAttendance = generateAttendanceBreakdown(teacherBase);
    const trendData = generateTrendData(timeRange);
    const alerts = generateAlerts();
    
    return { studentAttendance, teacherAttendance, trendData, alerts };
};


export const useMockData = ({ level, timeRange, population }: { level: Level, timeRange: TimeRange, population: PopulationFocus }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<MockData>(() => generateMockData({ level, timeRange, population }));

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setData(generateMockData({ level, timeRange, population }));
            setLoading(false);
        }, 500); // Simulate network delay
        return () => clearTimeout(timer);
    }, [level, timeRange, population]);

    return { data, loading };
};
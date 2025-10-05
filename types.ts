
export type Level = 'Todos' | 'Inicial' | 'Primaria' | 'Secundaria';
export type TimeRange = 'Hoy' | 'Semana' | 'Mes' | 'Bimestre';
export type PopulationFocus = 'Estudiantes' | 'Docentes';
export type View = 'Asistencia' | 'Usuarios';

export interface AttendanceBreakdown {
    attended: number;
    tardiness: number;
    unjustified: number;
    percentage: number;
    attendedPrev: number;
    tardinessPrev: number;
    unjustifiedPrev: number;
    percentagePrev: number;
}

export interface TrendDataPoint {
    name: string;
    Asistencia: number; // Percentage
    Tardanzas: number;  // Percentage
    Faltas: number;     // Percentage
    isCurrent?: boolean;
}

export type AlertSeverity = 'error' | 'warning' | 'info';

export interface Alert {
    id: string;
    title: string;
    description: string;
    severity: AlertSeverity;
    timestamp: string;
    details?: {
        context: string;
        students: { id: string, name: string, reason: string }[];
    }
}

export interface MockData {
    studentAttendance: AttendanceBreakdown;
    teacherAttendance: AttendanceBreakdown;
    trendData: TrendDataPoint[];
    alerts: Alert[];
}

export interface ReportOptions {
    format: 'PDF' | 'XLSX';
    scope: 'general' | 'level' | 'section';
    includeSignatures: boolean;
}

// User Management Types
export type UserRole = 'Estudiante' | 'Docente' | 'Administrativo' | 'Apoderado';
export type UserTypeFilter = 'Todos' | 'Estudiantes' | 'Docentes';

export interface User {
    id: string;
    name: string;
    avatarInitials: string;
    avatarColor: string; // Tailwind color class e.g., 'bg-sky-500'
    role: UserRole;
    area: string; // e.g., 'Inicial', 'Primaria'
    etapa: string; // e.g., 'MARGARITAS_3AÑOS'
}

export interface UserStats {
    todos: number;
    administrativos: number;
    docentes: number;
    estudiantes: number;
    apoderados: number;
}

export interface IdCardProps {
    user: User;
    side: 'front' | 'back';
}
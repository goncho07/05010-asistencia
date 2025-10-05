
import { useState, useEffect, useMemo } from 'react';
import type { User, UserStats, UserRole, Level, UserTypeFilter } from '../types';

const names = ['Lara Mabel', 'Thiago Gohan', 'Luciana Margot', 'Ayra Mickeyla', 'Alessia Sarai', 'Lian Antuan', 'Lara Georgina', 'Juan', 'Maria', 'Pedro', 'Ana', 'Luis', 'Sofia', 'Carlos', 'Valeria', 'Diego', 'Camila', 'Javier'];
const surnames = ['Andres Alvarez', 'Aures Ccañihua', 'Avalos Aguif', 'Bazalar Colla', 'Cerdan Perez', 'Chale', 'Carbaj', 'Gomez', 'Rodriguez', 'Perez', 'Garcia', 'Martinez', 'Lopez', 'Sanchez', 'Romero', 'Suarez', 'Torres', 'Diaz'];
const roles: UserRole[] = ['Estudiante', 'Docente'];
const areas = ['Inicial', 'Primaria', 'Secundaria'];
const etapas = ['MARGARITAS_3AÑOS', '1A', '2B', '3C', '4D', '5E'];
const colors = ['bg-sky-500', 'bg-grass-500', 'bg-sun-500', 'bg-rose-500', 'bg-indigo-500', 'bg-pink-500', 'bg-purple-500'];

const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateUser = (id: number): User => {
    const name = `${randomItem(names)} ${randomItem(surnames)}`;
    const role = randomItem(roles);
    const area = role === 'Docente' ? 'Docencia' : randomItem(areas);
    return {
        id: `user-${id}`,
        name: name.toUpperCase(),
        avatarInitials: name.split(' ').slice(0, 2).map(n => n[0]).join(''),
        avatarColor: randomItem(colors),
        role: role,
        area: area,
        etapa: randomItem(etapas),
    };
};

const USER_COUNT = 1799;
const allUsers: User[] = Array.from({ length: USER_COUNT }, (_, i) => generateUser(i + 1));

const userStats: UserStats = {
    todos: 1799,
    administrativos: 6,
    docentes: 112,
    estudiantes: 1681,
    apoderados: 0,
};

export const getSampleUsersForCards = (): User[] => {
    return [
        { id: 'card-1', name: 'ANA SOFIA ROJAS VERA', avatarInitials: 'AR', avatarColor: 'bg-sun-500', role: 'Estudiante', area: 'Inicial', etapa: 'MARGARITAS_3AÑOS'},
        { id: 'card-2', name: 'CARLOS ANDRES GOMEZ PAZ', avatarInitials: 'CG', avatarColor: 'bg-sky-500', role: 'Estudiante', area: 'Primaria', etapa: '4TO GRADO "A"'},
        { id: 'card-3', name: 'VALERIA ISABEL DIAZ LUNA', avatarInitials: 'VD', avatarColor: 'bg-grass-500', role: 'Estudiante', area: 'Secundaria', etapa: '3ER AÑO "B"'},
        { id: 'card-4', name: 'JUAN CARLOS PEREZ RODRIGUEZ', avatarInitials: 'JP', avatarColor: 'bg-slate-500', role: 'Docente', area: 'Ciencias', etapa: 'Secundaria'},
    ];
};

export const useUserData = ({ page, limit }: { page: number; limit: number; }) => {
    const [loading, setLoading] = useState(true);

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return allUsers.slice(start, end);
    }, [page, limit]);

    const totalPages = useMemo(() => Math.ceil(USER_COUNT / limit), [limit]);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300); // Simulate network delay
        return () => clearTimeout(timer);
    }, [page, limit]);

    return { 
        users: paginatedUsers, 
        stats: userStats, 
        totalPages, 
        loading 
    };
};

export const getFilteredUsers = (filters: { userType: UserTypeFilter, level: Level, grade: string, section: string }): User[] => {
    const { userType, level } = filters;

    let baseUsers: User[];

    // Step 1: Filter by User Type
    if (userType === 'Estudiantes') {
        baseUsers = allUsers.filter(user => user.role === 'Estudiante');
    } else if (userType === 'Docentes') {
        // For docentes, level/grade/section filters do not apply, so we can return early.
        return allUsers.filter(user => user.role === 'Docente').slice(0, 100);
    } else { // 'Todos'
        baseUsers = allUsers;
    }

    // Step 2: Filter by Level (applies to 'Estudiantes' and 'Todos')
    if (level === 'Todos') {
        return baseUsers.slice(0, 100); // No further level filtering needed
    }

    // If a specific level is chosen
    const filteredUsers = baseUsers.filter(user => {
        // Keep all docentes if 'Todos' (by user type) is selected
        if (userType === 'Todos' && user.role === 'Docente') {
            return true;
        }
        // Filter students by area/level
        if (user.role === 'Estudiante') {
            return user.area === level;
        }
        // Exclude docentes if a specific level is chosen for 'Todos' user type
        return false;
    });
    
    // In a real app, grade and section would be filtered here
    
    return filteredUsers.slice(0, 100);
};

import React, { useState } from 'react';
import { useUserData } from '../hooks/useUserData';
import { ChevronRightIcon, UserCogIcon, UsersIcon, ShieldIcon, GraduationCapIcon, StudentIcon, DownloadIcon, UploadCloudIcon, PlusIcon, EyeIcon, ArrowUpDownIcon } from './icons/Icons';
import { UserStatsCard } from './UserStatsCard';
import { Pagination } from './Pagination';
import type { User } from '../types';

const USERS_PER_PAGE = 7;

interface UserManagementProps {
    onGenerateCards: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onGenerateCards }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState('Todos');
    const { users, stats, totalPages, loading } = useUserData({ page: currentPage, limit: USERS_PER_PAGE });

    const handlePageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const statCards = [
        { title: 'Todos', count: stats.todos, icon: <UsersIcon className="h-6 w-6" />, id: 'Todos' },
        { title: 'Administrativos', count: stats.administrativos, icon: <ShieldIcon className="h-6 w-6" />, id: 'Administrativos' },
        { title: 'Docentes', count: stats.docentes, icon: <GraduationCapIcon className="h-6 w-6" />, id: 'Docentes' },
        { title: 'Estudiantes', count: stats.estudiantes, icon: <StudentIcon className="h-6 w-6" />, id: 'Estudiantes' },
        { title: 'Apoderados', count: stats.apoderados, icon: <UsersIcon className="h-6 w-6" />, id: 'Apoderados' },
    ];

    const TableRowSkeleton = () => (
        <tr className="border-b border-slate-200 dark:border-slate-800">
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                    <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                </div>
            </td>
            <td className="p-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div></td>
            <td className="p-4"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div></td>
            <td className="p-4"><div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div></td>
            <td className="p-4"><div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-full"></div></td>
        </tr>
    );

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col gap-6 animate-fade-in-up p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div>
                <nav className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                    <a href="#" className="hover:text-primary-500">Inicio</a>
                    <ChevronRightIcon className="h-4 w-4 mx-1 flex-shrink-0" />
                    <span className="font-semibold text-slate-700 dark:text-white">Usuarios</span>
                </nav>
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-4">
                        <UserCogIcon className="h-10 w-10 text-slate-500 dark:text-slate-400"/>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Gestión de Usuarios</h1>
                            <p className="text-slate-500 dark:text-slate-400">Administre los perfiles de estudiantes, docentes, personal administrativo y apoderados.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={onGenerateCards}
                            className="flex items-center gap-2 px-4 py-2 text-base font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            <DownloadIcon className="h-5 w-5"/> Generar Carnets
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-base font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                            <UploadCloudIcon className="h-5 w-5"/> Importar
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-base font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition">
                            <PlusIcon className="h-5 w-5"/> Crear Usuario
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {statCards.map(card => (
                    <UserStatsCard 
                        key={card.id}
                        title={card.title}
                        count={card.count}
                        icon={card.icon}
                        isActive={activeFilter === card.id}
                        onClick={() => setActiveFilter(card.id)}
                    />
                ))}
            </div>

            {/* Users Table */}
            <div className="flex-1 bg-white dark:bg-slate-900/50 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left text-base">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                {['Nombre', 'Rol', 'Área/Sección', 'Etapa', 'Acciones'].map(header => (
                                    <th key={header} className="p-4 font-bold text-slate-600 dark:text-slate-300 uppercase text-sm tracking-wider">
                                        <div className="flex items-center gap-1">
                                            {header}
                                            {header !== 'Acciones' && <ArrowUpDownIcon className="h-4 w-4 text-slate-400" />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                           {loading ? (
                                Array.from({ length: USERS_PER_PAGE }).map((_, i) => <TableRowSkeleton key={i} />)
                           ) : (
                                users.map((user: User) => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                                                    {user.avatarInitials}
                                                </div>
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-500 dark:text-slate-400">{user.role}</td>
                                        <td className="p-4 text-slate-500 dark:text-slate-400">{user.area}</td>
                                        <td className="p-4 text-slate-500 dark:text-slate-400">{user.etapa}</td>
                                        <td className="p-4">
                                            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition">
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                           )}
                        </tbody>
                    </table>
                </div>
                 {/* Pagination */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
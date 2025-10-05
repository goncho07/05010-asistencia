
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (direction: 'prev' | 'next') => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    
    const Button: React.FC<{
        onClick: () => void;
        disabled: boolean;
        children: React.ReactNode;
    }> = ({ onClick, disabled, children }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 text-base font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {children}
        </button>
    );

    return (
        <div className="flex items-center justify-between">
            <Button onClick={() => onPageChange('prev')} disabled={currentPage === 1}>
                <ChevronLeftIcon className="h-5 w-5" />
                Anterior
            </Button>
            <span className="text-base font-semibold text-slate-600 dark:text-slate-400">
                Página {currentPage} de {totalPages}
            </span>
            <Button onClick={() => onPageChange('next')} disabled={currentPage === totalPages}>
                Siguiente
                <ChevronRightIcon className="h-5 w-5" />
            </Button>
        </div>
    );
};

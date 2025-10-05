import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse ${className}`} />
    );
};

export const KpiCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 h-[128px] ring-1 ring-black/5 dark:ring-white/10 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-4 w-4 rounded-full" />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-40" />
            </div>
        </div>
    );
};

export default Skeleton;

import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KpiCard } from './components/KpiCard';
import { useMockData } from './hooks/useMockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { TimeRange, Level, PopulationFocus, Alert, View } from './types';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from './components/icons/Icons';
import { ModuleHeader } from './components/ModuleHeader';
import { ControlBar } from './components/ControlBar';
import { Alerts } from './components/Alerts';
import { KpiCardSkeleton } from './components/skeletons/Skeleton';

const AttendanceTrendChart = lazy(() => import('./components/AttendanceTrendChart'));
const ReportModal = lazy(() => import('./components/ReportModal'));
const AlertDetailDrawer = lazy(() => import('./components/AlertDetailDrawer'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const CardGenerationFilterModal = lazy(() => import('./components/IdCardModal'));


const App: React.FC = () => {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('asistencia_theme', 'dark');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeView, setActiveView] = useState<View>('Asistencia');
    
    // Filter state with localStorage persistence
    const [level, setLevel] = useLocalStorage<Level>('asistencia_level', 'Todos');
    const [grade, setGrade] = useState('all');
    const [section, setSection] = useState('all');
    const [timeRange, setTimeRange] = useLocalStorage<TimeRange>('asistencia_timeRange', 'Semana');
    const [populationFocus, setPopulationFocus] = useLocalStorage<PopulationFocus>('asistencia_population', 'Estudiantes');
    
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [isCardFilterModalOpen, setCardFilterModalOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const { data, loading } = useMockData({ level, timeRange, population: populationFocus });

    const levelSchedules = {
        Inicial: { entrada: '7:30am - 8:00am', salida: '12:00pm' },
        Primaria: { entrada: '7:30am - 8:00am', salida: '13:00pm' },
        Secundaria: { entrada: '7:30am - 8:00am', salida: '15:30pm' }
    };
    
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);
    
    useEffect(() => {
        setGrade('all');
        setSection('all');
    }, [level]);

    const kpis = useMemo(() => {
        const attendanceData = populationFocus === 'Estudiantes'
            ? data.studentAttendance
            : data.teacherAttendance;

        return [
            { id: 'attended', title: "Asistencias", value: attendanceData.attended, previousValue: attendanceData.attendedPrev, icon: <CheckCircleIcon />, colorClass: "text-grass-400"},
            { id: 'tardiness', title: "Tardanzas", value: attendanceData.tardiness, previousValue: attendanceData.tardinessPrev, icon: <ClockIcon />, colorClass: "text-sun-400"},
            { id: 'unjustified', title: "Faltas Injustificadas", value: attendanceData.unjustified, previousValue: attendanceData.unjustifiedPrev, icon: <XCircleIcon />, colorClass: "text-rose-400"},
        ];
    }, [data, populationFocus]);

    const renderContent = () => {
        switch (activeView) {
            case 'Usuarios':
                return (
                    <Suspense fallback={<div className="h-full w-full p-8"><div className="w-full h-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div></div>}>
                        <UserManagement onGenerateCards={() => setCardFilterModalOpen(true)} />
                    </Suspense>
                );
            case 'Asistencia':
            default:
                return (
                    <div className="max-w-7xl mx-auto h-full flex flex-col gap-6 animate-fade-in-up p-4 md:p-6 lg:p-8">
                        <ModuleHeader onGenerateReport={() => setReportModalOpen(true)} />
                        
                        <ControlBar 
                            level={level}
                            setLevel={setLevel}
                            grade={grade}
                            setGrade={setGrade}
                            section={section}
                            setSection={setSection}
                            timeRange={timeRange}
                            setTimeRange={setTimeRange}
                            populationFocus={populationFocus}
                            setPopulationFocus={setPopulationFocus}
                        />

                        {level !== 'Todos' && (
                            <div className="bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-lg flex items-center gap-3 text-sm font-semibold animate-pop-in ring-1 ring-sky-200 dark:ring-sky-500/30" style={{ animationDelay: '200ms'}}>
                                <ClockIcon className="h-5 w-5 flex-shrink-0" />
                                <span>Horario de {level}: Entrada <span className="font-bold">{levelSchedules[level].entrada}</span> | Salida <span className="font-bold">{levelSchedules[level].salida}</span>. Se considera tardanza después de las 8:00am.</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                           {loading ? (
                                Array.from({ length: 3 }).map((_, i) => <KpiCardSkeleton key={i} />)
                           ) : (
                               kpis.map((kpi, index) => (
                                    <KpiCard 
                                        key={kpi.id}
                                        title={kpi.title}
                                        value={kpi.value}
                                        icon={kpi.icon}
                                        colorClass={kpi.colorClass}
                                        delay={`${200 + index * 100}ms`}
                                        previousValue={kpi.previousValue}
                                        timeRange={timeRange}
                                    />
                                ))
                           )}
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                            <div className="lg:col-span-8 min-h-[300px] lg:min-h-0">
                                <Suspense fallback={<div className="h-full w-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>}>
                                    <AttendanceTrendChart 
                                        data={data.trendData}
                                        timeRange={timeRange}
                                    />
                                </Suspense>
                            </div>
                            <div className="lg:col-span-4 min-h-[300px] lg:min-h-0">
                                <Alerts alerts={data.alerts} onAlertClick={setSelectedAlert} />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen w-full font-sans bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950 text-slate-700 dark:text-slate-300 overflow-hidden">
            <Sidebar 
                isOpen={sidebarOpen} 
                activeView={activeView}
                setActiveView={setActiveView}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    sidebarOpen={sidebarOpen} 
                    setSidebarOpen={setSidebarOpen} 
                    theme={theme}
                    setTheme={setTheme}
                />

                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
            
            <Suspense>
                {isReportModalOpen && (
                    <ReportModal 
                        isOpen={isReportModalOpen}
                        onClose={() => setReportModalOpen(false)}
                        filters={{ level, timeRange, populationFocus, grade, section }}
                    />
                )}
                {selectedAlert && (
                     <AlertDetailDrawer
                        alert={selectedAlert}
                        isOpen={!!selectedAlert}
                        onClose={() => setSelectedAlert(null)}
                     />
                )}
                {isCardFilterModalOpen && (
                    <CardGenerationFilterModal
                        isOpen={isCardFilterModalOpen}
                        onClose={() => setCardFilterModalOpen(false)}
                    />
                )}
            </Suspense>

        </div>
    );
};

export default App;
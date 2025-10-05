import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { TrendDataPoint, TimeRange } from '../types';

interface AttendanceTrendChartProps {
    data: TrendDataPoint[];
    timeRange: TimeRange;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 text-sm shadow-xl">
          <p className="label font-bold text-slate-800 dark:text-white mb-2">{`${label}`}</p>
          {payload.map((p: any) => (
             <p key={p.dataKey} style={{ color: p.fill }} className="font-semibold flex items-center">
                <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: p.fill }}></span>
                {`${p.name}: ${p.value}${p.unit || ''}`}
             </p>
          ))}
        </div>
      );
    }
    return null;
};

type SeriesKey = 'Asistencia' | 'Tardanzas' | 'Faltas';

const getChartTitle = (timeRange: TimeRange): string => {
    const now = new Date();
    const prefix = "Tendencia de Asistencia: ";

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    switch (timeRange) {
        case 'Hoy': {
            const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(now);
            return prefix + capitalize(formattedDate);
        }
        case 'Semana': {
            const dayOfWeek = now.getDay(); 
            const startOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            const startDate = new Date(now);
            startDate.setDate(now.getDate() + startOffset);
            
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 4);

            const startDay = startDate.getDate();
            const endDay = endDate.getDate();
            const year = startDate.getFullYear();
            
            if (startDate.getMonth() !== endDate.getMonth()) {
                 const startMonth = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(startDate);
                 const endMonth = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(endDate);
                 return `${prefix}Semana del ${startDay} de ${capitalize(startMonth)} al ${endDay} de ${capitalize(endMonth)}, ${year}`;
            }
            const month = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(startDate);
            return `${prefix}Semana del ${startDay} al ${endDay} de ${capitalize(month)}, ${year}`;
        }
        case 'Mes': {
            const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
            const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(now);
            return prefix + capitalize(formattedDate);
        }
        case 'Bimestre':
            return prefix + 'Bimestres';
        default:
            return prefix.slice(0, -2);
    }
};

const AttendanceTrendChart: React.FC<AttendanceTrendChartProps> = ({ data, timeRange }) => {
    const isDark = document.documentElement.classList.contains('dark');
    const [visibleSeries, setVisibleSeries] = useState<Record<SeriesKey, boolean>>({
        Asistencia: true,
        Tardanzas: true,
        Faltas: true,
    });

    const axisColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';
    
    const colors = {
      Asistencia: { normal: "#22c55e", highlight: "#4ade80" },
      Tardanzas:  { normal: "#f59e0b", highlight: "#fbbf24" },
      Faltas:    { normal: "#f43f5e", highlight: "#fb7185" },
    };
    
    const chartTitle = getChartTitle(timeRange);

    const toggleSeries = (seriesName: SeriesKey) => {
        setVisibleSeries(prev => ({ ...prev, [seriesName]: !prev[seriesName] }));
    };

    const LegendButton = ({ name, color, isVisible, onClick }: { name: string, color: string, isVisible: boolean, onClick: () => void }) => (
        <button
            onClick={onClick}
            aria-pressed={isVisible}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                isVisible ? 'text-white shadow' : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            style={{ backgroundColor: isVisible ? color : undefined }}
        >
            <span 
                className="w-2.5 h-2.5 rounded-full transition-all" 
                style={{ backgroundColor: color, opacity: isVisible ? 1 : 0.5 }}
            ></span>
            {name}
        </button>
    );

    const renderChart = () => (
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.5} />
            <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} dy={10} />
            <YAxis yAxisId="left" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} unit="%" domain={[60, 100]} />
            <YAxis yAxisId="right" orientation="right" stroke={axisColor} fontSize={12} tickLine={false} axisLine={false} unit="%" domain={[0, 15]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)'}} />
            
            {visibleSeries.Asistencia && (
                <Bar yAxisId="left" dataKey="Asistencia" name="Asistencia (%)" unit="%" isAnimationActive={false}>
                  {data.map((entry, index) => (
                      <Cell key={`cell-asistencia-${index}`} fill={entry.isCurrent ? colors.Asistencia.highlight : colors.Asistencia.normal} />
                  ))}
                </Bar>
            )}
            {visibleSeries.Tardanzas && (
                <Bar yAxisId="right" dataKey="Tardanzas" name="Tardanzas (%)" unit="%" isAnimationActive={false}>
                  {data.map((entry, index) => (
                      <Cell key={`cell-tardanzas-${index}`} fill={entry.isCurrent ? colors.Tardanzas.highlight : colors.Tardanzas.normal} />
                  ))}
                </Bar>
            )}
            {visibleSeries.Faltas && (
                <Bar yAxisId="right" dataKey="Faltas" name="Faltas (%)" unit="%" isAnimationActive={false}>
                   {data.map((entry, index) => (
                      <Cell key={`cell-faltas-${index}`} fill={entry.isCurrent ? colors.Faltas.highlight : colors.Faltas.normal} />
                  ))}
                </Bar>
            )}
        </BarChart>
    );

    return (
        <div className="h-full w-full bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 ring-1 ring-black/5 dark:ring-white/10 flex flex-col" style={{ animationDelay: '500ms'}}>
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{chartTitle}</h3>
                <div className="flex items-center gap-2">
                    <LegendButton name="Asistencia (%)" color={colors.Asistencia.normal} isVisible={visibleSeries.Asistencia} onClick={() => toggleSeries('Asistencia')} />
                    <LegendButton name="Tardanzas (%)" color={colors.Tardanzas.normal} isVisible={visibleSeries.Tardanzas} onClick={() => toggleSeries('Tardanzas')} />
                    <LegendButton name="Faltas (%)" color={colors.Faltas.normal} isVisible={visibleSeries.Faltas} onClick={() => toggleSeries('Faltas')} />
                </div>
            </div>
            <div className="flex-grow min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AttendanceTrendChart;
import React from 'react';
import type { User, IdCardProps } from '../types';
import { CameraIcon, QrCodeIcon } from './icons/Icons';

const getCardStyle = (user: User) => {
    if (user.role === 'Docente') {
        return {
            bgColor: 'bg-slate-700',
            textColor: 'text-slate-100',
            accentColor: 'text-slate-300',
            patternStyle: {
                backgroundImage: 'linear-gradient(45deg, #475569 25%, transparent 25%), linear-gradient(-45deg, #475569 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #475569 75%), linear-gradient(-45deg, transparent 75%, #475569 75%)',
                backgroundSize: '20px 20px',
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                opacity: 0.5,
            },
            borderColor: 'border-slate-500'
        };
    }
    switch (user.area) {
        case 'Inicial':
            return {
                bgColor: 'bg-sun-400',
                textColor: 'text-sun-900',
                accentColor: 'text-sun-700',
                 patternStyle: {
                    backgroundImage: 'radial-gradient(circle, currentColor 6px, transparent 6px)',
                    backgroundSize: '80px 80px',
                    color: 'rgba(245, 158, 11, 0.3)',
                },
                borderColor: 'border-sun-600'
            };
        case 'Primaria':
            return {
                bgColor: 'bg-sky-400',
                textColor: 'text-sky-900',
                accentColor: 'text-sky-700',
                patternStyle: {
                    backgroundImage: 'radial-gradient(circle, currentColor 4px, transparent 4px)',
                    backgroundSize: '40px 40px',
                    color: 'rgba(14, 165, 233, 0.3)',
                },
                borderColor: 'border-sky-600'
            };
        case 'Secundaria':
            return {
                bgColor: 'bg-grass-500',
                textColor: 'text-grass-900',
                accentColor: 'text-grass-700',
                patternStyle: {
                    backgroundImage: 'repeating-linear-gradient(45deg, currentColor, currentColor 2px, transparent 2px, transparent 20px)',
                    color: 'rgba(22, 163, 74, 0.3)',
                },
                borderColor: 'border-grass-700'
            };
        default:
             return {
                bgColor: 'bg-slate-500',
                textColor: 'text-white',
                accentColor: 'text-slate-300',
                patternStyle: {},
                borderColor: 'border-slate-600'
            };
    }
};

export const IdCard: React.FC<IdCardProps> = ({ user, side }) => {
    const styles = getCardStyle(user);
    
    const cardBaseClasses = "aspect-[53/85] rounded-xl shadow-md overflow-hidden relative flex flex-col justify-between p-3 text-center break-inside-avoid";
    
    if (side === 'front') {
        return (
            <div 
                className={`${cardBaseClasses} ${styles.bgColor}`} 
                style={{ width: '5.3cm', height: '8.5cm' }}
            >
                <div className="absolute inset-0" style={styles.patternStyle}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center flex-1 justify-center">
                    <div className="w-24 h-24 bg-white/80 rounded-full mb-3 flex items-center justify-center border-4 border-white shadow-lg">
                        <CameraIcon className={`w-12 h-12 ${styles.textColor} opacity-50`} />
                    </div>
                     <h3 className={`font-bold text-lg leading-tight ${styles.textColor} text-shadow-sm`}>{user.name}</h3>
                </div>
                <div className={`relative z-10 p-2 rounded-lg bg-white/70 backdrop-blur-sm`}>
                     <p className={`font-bold text-base ${styles.textColor}`}>{user.area}</p>
                     <p className={`font-semibold text-xs ${styles.accentColor}`}>{user.etapa}</p>
                </div>
            </div>
        );
    }

    if (side === 'back') {
        return (
             <div 
                className={`${cardBaseClasses} ${styles.bgColor}`} 
                style={{ width: '5.3cm', height: '8.5cm' }}
            >
                <div className="absolute inset-0" style={styles.patternStyle}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center justify-center flex-1">
                    <div className="p-4 bg-white rounded-lg shadow-lg">
                        <QrCodeIcon className={`w-32 h-32 ${styles.textColor}`} />
                    </div>
                    <p className={`mt-4 font-mono text-sm ${styles.accentColor}`}>{user.id}</p>
                </div>
                 <div className="relative z-10 text-center">
                     <p className={`font-bold text-lg ${styles.textColor}`}>IEE 6049 Ricardo Palma</p>
                </div>
            </div>
        );
    }

    return null;
};

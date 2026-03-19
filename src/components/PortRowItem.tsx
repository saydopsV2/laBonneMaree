import React from 'react';
import { PortTimerBadge } from './PortTimerBadge';
import type { Port } from '../types';

interface PortRowItemProps {
    port?: Port | null;
    name: string;
    distance: string;
    coefficient: number;
    level: string;
    status: 'Rising' | 'Falling' | 'Stable';
    imgSrc: string;
    onClick?: () => void;
}

export const PortRowItem: React.FC<PortRowItemProps> = ({ 
    port,
    name, 
    distance, 
    coefficient, 
    level, 
    status, 
    imgSrc, 
    onClick 
}) => {
    return (
        <div onClick={onClick} className="md:col-span-12 bg-surface-container-lowest p-5 rounded-xl flex items-center gap-6 border border-outline-variant/10 group hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover" src={imgSrc} alt={`${name} port view`} />
            </div>
            <div className="flex-1">
                <h4 className="font-headline font-bold text-primary">{name}</h4>
                <p className="text-xs text-outline font-label">{distance}</p>
            </div>
            <div className="hidden sm:block text-right px-6 border-x border-outline-variant/10">
                <div className="text-xs text-outline font-label uppercase mb-1">Coefficient</div>
                <div className="font-headline font-bold text-primary">{coefficient}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <div className="flex flex-col items-end min-w-[100px]">
                    <span className="text-xs font-bold uppercase text-on-tertiary-container">{status}</span>
                    <span className="font-headline text-xl font-extrabold text-primary">{level}</span>
                </div>
                {port && <PortTimerBadge port={port} size="small" />}
            </div>
            <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
        </div>
    );
};
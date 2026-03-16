import React from 'react';

interface PortGridItemProps {
    name: string;
    location: string;
    level: string;
    status: 'Rising' | 'Falling' | 'Low Tide soon' | 'High Tide soon';
    nextEventTime: string;
    nextEventLabel: string;
    warning?: boolean;
}

export const PortGridItem: React.FC<PortGridItemProps> = ({ name, location, level, status, nextEventTime, nextEventLabel, warning }) => {
    return (
        <div className="md:col-span-6 bg-surface-container-low p-5 rounded-xl flex flex-col gap-4 border border-outline-variant/10 cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-headline font-bold text-primary">{name}</h4>
                    <p className="text-xs text-outline font-label">{location}</p>
                </div>
                {warning && <span className="material-symbols-outlined text-secondary">warning</span>}
            </div>
            <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-extrabold text-primary">{level}</span>
                <span className={`text-xs font-bold uppercase tracking-widest ${warning ? 'text-secondary' : 'text-on-tertiary-container'}`}>
                    {status}
                </span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-outline uppercase tracking-wider mt-2">
                <span>Prochaine: {nextEventTime}</span>
                <span>{nextEventLabel}</span>
            </div>
        </div>
    );
};
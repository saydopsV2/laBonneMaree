import React from 'react';

export const TideEvents: React.FC = () => {
    return (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
            <h3 className="font-headline text-lg font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl" data-icon="schedule">schedule</span>
                Prochains Événements
            </h3>
            <div className="space-y-6">
                <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                            <span className="material-symbols-outlined" data-icon="arrow_upward">arrow_upward</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold">Pleine Mer</p>
                            <p className="text-xs text-on-surface-variant font-label uppercase">Coeff. 82</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-headline font-extrabold">22:05</p>
                        <p className="text-xs text-outline font-label">9.45m</p>
                    </div>
                </div>
                <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary/80 group-hover:bg-secondary group-hover:text-on-secondary transition-all">
                            <span className="material-symbols-outlined" data-icon="arrow_downward">arrow_downward</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold">Basse Mer</p>
                            <p className="text-xs text-on-surface-variant font-label uppercase">Demain</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-headline font-extrabold">04:32</p>
                        <p className="text-xs text-outline font-label">1.40m</p>
                    </div>
                </div>
            </div>
            <button className="w-full mt-8 py-3 bg-primary text-on-primary rounded-lg font-headline font-bold text-sm tracking-wide hover:opacity-90 transition-opacity">
                CONSULTER L'ANNUAIRE
            </button>
        </div>
    );
};
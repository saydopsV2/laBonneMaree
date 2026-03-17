import React from 'react';

export const QuickPortStatus: React.FC = () => {
    return (
        <div className="md:col-span-4 bg-surface-container-low p-6 rounded-xl flex flex-col justify-between">
            <div>
                <h3 className="font-headline text-xl font-bold text-primary mb-1">Andernos</h3>
                <p className="text-xs text-on-surface-variant font-label mb-4">Vieux Port</p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-outline font-label uppercase">Niveau</span>
                        <span className="font-headline font-bold text-lg text-primary">1.1m</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-tertiary-container to-on-tertiary-container w-[65%]"></div>
                    </div>
                    <div className="flex items-center gap-2 text-secondary-container">
                        <span className="material-symbols-outlined text-sm">trending_down</span>
                        <span className="text-xs font-semibold uppercase">Marée Descante</span>
                    </div>
                </div>
            </div>
            <button className="mt-6 border border-outline-variant/30 py-3 rounded-lg text-sm font-semibold text-primary hover:bg-surface-container-high transition-colors cursor-pointer w-full">
                Détails complets
            </button>
        </div>
    );
};
import React from 'react';

export const TideHeader: React.FC = () => {
    return (
        <section className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
                <span className="font-label text-xs font-semibold uppercase tracking-widest text-outline">Instruments de Précision</span>
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-primary leading-none">Détails des Marées</h1>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl">
                <div className="h-10 w-1 text-secondary rounded-full bg-secondary"></div>
                <div>
                    <p className="font-label text-[10px] uppercase tracking-wider text-on-secondary-fixed-variant">Seuil de Sécurité</p>
                    <p className="font-headline text-lg font-bold">2.4m <span className="text-sm font-medium text-outline">(Tirant d'eau)</span></p>
                </div>
            </div>
        </section>
    );
};
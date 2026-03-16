import React from 'react';

export const TideGraph: React.FC = () => {
    return (
        <div className="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden relative border border-transparent">
            <div className="p-8 pb-0">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="font-headline text-xl font-bold text-primary">Courbe Journalière</h2>
                        <p className="text-sm text-on-surface-variant">Port de Saint-Malo • 24 Octobre</p>
                    </div>
                    <div className="text-right">
                        <span className="font-label text-xs uppercase tracking-widest text-outline block mb-1">Niveau Actuel</span>
                        <span className="font-headline text-4xl font-extrabold text-primary">4.12m</span>
                    </div>
                </div>
            </div>
            {/* Visual Graph Area */}
            <div className="relative h-[300px] w-full px-8 mt-4">
                {/* Safety Threshold Line */}
                <div className="absolute bottom-[24%] left-0 w-full border-t-2 border-dashed border-secondary/40 z-10 flex items-center">
                    <span className="bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded ml-8">LIMITE DE TIRANT</span>
                </div>
                {/* Water Level Indicators */}
                <div className="absolute inset-0 tide-curve bg-gradient-to-b from-tertiary-container/80 to-primary opacity-90"></div>
                {/* Graph Markers */}
                <div className="absolute left-[30%] top-[15%] flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full border-4 border-surface bg-primary shadow-lg"></div>
                    <div className="mt-2 text-center">
                        <p className="font-label text-[10px] font-bold uppercase">Pleine Mer</p>
                        <p className="font-headline text-sm font-extrabold">09:42 • 9.8m</p>
                    </div>
                </div>
                <div className="absolute left-[80%] bottom-[15%] flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full border-4 border-surface bg-secondary shadow-lg"></div>
                    <div className="mt-2 text-center">
                        <p className="font-label text-[10px] font-bold uppercase text-secondary">Basse Mer</p>
                        <p className="font-headline text-sm font-extrabold text-secondary">16:15 • 1.2m</p>
                    </div>
                </div>
                {/* Current Position Marker */}
                <div className="absolute left-[55%] top-[35%] flex flex-col items-center z-20">
                    <div className="h-32 w-px bg-on-tertiary-container/30 relative">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-on-tertiary-container ring-4 ring-on-tertiary-container/20"></div>
                    </div>
                    <p className="mt-2 font-label text-[10px] font-bold uppercase bg-on-surface text-surface px-2 py-0.5 rounded">Maintenant</p>
                </div>
            </div>
            {/* X-Axis Labels */}
            <div className="flex justify-between px-8 py-4 bg-surface-container-high/50 font-label text-[10px] tracking-tighter text-outline">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span className="text-primary font-bold">12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>23:59</span>
            </div>
        </div>
    );
};
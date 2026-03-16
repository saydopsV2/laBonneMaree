import React from 'react';

export const DeepDataRow: React.FC = () => {
    return (
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <p className="font-label text-[10px] font-bold uppercase text-outline mb-2">Pression</p>
                <p className="font-headline text-2xl font-extrabold text-primary">1013 hPa</p>
                <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-primary"></div>
                </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <p className="font-label text-[10px] font-bold uppercase text-outline mb-2">Visibilité</p>
                <p className="font-headline text-2xl font-extrabold text-primary">8.2 nm</p>
                <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-primary"></div>
                </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <p className="font-label text-[10px] font-bold uppercase text-outline mb-2">Levé du Soleil</p>
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-secondary-fixed-variant" data-icon="wb_sunny">wb_sunny</span>
                    <p className="font-headline text-2xl font-extrabold text-primary">07:44</p>
                </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <p className="font-label text-[10px] font-bold uppercase text-outline mb-2">Coucher du Soleil</p>
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline" data-icon="nights_stay">nights_stay</span>
                    <p className="font-headline text-2xl font-extrabold text-primary">19:12</p>
                </div>
            </div>
        </div>
    );
};
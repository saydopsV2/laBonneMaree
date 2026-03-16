import React from 'react';

export const WeatherCard: React.FC = () => {
    return (
        <div className="bg-tertiary text-on-tertiary rounded-xl p-6 flex flex-col justify-between h-[200px] relative overflow-hidden">
            <div className="relative z-10">
                <span className="font-label text-[10px] font-bold uppercase tracking-widest opacity-60">Conditions Locales</span>
                <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-headline text-4xl font-extrabold">12.4</span>
                    <span className="text-lg font-medium opacity-80">knots</span>
                </div>
                <p className="text-sm opacity-70">Vent de Nord-Ouest</p>
            </div>
            <div className="relative z-10 flex justify-between items-end">
                <div className="flex gap-2">
                    <span className="material-symbols-outlined text-on-tertiary-container" data-icon="water_drop">water_drop</span>
                    <span className="text-xs font-label">Temp: 14°C</span>
                </div>
                <span className="material-symbols-outlined opacity-30 text-5xl" data-icon="cyclone">cyclone</span>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary-container rounded-full blur-3xl opacity-20"></div>
        </div>
    );
};
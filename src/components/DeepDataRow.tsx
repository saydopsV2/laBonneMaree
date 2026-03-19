import React from 'react';
import { useWeatherData } from '../hooks/useWeatherData';

export const DeepDataRow: React.FC = () => {
    const { current, loading, error } = useWeatherData();

    if (error) {
        return (
            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-4 bg-red-900/20 border border-red-500 p-5 rounded-xl">
                    <p className="text-red-400 text-sm">Erreur: {error}</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-4 bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                    <p className="text-outline opacity-60">Chargement des données...</p>
                </div>
            </div>
        );
    }

    const pressure = current.pressure !== null ? current.pressure.toFixed(0) : '1013';
    const visibility = current.visibility !== null ? (current.visibility / 1000).toFixed(1) : '8.2';
    const sunrise = current.sunrise ? new Date(current.sunrise).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '07:09';
    const sunset = current.sunset ? new Date(current.sunset).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '19:15';

    return (
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <p className="font-label text-[10px] font-bold uppercase text-outline mb-2">Pression</p>
                <p className="font-headline text-2xl font-extrabold text-primary">{pressure} hPa</p>
                <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-primary"></div>
                </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <p className="font-label text-[10px] font-bold uppercase text-outline mb-2">Visibilité</p>
                <p className="font-headline text-2xl font-extrabold text-primary">{visibility} km</p>
                <div className="mt-4 h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-primary"></div>
                </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <p className="font-label text-[10px] font-bold uppercase text-outline mb-2">Levé du Soleil</p>
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-secondary-fixed-variant" data-icon="wb_sunny">wb_sunny</span>
                    <p className="font-headline text-2xl font-extrabold text-primary">{sunrise}</p>
                </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/20">
                <p className="font-label text-[10px] font-bold uppercase text-outline mb-2">Coucher du Soleil</p>
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline" data-icon="nights_stay">nights_stay</span>
                    <p className="font-headline text-2xl font-extrabold text-primary">{sunset}</p>
                </div>
            </div>
        </div>
    );
};
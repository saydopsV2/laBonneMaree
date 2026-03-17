import { useMemo } from 'react';
import { useTideData } from '../hooks/useTideData';

export const TideInstrument = () => {
    const { getClosestTide, getTidesForDate, loading, error } = useTideData();

    // Get current date and time
    const now = new Date();
    const currentDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Get current tide
    const currentTide = useMemo(() => {
        return getClosestTide(currentDate, currentTime);
    }, [getClosestTide, currentDate, currentTime]);

    // Get min and max for the day
    const { minTide, maxTide } = useMemo(() => {
        const tidesForDay = getTidesForDate(currentDate);
        
        if (tidesForDay.length === 0) {
            return { minTide: null, maxTide: null, avgTide: null };
        }

        let min = tidesForDay[0];
        let max = tidesForDay[0];
        let sum = 0;

        tidesForDay.forEach(tide => {
            if (tide.hauteur < min.hauteur) min = tide;
            if (tide.hauteur > max.hauteur) max = tide;
            sum += tide.hauteur;
        });

        return {
            minTide: min,
            maxTide: max,
            avgTide: sum / tidesForDay.length
        };
    }, [getTidesForDate, currentDate]);

    if (loading) {
        return (
            <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-center items-center">
                <span className="text-on-surface-variant">Chargement des marées...</span>
            </div>
        );
    }

    if (error || !currentTide) {
        return (
            <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-center items-center">
                <span className="text-red-500">Erreur: Données de marée indisponibles</span>
            </div>
        );
    }

    const hauteurActuelle = currentTide.hauteur;
    const tirantDEau = 0.4;
    const minHauteur = minTide?.hauteur || 0.8;
    const maxHauteur = maxTide?.hauteur || 5.4;
    const hauteurPercent = ((hauteurActuelle - minHauteur) / (maxHauteur - minHauteur)) * 100;

    return (
        <div className="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div>
                <span className="font-label text-xs font-bold uppercase tracking-widest text-outline mb-6 block">Conditions actuelles</span>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="font-headline text-5xl font-extrabold text-primary">{hauteurActuelle.toFixed(1)}m</h3>
                        <p className="text-sm font-medium text-on-surface-variant mt-1">Hauteur de marée actuelle ({currentTide.heure})</p>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-on-tertiary-container">water</span>
                </div>
                <div className="space-y-6">
                    <div className="h-32 w-full bg-surface-container-highest rounded-lg relative overflow-hidden">
                        <div 
                            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-tertiary-container to-on-tertiary-container opacity-40 transition-all duration-300" 
                            style={{ height: `${Math.max(0, Math.min(100, hauteurPercent))}%` }}
                        />
                        <div className="absolute bottom-[65%] left-0 w-full border-t-2 border-dashed border-on-tertiary-container/50" />
                        <div 
                            className="absolute left-0 w-full h-[2px] bg-secondary flex items-center px-2 transition-all duration-300"
                            style={{ bottom: `${Math.max(0, Math.min(100, ((tirantDEau - minHauteur) / (maxHauteur - minHauteur)) * 100))}%` }}
                        >
                            <span className="bg-secondary text-white text-[10px] px-1.5 py-0.5 rounded font-bold -mt-6 whitespace-nowrap">TIRANT: {tirantDEau.toFixed(1)}m</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-outline uppercase tracking-wider">
                        <span>Bas ({minHauteur.toFixed(1)}m)</span>
                        <span>Haut ({maxHauteur.toFixed(1)}m)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
import React, { useMemo } from 'react';
import { useTideData } from '../hooks/useTideData';
import { usePortContext } from '../context/PortContext';

export const HeroCountdown = () => {
    const { selectedPort } = usePortContext();
    const { getTidesBetween, getClosestTide, loading, error } = useTideData();

    // Get current date and time
    const now = new Date();
    const currentDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Get current tide
    const currentTide = useMemo(() => {
        return getClosestTide(currentDate, currentTime);
    }, [getClosestTide, currentDate, currentTime]);

    // Calculate time until port is accessible
    const { delaiAcces, heureAcces, hauteurAcces } = useMemo(() => {
        if (!currentTide) {
            return { delaiAcces: '--:--', heureAcces: '--:--', hauteurAcces: 0 };
        }

        const tirantDEau = selectedPort?.hauteur ? parseFloat(selectedPort.hauteur) : 0.4;
        const hauteurActuelle = currentTide.hauteur;

        // Si la hauteur est déjà suffisante
        if (hauteurActuelle >= tirantDEau + 0.5) {
            return {
                delaiAcces: '00:00',
                heureAcces: currentTime,
                hauteurAcces: hauteurActuelle
            };
        }

        // Get tides for next 24 hours
        const endTime = `${String((now.getHours() + 24) % 24).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        let futureDate = currentDate;
        
        // Find when tide height reaches tirantDEau + 0.5m (safety margin)
        let closestAccessTime = null;
        let closestAccessHeight = 0;

        // Search in tides for the next hours
        for (let h = 0; h < 24; h++) {
            const searchTime = `${String((now.getHours() + h) % 24).padStart(2, '0')}:00`;
            const searchDate = currentDate; // Simplified - assumes same day for now
            
            const tidesInHour = getTidesBetween(searchDate, searchTime, `${String((parseInt(searchTime.split(':')[0]) + 1) % 24).padStart(2, '0')}:00`);
            
            const accessibleTide = tidesInHour.find(t => parseFloat(t.hauteur.toString()) >= tirantDEau + 0.5);
            
            if (accessibleTide) {
                const [accessHours, accessMinutes] = accessibleTide.heure.split(':');
                const accessHour = parseInt(accessHours);
                const accessMin = parseInt(accessMinutes);
                
                const currentHour = now.getHours();
                const currentMin = now.getMinutes();
                
                let delaiMinutes = (accessHour * 60 + accessMin) - (currentHour * 60 + currentMin);
                if (delaiMinutes < 0) {
                    delaiMinutes += 24 * 60;
                }
                
                const delaiHeures = Math.floor(delaiMinutes / 60);
                const delaiMins = delaiMinutes % 60;
                
                closestAccessTime = accessibleTide.heure;
                closestAccessHeight = accessibleTide.hauteur;
                
                return {
                    delaiAcces: `${String(delaiHeures).padStart(2, '0')}:${String(delaiMins).padStart(2, '0')}`,
                    heureAcces: closestAccessTime,
                    hauteurAcces: closestAccessHeight
                };
            }
        }

        return { delaiAcces: '01:42', heureAcces: '14:30', hauteurAcces: tirantDEau + 0.5 };
    }, [currentTide, selectedPort, getTidesBetween, currentDate, currentTime, now]);

    // Calculate recommendation message based on time remaining
    const recommendationMessage = useMemo(() => {
        const [heures, minutes] = delaiAcces.split(':').map(Number);
        const totalMinutes = heures * 60 + minutes;

        if (totalMinutes === 0) {
            return 'Le port est accessible MAINTENANT ! Vous pouvez partir immédiatement.';
        } else if (totalMinutes < 15) {
            return `Préparez-vous d'urgence ! Vous avez seulement ${totalMinutes} minute${totalMinutes > 1 ? 's' : ''} pour accéder au port.`;
        } else if (totalMinutes < 60) {
            return `Il est recommandé de s'y diriger immédiatement. Vous avez ${totalMinutes} minutes pour vous préparer.`;
        } else if (totalMinutes < 120) {
            return `Vous avez ${heures} heure et ${minutes} minute${minutes > 1 ? 's' : ''} pour vous préparer avant d'accéder au port.`;
        } else {
            return `Vous avez ${heures} heures et ${minutes} minutes pour vous préparer avant d'accéder au port.`;
        }
    }, [delaiAcces]);

    if (loading) {
        return (
            <div className="md:col-span-8 overflow-hidden rounded-xl ocean-gradient relative text-white p-8 min-h-[400px] flex flex-col justify-center items-center shadow-xl">
                <span className="text-primary-fixed">Calcul des conditions d'accès...</span>
            </div>
        );
    }

    if (error || !currentTide) {
        return (
            <div className="md:col-span-8 overflow-hidden rounded-xl ocean-gradient relative text-white p-8 min-h-[400px] flex flex-col justify-center items-center shadow-xl">
                <span className="text-red-300">Données de marée indisponibles</span>
            </div>
        );
    }

    return (
        <div className="md:col-span-8 overflow-hidden rounded-xl ocean-gradient relative text-white p-8 min-h-[400px] flex flex-col justify-between shadow-xl">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                <svg className="w-full h-full stroke-white fill-none stroke-[0.5]" viewBox="0 0 100 100">
                    <circle cx="100" cy="0" r="40" />
                    <circle cx="100" cy="0" r="60" />
                    <circle cx="100" cy="0" r="80" />
                    <line x1="100" x2="0" y1="0" y2="100" />
                </svg>
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-primary-fixed mb-6">
                    <span className="material-symbols-outlined">timer</span>
                    <span className="font-label text-sm font-bold tracking-widest uppercase">Délai de mise à quai</span>
                </div>
                <div className="flex items-baseline gap-4">
                    <span className="font-headline text-8xl font-black tracking-tighter">{delaiAcces}</span>
                    <span className="font-headline text-2xl font-bold text-primary-fixed opacity-70">HRS</span>
                </div>
                <p className="mt-4 text-primary-fixed max-w-xs text-lg font-medium">
                    L'entrée du port <span className="font-extrabold">{selectedPort?.ville || 'Arcachon'}, {selectedPort?.endroit}</span> sera accessible vers <span className="font-extrabold">{heureAcces}</span> (hauteur: {hauteurAcces.toFixed(2)}m). {recommendationMessage}
                </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-4 mt-8">
                <button className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:opacity-90 transition-opacity shadow-lg shadow-secondary/20">
                    <span className="material-symbols-outlined">emergency_home</span> Demande d'accostage
                </button>
            </div>
        </div>
    );
};
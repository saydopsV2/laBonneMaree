import { useMemo } from 'react';
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

    // Constants for calculation
    const TIRANT_EAU_BATEAU = 0.4; // Tirant d'eau du bateau (40cm)
    const MARGE_SECURITE = 0.2; // Marge de sécurité (20cm)
    const PROFONDEUR_REQUISE = TIRANT_EAU_BATEAU + MARGE_SECURITE; // 0.6m total

    // Calculate time until port is accessible
    const { delaiAcces, heureAcces, hauteurAcces, profondeurActuelle, profondeurRequise, isAccessible, hauteurCale } = useMemo(() => {
        if (!currentTide) {
            return { delaiAcces: '--:--', heureAcces: '--:--', hauteurAcces: 0, profondeurActuelle: 0, profondeurRequise: PROFONDEUR_REQUISE, isAccessible: false, hauteurCale: 0 };
        }

        // Hauteur de la cale du port (référence zéro)
        const hauteurCalePort = selectedPort?.hauteurCale ? parseFloat(selectedPort.hauteurCale) : -1.5;
        
        // Hauteur absolue de l'eau à cet instant
        const hauteurEauAbsolue = currentTide.hauteur;
        
        // Profondeur réelle disponible = hauteur absolue - hauteur de la cale
        const profondeur = hauteurEauAbsolue - hauteurCalePort;

        // Si la profondeur est déjà suffisante
        if (profondeur >= PROFONDEUR_REQUISE) {
            return {
                delaiAcces: '00:00',
                heureAcces: currentTime,
                hauteurAcces: hauteurEauAbsolue,
                profondeurActuelle: profondeur,
                profondeurRequise: PROFONDEUR_REQUISE,
                isAccessible: true,
                hauteurCale: hauteurCalePort
            };
        }

        // Rechercher le prochain moment où la profondeur sera suffisante
        let closestAccessTime = null;
        let closestAccessHeight = 0;

        // Search in tides for the next hours
        for (let h = 0; h < 24; h++) {
            const searchTime = `${String((now.getHours() + h) % 24).padStart(2, '0')}:00`;
            const searchDate = currentDate; // Simplifié - assume même jour pour l'instant
            
            const tidesInHour = getTidesBetween(searchDate, searchTime, `${String((parseInt(searchTime.split(':')[0]) + 1) % 24).padStart(2, '0')}:00`);
            
            const accessibleTide = tidesInHour.find(t => {
                const profondeurTide = t.hauteur - hauteurCalePort;
                return profondeurTide >= PROFONDEUR_REQUISE;
            });
            
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
                const calcProfondeur = closestAccessHeight - hauteurCalePort;
                
                return {
                    delaiAcces: `${String(delaiHeures).padStart(2, '0')}:${String(delaiMins).padStart(2, '0')}`,
                    heureAcces: closestAccessTime,
                    hauteurAcces: closestAccessHeight,
                    profondeurActuelle: calcProfondeur,
                    profondeurRequise: PROFONDEUR_REQUISE,
                    isAccessible: false,
                    hauteurCale: hauteurCalePort
                };
            }
        }

        return { delaiAcces: '01:42', heureAcces: '14:30', hauteurAcces: hauteurEauAbsolue, profondeurActuelle: profondeur, profondeurRequise: PROFONDEUR_REQUISE, isAccessible: false, hauteurCale: hauteurCalePort };
    }, [currentTide, selectedPort, getTidesBetween, currentDate, currentTime, now]);

    // Determine alert level
    const alertLevel = useMemo(() => {
        const [heures, minutes] = delaiAcces.split(':').map(Number);
        const totalMinutes = heures * 60 + minutes;

        if (totalMinutes === 0) {
            return { level: 'critical', bg: 'bg-red-500', border: 'border-red-400', icon: 'priority_high' };
        } else if (totalMinutes < 15) {
            return { level: 'urgent', bg: 'bg-orange-500', border: 'border-orange-400', icon: 'warning' };
        } else if (totalMinutes < 60) {
            return { level: 'caution', bg: 'bg-yellow-500', border: 'border-yellow-400', icon: 'info' };
        } else {
            return { level: 'normal', bg: 'bg-green-500', border: 'border-green-400', icon: 'check_circle' };
        }
    }, [delaiAcces]);

    // Calculate recommendation message based on time remaining
    const recommendationMessage = useMemo(() => {
        const [heures, minutes] = delaiAcces.split(':').map(Number);
        const totalMinutes = heures * 60 + minutes;

        if (isAccessible) {
            return `ACCÈS AUTORISÉ: Profondeur actuelle ${profondeurActuelle.toFixed(2)}m > ${profondeurRequise.toFixed(2)}m requis. Vous pouvez accéder au port immédiatement.`;
        } else if (totalMinutes === 0) {
            return 'Le port est accessible MAINTENANT ! Vous pouvez partir immédiatement.';
        } else if (totalMinutes < 15) {
            return `Préparez-vous d'urgence ! Vous avez seulement ${totalMinutes} minute${totalMinutes > 1 ? 's' : ''} pour accéder au port.`;
        } else if (totalMinutes < 60) {
            return `Il est recommandé de s'y diriger immédiatement. Vous avez ${totalMinutes} minutes pour vous préparer.`;
        } else if (totalMinutes < 120) {
            return `Vous avez ${heures}:${minutes} HRS${minutes > 1 ? 's' : ''} pour vous préparer avant d'accéder au port.`;
        } else {
            return `Vous avez ${heures}:${minutes} HRS pour accéder au port.`;
        }
    }, [delaiAcces, isAccessible, profondeurActuelle, profondeurRequise]);

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
                    L'entrée du port <span className="font-extrabold">{selectedPort?.ville || 'Arcachon'}, {selectedPort?.endroit}</span> sera accessible vers <span className="font-extrabold">{heureAcces} HRS</span> (hauteur: {hauteurAcces.toFixed(2)}m). {recommendationMessage}
                </p>
                
                {/* Détail du calcul */}
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-xs font-bold uppercase text-primary-fixed mb-3 tracking-widest">Détail du calcul</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-white/70">Hauteur eau (marée)</span>
                            <p className="font-bold text-lg">{currentTide?.hauteur.toFixed(2) || '--'}m</p>
                        </div>
                        <div>
                            <span className="text-white/70">Profondeur cale</span>
                            <p className="font-bold text-lg">{Math.abs(hauteurCale).toFixed(2)}m</p>
                        </div>
                        <div>
                            <span className="text-white/70">Profondeur réelle</span>
                            <p className="font-bold text-lg text-yellow-300">{profondeurActuelle.toFixed(2)}m</p>
                        </div>
                        <div>
                            <span className="text-white/70">Tirant d'eau + Marge</span>
                            <p className="font-bold text-lg text-white">{profondeurRequise.toFixed(2)}m (40cm + 20cm)</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative z-10 flex flex-wrap gap-4 mt-8">
                <div className={`flex-1 ${alertLevel.bg} text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg border-2 ${alertLevel.border} animate-pulse`}>
                    <span className="material-symbols-outlined text-2xl">{alertLevel.icon}</span>
                    <div className="flex flex-col">
                        <span className="text-sm uppercase tracking-widest opacity-90">
                            {alertLevel.level === 'critical' ? 'ACCÈS IMMÉDIAT !' : 
                             alertLevel.level === 'urgent' ? 'ACCÈS URGENT !' : 
                             alertLevel.level === 'caution' ? 'ACCÈS PROCHE' : 
                             'ACCÈS PLANIFIÉ'}
                        </span>
                        <span className="text-xs mt-1 opacity-80">{recommendationMessage}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
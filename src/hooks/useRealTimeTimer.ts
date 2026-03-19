import { useEffect, useState } from 'react';
import { useTideData } from './useTideData';
import type { Port } from '../types';
import type { TimerState } from './useTideTimer';

/**
 * Real-time timer hook that updates every second
 * Recalculates timer state based on current system time
 */
export const useRealTimeTimer = (selectedPort: Port | null) => {
    const { getClosestTide, findNextCrossing, loading, error } = useTideData();
    const [, forceUpdate] = useState(0);

    // Force update every second
    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Constants
    const TIRANT_EAU_BATEAU = 0.4;
    const MARGE_SECURITE = 0.2;
    const SEUIL_PROFONDEUR = TIRANT_EAU_BATEAU + MARGE_SECURITE;

    // Get CURRENT time (recalculated on every render due to forceUpdate)
    const now = new Date();
    const currentDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Get current tide
    const currentTide = getClosestTide(currentDate, currentTime);

    // Calculate timer state
    const timerState: TimerState = (() => {
        if (!currentTide || !selectedPort) {
            return {
                delai: '--:--',
                heureEvenement: '--:--',
                phase: 'waiting',
                hauteurActuelle: 0,
                hauteurEvenement: 0,
                profondeurActuelle: 0,
                seuilProfondeur: SEUIL_PROFONDEUR,
                seuilHauteur: 2.6,
                hauteurCale: 0,
                isAccessible: false,
                messageRecommandation: 'Données indisponibles'
            };
        }

        // Hauteur de la cale du port
        const hauteurCalePort = parseFloat(selectedPort.hauteurCale || '-1.5');
        const profondeurCaleAbsolue = Math.abs(hauteurCalePort);
        const hauteurEauActuelle = currentTide.hauteur;
        const seuilHauteur = profondeurCaleAbsolue + SEUIL_PROFONDEUR;
        const profondeurActuelle = hauteurEauActuelle - hauteurCalePort;
        const isAccessibleNow = hauteurEauActuelle >= seuilHauteur;

        // Find next crossing
        let phase: 'waiting' | 'available';
        let targetCrossing: { heure: string; hauteur: number } | null;
        let messagePrefix: string;

        if (isAccessibleNow) {
            phase = 'available';
            targetCrossing = findNextCrossing(currentDate, currentTime, seuilHauteur, 'down');
            messagePrefix = 'Temps restant avant de devoir quitter';
        } else {
            phase = 'waiting';
            targetCrossing = findNextCrossing(currentDate, currentTime, seuilHauteur, 'up');
            messagePrefix = 'Délai avant d\'accéder au port';
        }

        if (!targetCrossing) {
            return {
                delai: '??:??',
                heureEvenement: '--:--',
                phase,
                hauteurActuelle: hauteurEauActuelle,
                hauteurEvenement: 0,
                profondeurActuelle,
                seuilProfondeur: SEUIL_PROFONDEUR,
                seuilHauteur,
                hauteurCale: hauteurCalePort,
                isAccessible: isAccessibleNow,
                messageRecommandation: `Aucun événement trouvé aujourd'hui. ${messagePrefix}...`
            };
        }

        // Calculate delay
        const [targetH, targetM] = targetCrossing.heure.split(':').map(Number);
        const [currentH, currentM] = currentTime.split(':').map(Number);
        const targetTotalMin = targetH * 60 + targetM;
        const currentTotalMin = currentH * 60 + currentM;

        let delaiMinutes = targetTotalMin - currentTotalMin;
        if (delaiMinutes < 0) {
            delaiMinutes += 24 * 60;
        }

        const delaiHeures = Math.floor(delaiMinutes / 60);
        const delaiMins = delaiMinutes % 60;
        const delaiString = `${String(delaiHeures).padStart(2, '0')}:${String(delaiMins).padStart(2, '0')}`;

        // Message
        let messageRecommandation = '';
        if (isAccessibleNow) {
            messageRecommandation = `ACCÈS AUTORISÉ: Hauteur eau ${hauteurEauActuelle.toFixed(2)}m > seuil ${seuilHauteur.toFixed(2)}m. Temps avant de quitter: ${delaiString}`;
        } else if (delaiMinutes === 0) {
            messageRecommandation = `Le port est accessible MAINTENANT ! Vous pouvez partir immédiatement.`;
        } else if (delaiMinutes < 15) {
            messageRecommandation = `Préparez-vous d'urgence ! Vous avez seulement ${delaiMinutes} minute${delaiMinutes > 1 ? 's' : ''} avant que le port soit accessible.`;
        } else if (delaiMinutes < 60) {
            messageRecommandation = `Il est recommandé de s'y diriger. Vous avez ${delaiMinutes} minutes avant le port soit accessible.`;
        } else if (delaiMinutes < 120) {
            messageRecommandation = `${messagePrefix}: ${delaiHeures}h${String(delaiMins).padStart(2, '0')}`;
        } else {
            messageRecommandation = `${messagePrefix}: ${delaiHeures}h${String(delaiMins).padStart(2, '0')}`;
        }

        return {
            delai: delaiString,
            heureEvenement: targetCrossing.heure,
            phase,
            hauteurActuelle: hauteurEauActuelle,
            hauteurEvenement: targetCrossing.hauteur,
            profondeurActuelle,
            seuilProfondeur: SEUIL_PROFONDEUR,
            seuilHauteur,
            hauteurCale: hauteurCalePort,
            isAccessible: isAccessibleNow,
            messageRecommandation
        };
    })();

    return {
        ...timerState,
        loading,
        error,
        currentDate,
        currentTime,
        currentTide
    };
};


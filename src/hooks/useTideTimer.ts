import { useMemo } from 'react';
import { useTideData } from './useTideData';
import type { Port } from '../types';

export interface TimerState {
    // Timer display
    delai: string; // "HH:MM"
    heureEvenement: string; // Time when event occurs
    phase: 'waiting' | 'available'; // 'waiting' = must wait to leave port, 'available' = can leave but must return later
    hauteurActuelle: number; // Current water height
    hauteurEvenement: number; // Height at the target event
    profondeurActuelle: number; // Current depth at port (hauteur eau - hauteur cale)
    seuilProfondeur: number; // Required depth for boat passage (tirant eau + marge) = 0.6m
    seuilHauteur: number; // Minimum water height for access = |hauteur cale| + seuilProfondeur
    hauteurCale: number; // Port's cale height reference
    isAccessible: boolean; // Can access port right now?
    messageRecommandation: string; // User-friendly message

}

export const useTideTimer = (selectedPort: Port | null) => {
    const { getHauteurAt, findNextCrossing, getClosestTide, loading, error } = useTideData();

    // Constants for calculation
    const TIRANT_EAU_BATEAU = 0.4; // Tirant d'eau du bateau (40cm)
    const MARGE_SECURITE = 0.2; // Marge de sécurité (20cm)
    const SEUIL_PROFONDEUR = TIRANT_EAU_BATEAU + MARGE_SECURITE; // 0.6m total

    // Get current date and time
    const now = new Date();
    const currentDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Get current tide
    const currentTide = useMemo(() => {
        return getClosestTide(currentDate, currentTime);
    }, [getClosestTide, currentDate, currentTime]);

    const timerState = useMemo((): TimerState => {
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

        // Hauteur de la cale du port (référence zéro) - NÉGATIVE (ex: -2m)
        const hauteurCalePort = parseFloat(selectedPort.hauteurCale || '-1.5');
        
        // Profondeur absolue de la cale (valeur positive)
        const profondeurCaleAbsolue = Math.abs(hauteurCalePort);

        // Hauteur absolue de l'eau à cet instant
        const hauteurEauActuelle = currentTide.hauteur;

        // Seuil de hauteur d'eau requise = profondeur cale + tirant eau + marge
        // Exemple : |-2m| + 0.6m = 2.6m minimum d'eau
        const seuilHauteur = profondeurCaleAbsolue + SEUIL_PROFONDEUR;

        // Profondeur réelle disponible = hauteur eau - hauteur cale
        // Si hauteur cale = -2m et hauteur eau = 2.837m : profondeur = 2.837 - (-2) = 4.837m
        const profondeurActuelle = hauteurEauActuelle - hauteurCalePort;

        // Check if accessible now
        // Accessible si hauteur eau >= seuil hauteur
        const isAccessibleNow = hauteurEauActuelle >= seuilHauteur;

        // Find next crossing of threshold
        const crossingUp = findNextCrossing(currentDate, currentTime, seuilHauteur, 'up');
        const crossingDown = findNextCrossing(currentDate, currentTime, seuilHauteur, 'down');

        let phase: 'waiting' | 'available';
        let targetCrossing: { heure: string; hauteur: number } | null;
        let messagePrefix: string;

        if (isAccessibleNow) {
            // Currently accessible - show time until must leave
            phase = 'available';
            targetCrossing = crossingDown; // Find when it drops below threshold
            messagePrefix = 'Temps restant avant de devoir quitter';
        } else {
            // Currently not accessible - show time until can leave
            phase = 'waiting';
            targetCrossing = crossingUp; // Find when it rises above threshold
            messagePrefix = 'Délai avant d\'accéder au port';
        }

        if (!targetCrossing) {
            // Not found today, shouldn't happen in normal cases
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

        // Calculate delay until event
        const [targetH, targetM] = targetCrossing.heure.split(':').map(Number);
        const [currentH, currentM] = currentTime.split(':').map(Number);
        const targetTotalMin = targetH * 60 + targetM;
        const currentTotalMin = currentH * 60 + currentM;

        let delaiMinutes = targetTotalMin - currentTotalMin;
        if (delaiMinutes < 0) {
            delaiMinutes += 24 * 60; // Next day (shouldn't happen in normal case)
        }

        const delaiHeures = Math.floor(delaiMinutes / 60);
        const delaiMins = delaiMinutes % 60;
        const delaiString = `${String(delaiHeures).padStart(2, '0')}:${String(delaiMins).padStart(2, '0')}`;

        // Build recommendation message
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
    }, [currentTide, selectedPort, getHauteurAt, findNextCrossing, currentDate, currentTime]);

    return {
        ...timerState,
        loading,
        error,
        currentDate,
        currentTime,
        currentTide
    };
};

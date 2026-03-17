import React, { useMemo } from 'react';
import { useTideData } from '../hooks/useTideData';
import { usePortContext } from '../context/PortContext';

export const SafetyStatus: React.FC = () => {
    const { getClosestTide, loading, error } = useTideData();
    const { selectedPort } = usePortContext();

    // Get current date and time
    const now = new Date();
    const currentDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Get current tide
    const currentTide = useMemo(() => {
        return getClosestTide(currentDate, currentTime);
    }, [getClosestTide, currentDate, currentTime]);

    const { hauteurActuelle, tirantDEau, margeSecurity, statut, couleur } = useMemo(() => {
        if (!currentTide) {
            return {
                hauteurActuelle: 0,
                tirantDEau: 0.4,
                margeSecurity: 0,
                statut: 'Inconnue',
                couleur: 'gray'
            };
        }

        const hauteur = currentTide.hauteur;
        const tirant = 0.4;
        const marge = hauteur - tirant;

        let status = 'Sûre';
        let color = 'green';

        if (marge < 0.3) {
            status = 'Danger';
            color = 'red';
        } else if (marge < 0.6) {
            status = 'Attention';
            color = 'yellow';
        }

        return {
            hauteurActuelle: hauteur,
            tirantDEau: tirant,
            margeSecurity: marge,
            statut: status,
            couleur: color
        };
    }, [currentTide, selectedPort]);

    if (loading) {
        return (
            <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 flex items-center justify-center">
                <span className="text-on-surface-variant">Chargement du statut...</span>
            </div>
        );
    }

    if (error || !currentTide) {
        return (
            <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 flex items-center justify-center">
                <span className="text-red-500">Erreur: Données indisponibles</span>
            </div>
        );
    }

    const bgColor = couleur === 'green' ? 'bg-green-100' : couleur === 'yellow' ? 'bg-yellow-100' : 'bg-red-100';
    const textColor = couleur === 'green' ? 'text-green-700' : couleur === 'yellow' ? 'text-yellow-700' : 'text-red-700';
    const icon = couleur === 'green' ? 'check_circle' : couleur === 'yellow' ? 'warning' : 'error';

    return (
        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${textColor}`} data-icon={icon}>{icon}</span>
                </div>
                <div>
                    <h4 className="font-headline font-bold text-primary">Statut: {statut}</h4>
                    <p className="text-xs text-on-surface-variant">Hauteur d'eau sous quille : {hauteurActuelle.toFixed(2)}m</p>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-3 bg-surface rounded-lg">
                    <span className="text-on-surface-variant">Tirant d'eau actuel</span>
                    <span className="font-bold text-primary">{tirantDEau.toFixed(2)}m</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-surface rounded-lg">
                    <span className="text-on-surface-variant">Marge de sécurité</span>
                    <span className={`font-bold ${couleur === 'green' ? 'text-green-700' : couleur === 'yellow' ? 'text-yellow-700' : 'text-red-700'}`}>
                        {margeSecurity.toFixed(2)}m
                    </span>
                </div>
            </div>
        </div>
    );
};
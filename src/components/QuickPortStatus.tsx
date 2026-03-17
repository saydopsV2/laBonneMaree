import React, { useMemo } from 'react';
import { useTideData } from '../hooks/useTideData';
import { usePortContext } from '../context/PortContext';

export const QuickPortStatus: React.FC = () => {
    const { selectedPort } = usePortContext();
    const { getClosestTide } = useTideData();

    // Constants
    const TIRANT_EAU_BATEAU = 0.4;
    const MARGE_SECURITE = 0.2;
    const PROFONDEUR_REQUISE = TIRANT_EAU_BATEAU + MARGE_SECURITE;

    // Get current date and time
    const now = new Date();
    const currentDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Get current tide
    const currentTide = useMemo(() => {
        return getClosestTide(currentDate, currentTime);
    }, [getClosestTide, currentDate, currentTime]);

    // Calculate status
    const status = useMemo(() => {
        if (!currentTide || !selectedPort) {
            return { profondeur: 0, isAccessible: false, percentage: 0 };
        }

        const hauteurCale = parseFloat(selectedPort.hauteurCale) || -1.5;
        const hauteurEau = currentTide.hauteur;
        const profondeur = hauteurEau - hauteurCale;
        const isAccessible = profondeur >= PROFONDEUR_REQUISE;
        const percentage = Math.min((profondeur / (PROFONDEUR_REQUISE * 2)) * 100, 100);

        return { profondeur, isAccessible, percentage };
    }, [currentTide, selectedPort]);

    return (
        <div className="md:col-span-4 bg-surface-container-low p-6 rounded-xl flex flex-col justify-between">
            <div>
                <h3 className="font-headline text-xl font-bold text-primary mb-1">{selectedPort?.ville || 'Arcachon'}</h3>
                <p className="text-xs text-on-surface-variant font-label mb-4">{selectedPort?.endroit}</p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-outline font-label uppercase">Profondeur Disponible</span>
                        <span className={`font-headline font-bold text-lg ${status.isAccessible ? 'text-green-500' : 'text-orange-500'}`}>
                            {status.profondeur.toFixed(2)}m
                        </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all ${status.isAccessible ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-orange-500 to-yellow-400'}`}
                            style={{ width: `${Math.max(status.percentage, 5)}%` }}>
                        </div>
                    </div>
                    <div className="">
                        <p className="text-xs text-on-surface-variant mb-2">
                            Requis: {PROFONDEUR_REQUISE.toFixed(2)}m (tirant {TIRANT_EAU_BATEAU}m + marge {MARGE_SECURITE}m)
                        </p>
                        <div className="flex items-center gap-2">
                            <span className={`material-symbols-outlined text-sm ${status.isAccessible ? 'text-green-500' : 'text-orange-500'}`}>
                                {status.isAccessible ? 'check_circle' : 'info'}
                            </span>
                            <span className={`text-xs font-semibold uppercase ${status.isAccessible ? 'text-green-500' : 'text-orange-500'}`}>
                                {status.isAccessible ? '✓ Accessible maintenant' : '⏳ Non accessible'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <button className="mt-6 border border-outline-variant/30 py-3 rounded-lg text-sm font-semibold text-primary hover:bg-surface-container-high transition-colors cursor-pointer w-full">
                Détails complets
            </button>
        </div>
    );
};
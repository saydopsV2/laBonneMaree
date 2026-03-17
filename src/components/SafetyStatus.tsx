import React from 'react';

export const SafetyStatus: React.FC = () => {
    return (
        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-700" data-icon="check_circle">check_circle</span>
                </div>
                <div>
                    <h4 className="font-headline font-bold text-primary">Statut: Sûre</h4>
                    <p className="text-xs text-on-surface-variant"> Hauteur d'eau sous quille : 2.1m</p>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-3 bg-surface rounded-lg">
                    <span className="text-on-surface-variant">Tirant d'eau actuel</span>
                    <span className="font-bold text-primary">2.10m</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-surface rounded-lg">
                    <span className="text-on-surface-variant">Marge de sécurité</span>
                    <span className="font-bold text-primary">0.50m</span>
                </div>
            </div>
        </div>
    );
};
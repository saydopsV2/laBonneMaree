import React from 'react';
import type { Port } from '../types';

interface PortSelectionModalProps {
    port: Port | null;
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const PortSelectionModal: React.FC<PortSelectionModalProps> = ({
    port,
    isOpen,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen || !port) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
            <div className="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-outline-variant/10 animate-pop-in">
                <h3 className="font-headline text-2xl font-extrabold text-primary mb-2">
                    Port sélectionné
                </h3>
                <p className="text-on-surface-variant mb-6">
                    Voulez-vous consulter le dashboard pour{' '}
                    <span className="font-bold text-primary">{port.ville}</span> ?
                </p>

                <div className="bg-surface-container-high rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary mt-1">location_on</span>
                        <div>
                            <p className="font-bold text-primary">{port.ville}</p>
                            <p className="text-sm text-on-surface-variant">{port.endroit}</p>
                            <p className="text-sm text-on-surface-variant mt-2">
                                Hauteur d'eau: <span className="font-semibold text-primary">{port.hauteurCale}m</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 rounded-lg border border-outline-variant/20 text-on-surface font-semibold hover:bg-surface-container-high transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity"
                    >
                        Consulter
                    </button>
                </div>
            </div>
        </div>
    );
};

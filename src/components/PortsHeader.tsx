import React from 'react';

interface PortsHeaderProps {
    onToggleMap: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const PortsHeader: React.FC<PortsHeaderProps> = ({ onToggleMap, searchTerm, onSearchChange }) => {
    return (
        <>
            {/* Title & Toggle Section */}
            <div className="flex justify-between items-end mb-8">
                <div className="space-y-1">
                    <span className="font-label text-xs uppercase tracking-widest text-outline">Exploration</span>
                    <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">Recherche de Port</h2>
                </div>
                <button 
                    onClick={onToggleMap}
                    className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-2 border border-outline-variant/15 hover:bg-surface-container-high transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">map</span>
                    <span className="font-label text-sm font-semibold">Carte</span>
                </button>
            </div>
            {/* Search Section */}
            <div className="relative mb-10">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">search</span>
                </div>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline/60 text-lg" 
                    placeholder="Rechercher un port, une marina..." 
                />
            </div>
        </>
    );
};
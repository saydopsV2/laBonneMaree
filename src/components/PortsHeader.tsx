import React, { useState } from 'react';
import type { Port } from '../types';

interface PortsHeaderProps {
    onToggleMap: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filteredPorts: Port[];
    onSelectPort: (port: Port) => void;
}

export const PortsHeader: React.FC<PortsHeaderProps> = ({ 
    onToggleMap, 
    searchTerm, 
    onSearchChange, 
    filteredPorts,
    onSelectPort 
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
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
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline/60 text-lg z-10 relative" 
                    placeholder="Rechercher un port, une marina..." 
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && searchTerm.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-lg z-20 max-h-96 overflow-y-auto">
                        {filteredPorts.length > 0 ? (
                            <ul className="divide-y divide-outline-variant/10">
                                {filteredPorts.slice(0, 8).map((port, index) => (
                                    <li key={`${port.ville}-${index}`}>
                                        <button
                                            onClick={() => {
                                                onSelectPort(port);
                                                setShowSuggestions(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors flex items-start gap-3"
                                        >
                                            <span className="material-symbols-outlined text-secondary mt-0.5 flex-shrink-0">location_on</span>
                                            <div>
                                                <p className="font-bold text-primary">{port.ville}</p>
                                                <p className="text-sm text-on-surface-variant">{port.endroit}</p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-4 py-6 text-center text-on-surface-variant">
                                Aucun port trouvé pour "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
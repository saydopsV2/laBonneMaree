import React from 'react';
import { PortsHeader } from './PortsHeader';
import { FeaturedPortCard } from './FeaturedPortCard';
import { QuickPortStatus } from './QuickPortStatus';
import { PortRowItem } from './PortRowItem';
import { MapTeaser } from './MapTeaser';
import { usePorts } from '../hooks/usePorts';

export const PortsMain: React.FC = () => {
    const { ports, loading, error } = usePorts();

    const handleToggleMap = () => {
        console.log("Toggle Map clicked");
    };

    if (loading) return <div className="p-4 text-center">Chargement des ports...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Erreur: {error}</div>;

    return (
        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full pb-24">
            <PortsHeader onToggleMap={handleToggleMap} />
            
            {/* Port Grid (Asymmetric Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <FeaturedPortCard />
                <QuickPortStatus />
                
                {ports.map((port, index) => (
                    <PortRowItem 
                        key={`${port.ville}-${index}`}
                        name={port.ville}
                        distance={port.endroit}
                        coefficient={0} // Donnée non disponible dans le fichier
                        level={`${port.hauteur}m`}
                        status="Stable" // Donnée non disponible
                        imgSrc="https://images.unsplash.com/photo-1569263979104-565b63485f78?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" // Image par défaut
                    />
                ))}
            </div>

            <MapTeaser />
        </main>
    );
};
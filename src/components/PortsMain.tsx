import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortsHeader } from './PortsHeader';
import { FeaturedPortCard } from './FeaturedPortCard';
import { QuickPortStatus } from './QuickPortStatus';
import { PortRowItem } from './PortRowItem';
import { MapTeaser } from './MapTeaser';
import { PortSelectionModal } from './PortSelectionModal';
import { usePortContext } from '../context/PortContext';
import { useNotification } from '../context/NotificationContext';
import type { Port } from '../types';

export const PortsMain: React.FC = () => {
    const { ports, loading, error, setSelectedPort } = usePortContext();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingPort, setPendingPort] = useState<Port | null>(null);

    const handleToggleMap = () => {
        console.log("Toggle Map clicked");
    };

    const handlePortSelect = (port: Port) => {
        setPendingPort(port);
    };

    const handleConfirmPort = () => {
        if (pendingPort) {
            setSelectedPort(pendingPort);
            showNotification(
                `Port ${pendingPort.ville} sélectionné avec succès`,
                'success',
                3000
            );
            setPendingPort(null);
            navigate('/');
        }
    };

    const handleCancelPort = () => {
        setPendingPort(null);
    };

    if (loading) return <div className="p-4 text-center">Chargement des ports...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Erreur: {error}</div>;

    const filteredPorts = ports.filter(port => 
        port.ville.toLowerCase().includes(searchTerm.toLowerCase()) || 
        port.endroit.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full pb-24">
            <PortSelectionModal 
                port={pendingPort}
                isOpen={pendingPort !== null}
                onConfirm={handleConfirmPort}
                onCancel={handleCancelPort}
            />
            
            <PortsHeader 
                onToggleMap={handleToggleMap}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filteredPorts={filteredPorts}
                onSelectPort={handlePortSelect}
            />
            
            {/* Port Grid (Asymmetric Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <FeaturedPortCard />
                <QuickPortStatus />
                
                {filteredPorts.map((port, index) => (
                    <PortRowItem 
                        key={`${port.ville}-${index}`}
                        name={port.ville}
                        distance={port.endroit}
                        coefficient={0}
                        level={`${port.hauteurCale}m`}
                        status="Stable"
                        imgSrc="https://images.unsplash.com/photo-1569263979104-565b63485f78?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                        onClick={() => handlePortSelect(port)}
                    />
                ))}
                {filteredPorts.length === 0 && (
                    <div className="md:col-span-12 text-center p-8 text-on-surface-variant">
                        Aucun port trouvé pour "{searchTerm}"
                    </div>
                )}
            </div>

            <MapTeaser />
        </main>
    );
};
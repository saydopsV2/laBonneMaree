import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Port } from '../types';

interface PortContextType {
    selectedPort: Port | null;
    setSelectedPort: (port: Port) => void;
    ports: Port[];
    loading: boolean;
    error: string | null;
}

const PortContext = createContext<PortContextType | undefined>(undefined);

export const PortProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ports, setPorts] = useState<Port[]>([]);
    const [selectedPort, setSelectedPort] = useState<Port | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPorts = async () => {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}ports.txt`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const text = await response.text();
                const lines = text.split('\n');
                const parsedPorts: Port[] = lines
                    .map(line => {
                        const parts = line.split(',');
                        if (parts.length >= 3) {
                            return {
                                ville: parts[0].trim(),
                                endroit: parts[1].trim(),
                                hauteurCale: parts[2].trim()
                            };
                        }
                        return null;
                    })
                    .filter((item): item is Port => item !== null);
                
                setPorts(parsedPorts);
                // Sélectionner le premier port par défaut
                if (parsedPorts.length > 0) {
                    setSelectedPort(parsedPorts[0]);
                }
            } catch (err) {
                console.error("Error fetching ports in Context:", err);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchPorts();
    }, []);

    return (
        <PortContext.Provider value={{ selectedPort, setSelectedPort, ports, loading, error }}>
            {children}
        </PortContext.Provider>
    );
};

export const usePortContext = () => {
    const context = useContext(PortContext);
    if (!context) {
        throw new Error('usePortContext must be used within a PortProvider');
    }
    return context;
};

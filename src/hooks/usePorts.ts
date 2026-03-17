import { useState, useEffect } from 'react';

export interface Port {
    ville: string;
    endroit: string;
    hauteur: string;
}

export const usePorts = () => {
    const [ports, setPorts] = useState<Port[]>([]);
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
                                hauteur: parts[2].trim()
                            };
                        }
                        return null;
                    })
                    .filter((item): item is Port => item !== null);
                setPorts(parsedPorts);
            } catch (err) {
                console.error("Error fetching ports:", err);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchPorts();
    }, []);

    return { ports, loading, error };
};

import React, { useMemo } from 'react';
import { usePorts } from '../hooks/usePorts';

export const LocationCard: React.FC = () => {
    const { ports, loading, error } = usePorts();

    // Use useMemo to avoid recalculating the first port on every render if ports hasn't changed.
    const currentPort = useMemo(() => {
        return ports.length > 0 ? ports[0] : null;
    }, [ports]);

    if (loading) {
        return (
            <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <p>Chargement des données du port...</p>
            </div>
        );
    }
    
    if (error) {
        return (
              <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <p className="text-red-500">Erreur lors du chargement des ports : {error}</p>
            </div>
        );
    }

    if (!currentPort) {
        return (
            <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10">
                <p>Aucun port trouvé.</p>
            </div>
        );
    }

    return (
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6">
                <span className="font-label text-xs font-bold uppercase tracking-widest text-outline mb-4 block">Port d'escale actuel</span>
                <h3 className="font-headline text-2xl font-extrabold text-primary mb-2">{currentPort.ville}, France</h3>
                <p className="text-sm text-on-surface-variant mb-6">{currentPort.endroit}</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-outline uppercase">Hauteur d'eau</span>
                        <span className="font-bold text-primary">{currentPort.hauteur}m</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-outline uppercase">Visibilité</span>
                        <span className="font-bold text-primary">8.2 NM</span>
                    </div>
                </div>
            </div>
            <div className="md:w-1/2 min-h-[150px] bg-surface-container-high relative">
                <img 
                    className="w-full h-full object-cover grayscale opacity-60" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG7wrtKCgGYowAeW4BRSOl2zqzAelcm--YZkqG7tKuCj9uWU3E2pvAo321hVYVR6t_X9O3xiKxTaYKst2cL9F3OTq9JHxMlNX5paEmju1U_38PaduADY3rFkFDpQaxaqbpjeKqo1yxR_oorlY9L9WrCvWj6LQ1UYYkEPXXQV9oYY2zzhxzIi13GI3uyemrGaAaJzF6eCRqxdut5D7-QmF9auu611oY4rWPJe-TfWC4UEGTLvBaHm4PtGYUYlDS3zheGtKH8spJgCo"
                    alt={`Vue du port de ${currentPort.ville}`}
                />
            </div>
        </div>
    );
};
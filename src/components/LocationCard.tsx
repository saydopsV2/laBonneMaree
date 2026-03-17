import React from 'react';

export const LocationCard: React.FC = () => {
    return (
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6">
                <span className="font-label text-xs font-bold uppercase tracking-widest text-outline mb-4 block">Port d'escale actuel</span>
                <h3 className="font-headline text-2xl font-extrabold text-primary mb-2">Port d'Arcachon, France</h3>
                <p className="text-sm text-on-surface-variant mb-6">Port d'escale actuel</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-outline uppercase">Vent</span>
                        <span className="font-bold text-primary">12 knots NW</span>
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
                    data-alt="Nautical chart showing coastal entrance details" 
                    data-location="Arcachon, France" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAG7wrtKCgGYowAeW4BRSOl2zqzAelcm--YZkqG7tKuCj9uWU3E2pvAo321hVYVR6t_X9O3xiKxTaYKst2cL9F3OTq9JHxMlNX5paEmju1U_38PaduADY3rFkFDpQaxaqbpjeKqo1yxR_oorlY9L9WrCvWj6LQ1UYYkEPXXQV9oYY2zzhxzIi13GI3uyemrGaAaJzF6eCRqxdut5D7-QmF9auu611oY4rWPJe-TfWC4UEGTLvBaHm4PtGYUYlDS3zheGtKH8spJgCo"
                    alt="Nautical chart showing coastal entrance details"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-4 border-white bg-primary shadow-xl"></div>
                </div>
            </div>
        </div>
    );
};
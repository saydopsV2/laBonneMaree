import React from 'react';

export const MapTeaser: React.FC = () => {
    return (
        <div className="mt-12 rounded-2xl h-48 relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-primary/40 z-10 group-hover:bg-primary/20 transition-colors"></div>
            <img 
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                data-alt="Nautical map background with grid lines" 
                data-location="French Riviera" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHBXs7Ms9JKV-smT6DWw-pzIoDozy0yKo7Ci5iu4xfQ7pBaXQtfBWd1ctVtHCznu6K-NEEV2RF3zNytt1qZM4Fo0WNzgLLby9JyhRloB22Im01ROpGkqMlPzbhGGArl2LBPl12Dv5yQKXz2QOTDP4-6cxdik5jVknG32Vr6sGTZiitVqwX8P-J4gQIme-mHJiUYAq8TrHkB96fSmFE3CV3-u-clxv8_rRswqeDVa_OBUOHpcQMt3awCeSQeZIcJ1oOqpg3fiSTuh8" 
                alt="Map Background"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-on-primary text-center p-6">
                <h3 className="font-headline text-2xl font-bold mb-2">Explorer la côte sur la carte</h3>
                <p className="text-sm opacity-80 font-label max-w-xs">Visualisez les courants et les ports en temps réel sur une interface cartographique précise.</p>
                <div className="mt-4 bg-on-primary text-primary px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg transform group-hover:scale-105 transition-transform">
                    Ouvrir la Carte
                </div>
            </div>
        </div>
    );
};
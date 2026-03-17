import React from 'react';
import { PortsHeader } from './PortsHeader';
import { FeaturedPortCard } from './FeaturedPortCard';
import { QuickPortStatus } from './QuickPortStatus';
import { PortRowItem } from './PortRowItem';
import { PortGridItem } from './PortGridItem';
import { MapTeaser } from './MapTeaser';

export const PortsMain: React.FC = () => {
    const handleToggleMap = () => {
        console.log("Toggle Map clicked");
    };

    return (
        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full pb-24">
            <PortsHeader onToggleMap={handleToggleMap} />
            
            {/* Port Grid (Asymmetric Bento Style) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <FeaturedPortCard />
                <QuickPortStatus />
                
                {/* List Row: Antibes */}
                <PortRowItem 
                    name="Ares"
                    distance="À 12.4 nm de votre position"
                    coefficient={82}
                    level="2.45m"
                    status="Rising"
                    imgSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuD7io_dhlHZ4ZXsX0tT5FbrYQiAxyvDTTJ_cGSyslh82elj-vC-eDs2hXq46gtdjAvd6gS1RD7v4XTgoxczNcncVBhzHxbxNZcz2nsGWjfhfuvTLQYjWsaBRbvv7JhF-OjYGh0sEGhDm5NrX0isfsRPvlYBM8-qVV6xHGfiSu1QxBXyArcnwbHlkaXVGaBc1DjniX51WNectjJf0z5Q7J7A6l90VC6wVqvIcGYZ-EArTkhttHDEkGfF9NC9Dto79ywmA7Sq94t8Rzo"
                />

                
                <PortGridItem 
                    name="L'Herbe"
                    location="Cap Ferret, France"
                    warning={true}
                    level="0.9m"
                    status="Low Tide soon"
                    nextEventTime="17:15"
                    nextEventLabel="Basse Mer"
                />

                
                <PortGridItem 
                    name="La Teste-de-Buch"
                    location="La Teste-de-Buch, France"
                    level="3.1m"
                    status="Rising"
                    nextEventTime="21:05"
                    nextEventLabel="Pleine Mer"
                />
            </div>

            <MapTeaser />
        </main>
    );
};
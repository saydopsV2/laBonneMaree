import React from 'react';
import { TideHeader } from './TideHeader';
import { TideGraph } from './TideGraph';
import { TideEvents } from './TideEvents';
import { WeatherCard } from './WeatherCard';
import { DeepDataRow } from './DeepDataRow';

export const TideMain: React.FC = () => {
    return (
        <main className="max-w-5xl mx-auto px-6 py-8 pb-32">
            {/* Editorial Header Section */}
            <TideHeader />
            
            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Hero Instrument: The Tide Curve Graph */}
                <TideGraph />
                
                {/* Secondary Instrument: Navigation Controls */}
                <div className="md:col-span-4 space-y-6">
                    {/* Tide Table Card */}
                    <TideEvents />
                    
                    {/* Environmental Data Bento Card */}
                    <WeatherCard />
                </div>
                
                {/* Deep Data Visualization Row */}
                <DeepDataRow />
            </div>
        </main>
    );
};
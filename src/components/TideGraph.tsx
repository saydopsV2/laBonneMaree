import React, { useMemo, useState, useEffect } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    AreaChart,
} from 'recharts';
import { useTideData } from '../hooks/useTideData';
import { usePortContext } from '../context/PortContext';

export const TideGraph: React.FC = () => {
    const { entries, events, loading, error } = useTideData();
    const { selectedPort } = usePortContext();
    const [currentLevel, setCurrentLevel] = useState(4.12);
    const [currentTime, setCurrentTime] = useState('12:00');
    
    // Paramètres pour le calcul de la limite de tirant d'eau
    const hauteurCale = selectedPort ? parseFloat(selectedPort.hauteurCale) : 0.0; // Hauteur de cale du port sélectionné
    const tirantDeau = 0.40; // Tirant d'eau du bateau (40cm)
    const marge = 0.20; // Marge de sécurité (20cm)
    const limiteTirantDeau = Math.abs(hauteurCale) + tirantDeau + marge;

    // Get today's data
    const todayData = useMemo(() => {
        if (entries.length === 0) return [];

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const todayFormatted = `${day}/${month}/${year}`;

        const todayEntries = entries
            .filter(entry => entry.date === todayFormatted)
            .map(entry => ({
                heure: entry.heure,
                hauteur: entry.hauteur,
                heureNum: parseInt(entry.heure.split(':')[0]) + parseInt(entry.heure.split(':')[1]) / 60,
            }))
            .sort((a, b) => a.heureNum - b.heureNum);

        return todayEntries;
    }, [entries]);

    // Get today's events
    const todayEvents = useMemo(() => {
        if (events.length === 0) return { hautesMers: [], bassesMers: [] };

        const today = new Date();
        const todayFormatted = today.toISOString().split('T')[0]; // Format YYYY-MM-DD for events
        const filtered = events.filter(e => e.date === todayFormatted);

        return {
            hautesMers: filtered.filter(e => e.type === 'Haute Mer'),
            bassesMers: filtered.filter(e => e.type === 'Basse Mer'),
        };
    }, [events]);

    // Update current time and level
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);

            // Find closest data point for current level
            if (todayData.length > 0) {
                const currentHourNum = now.getHours() + now.getMinutes() / 60;
                let closest = todayData[0];
                let minDiff = Math.abs(closest.heureNum - currentHourNum);

                for (const point of todayData) {
                    const diff = Math.abs(point.heureNum - currentHourNum);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closest = point;
                    }
                }
                setCurrentLevel(closest.hauteur);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [todayData]);

    if (loading) {
        return (
            <div className="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden relative border border-transparent p-8">
                <p className="text-on-surface-variant">Chargement des données...</p>
            </div>
        );
    }

    if (error || todayData.length === 0) {
        return (
            <div className="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden relative border border-transparent p-8">
                <p className="text-error font-bold mb-2">Erreur</p>
                <p className="text-on-surface-variant">
                    {error || 'Aucune donnée de marée disponible pour aujourd\'hui'}
                </p>
            </div>
        );
    }

    const nextHauteMer = todayEvents.hautesMers[0];
    const nextBasseMer = todayEvents.bassesMers[0];

    return (
        <div className="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden relative border border-transparent">
            <div className="p-4 pb-0">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="font-headline text-xl font-bold text-primary">Courbe Journalière</h2>
                        <p className="text-sm text-on-surface-variant">
                            {new Date().toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="font-label text-xs uppercase tracking-widest text-outline block mb-1">
                            Niveau Actuel
                        </span>
                        <span className="font-headline text-4xl font-extrabold text-primary">
                            {currentLevel.toFixed(2)}m
                        </span>
                        <span className="font-label text-xs text-on-surface-variant">à {currentTime}</span>
                    </div>
                </div>
            </div>

            {/* Graph Chart */}
            <div className="relative w-full h-[350px] px-4 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={todayData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorHauteur" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ca1eb" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#001e40" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#c3c6d1"
                            opacity={0.3}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="heure"
                            tick={{ fontSize: 11, fill: '#737780', fontFamily: 'Inter' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e1e3e4' }}
                            interval={Math.floor(todayData.length / 7)}
                        />
                        <YAxis
                            domain={['dataMin - 0.5', 'dataMax + 0.5']}
                            tick={{ fontSize: 11, fill: '#737780', fontFamily: 'Inter' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e1e3e4' }}
                            label={{ value: 'Hauteur (m)', angle: -90, position: 'insideLeft', fill: '#737780' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#f8f9fa',
                                border: '2px solid #001e40',
                                borderRadius: '8px',
                                fontFamily: 'Inter',
                            }}
                            formatter={(value) => {
                                if (typeof value === 'number') {
                                    return [value.toFixed(2) + ' m', 'Hauteur'];
                                }
                                return value;
                            }}
                            labelFormatter={(label) => `${label}`}
                        />

                        {/* Limite de tirant d'eau (sécurité) */}
                        {todayData.length > 0 && (
                            <ReferenceLine
                                y={limiteTirantDeau}
                                stroke="#a63500"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                label={{
                                    value: `${limiteTirantDeau.toFixed(2)}m`,
                                    position: 'left',
                                    fill: '#a63500',
                                    fontSize: 10,
                                    fontWeight: 'bold',
                                    offset: 10,
                                }}
                            />
                        )}

                        <Area
                            type="monotone"
                            dataKey="hauteur"
                            stroke="#001e40"
                            strokeWidth={3}
                            fill="url(#colorHauteur)"
                            dot={false}
                            isAnimationActive={true}
                            animationDuration={800}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Events Info Row */}
            <div className="grid grid-cols-2 gap-4 px-8 py-6 bg-surface-container-high/30">
                {/* Prochaine Haute Mer */}
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                        </div>
                    </div>
                    <div>
                        <p className="font-label text-[10px] font-bold uppercase text-outline">Pleine Mer</p>
                        {nextHauteMer ? (
                            <p className="font-headline text-sm font-extrabold text-primary">
                                {nextHauteMer.heure} - {nextHauteMer.hauteur.toFixed(2)}m
                            </p>
                        ) : (
                            <p className="font-headline text-sm text-on-surface-variant">Pas d'événement</p>
                        )}
                    </div>
                </div>

                {/* Prochaine Basse Mer */}
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary/20">
                            <div className="h-3 w-3 rounded-full bg-secondary"></div>
                        </div>
                    </div>
                    <div>
                        <p className="font-label text-[10px] font-bold uppercase text-outline">Basse Mer</p>
                        {nextBasseMer ? (
                            <p className="font-headline text-sm font-extrabold text-secondary">
                                {nextBasseMer.heure} - {nextBasseMer.hauteur.toFixed(2)}m
                            </p>
                        ) : (
                            <p className="font-headline text-sm text-on-surface-variant">Pas d'événement</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
import { useEffect, useState } from 'react';
import { useTideTimer } from '../hooks/useTideTimer';
import type { Port } from '../types';

interface PortTimerBadgeProps {
    port: Port | null;
    size?: 'small' | 'medium'; // small for PortRowItem, medium for FeaturedPortCard
}

export const PortTimerBadge = ({ port, size = 'small' }: PortTimerBadgeProps) => {
    const { delai, phase, isAccessible } = useTideTimer(port);
    const [displayDelai, setDisplayDelai] = useState(delai);

    // Update every second for HeroCountdown-like real-time feedback
    useEffect(() => {
        setDisplayDelai(delai);
        
        // For real-time updates, we'd need to recalculate
        // But since useTideTimer uses static currentTime, we need another approach
        // For now, update when delai changes
    }, [delai]);

    // Determine color based on accessibility
    const bgColor = isAccessible 
        ? 'bg-green-500/20 border-green-500/30 text-green-700' 
        : 'bg-orange-500/20 border-orange-500/30 text-orange-700';

    const phaseIcon = phase === 'waiting' 
        ? 'hourglass_top' 
        : 'hourglass_bottom';

    const phaseLabel = phase === 'waiting' 
        ? 'Attente' 
        : 'Limite';

    if (size === 'small') {
        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${bgColor} text-xs font-semibold`}>
                <span className="material-symbols-outlined text-xs">{phaseIcon}</span>
                <span>{displayDelai}</span>
                <span className="opacity-70">({phaseLabel})</span>
            </div>
        );
    }

    // Medium size for FeaturedPortCard
    return (
        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${bgColor}`}>
            <span className="material-symbols-outlined text-base">{phaseIcon}</span>
            <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider">{phaseLabel}</span>
                <span className="font-headline font-extrabold text-lg">{displayDelai}</span>
            </div>
        </div>
    );
};

import { useRealTimeTimer } from '../hooks/useRealTimeTimer';
import { usePortContext } from '../context/PortContext';

export const HeroCountdown = () => {
    const { selectedPort } = usePortContext();
    const {
        delai,
        heureEvenement,
        phase,
        profondeurActuelle,
        seuilProfondeur,
        seuilHauteur,
        messageRecommandation,
        loading,
        error,
        currentTide
    } = useRealTimeTimer(selectedPort);

    if (loading) {
        return (
            <div className="md:col-span-8 overflow-hidden rounded-xl ocean-gradient relative text-white p-8 min-h-[400px] flex flex-col justify-center items-center shadow-xl">
                <span className="text-primary-fixed">Calculation des conditions d'accès...</span>
            </div>
        );
    }

    if (error || !currentTide) {
        return (
            <div className="md:col-span-8 overflow-hidden rounded-xl ocean-gradient relative text-white p-8 min-h-[400px] flex flex-col justify-center items-center shadow-xl">
                <span className="text-red-300">Données de marée indisponibles</span>
            </div>
        );
    }

    return (
        <div className="md:col-span-8 overflow-hidden rounded-xl ocean-gradient relative text-white p-8 min-h-[400px] flex flex-col justify-between shadow-xl">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                <svg className="w-full h-full stroke-white fill-none stroke-[0.5]" viewBox="0 0 100 100">
                    <circle cx="100" cy="0" r="40" />
                    <circle cx="100" cy="0" r="60" />
                    <circle cx="100" cy="0" r="80" />
                    <line x1="100" x2="0" y1="0" y2="100" />
                </svg>
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 text-primary-fixed mb-6">
                    <span className="material-symbols-outlined">timer</span>
                    <span className="font-label text-sm font-bold tracking-widest uppercase">
                        {phase === 'waiting' ? 'Délai avant accès' : 'Temps before quitting'}
                    </span>
                </div>
                <div className="flex items-baseline gap-4">
                    <span className="font-headline text-8xl font-black tracking-tighter">{delai}</span>
                    <span className="font-headline text-2xl font-bold text-primary-fixed opacity-70">HRS</span>
                </div>
                <p className="mt-4 text-primary-fixed max-w-xs text-lg font-medium">
                    {phase === 'waiting' 
                        ? <>L'entrée du port <strong>{selectedPort?.ville || 'Arcachon'}, {selectedPort?.endroit}</strong> sera accessible à <strong>{heureEvenement} HRS</strong> (hauteur: {currentTide?.hauteur.toFixed(2)}m). {messageRecommandation}</> 
                        : <>Vous devrez quitter le port avant <strong>{heureEvenement} HRS</strong> (hauteur descendant à: {currentTide?.hauteur.toFixed(2)}m). {messageRecommandation}</>
                    }
                </p>
                
                {/* Détail du calcul */}
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-xs font-bold uppercase text-primary-fixed mb-3 tracking-widest">Détail du calcul</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-white/70">Hauteur eau (marée)</span>
                            <p className="font-bold text-lg">{currentTide?.hauteur.toFixed(2) || '--'}m</p>
                        </div>
                        <div>
                            <span className="text-white/70">Seuil hauteur requise</span>
                            <p className="font-bold text-lg text-cyan-300">{seuilHauteur.toFixed(2)}m</p>
                        </div>
                        <div>
                            <span className="text-white/70">Profondeur réelle à la cale</span>
                            <p className="font-bold text-lg text-yellow-300">{profondeurActuelle.toFixed(2)}m</p>
                        </div>
                        <div>
                            <span className="text-white/70">Tirant d'eau + Marge</span>
                            <p className="font-bold text-lg text-white">{seuilProfondeur.toFixed(2)}m (40cm + 20cm)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
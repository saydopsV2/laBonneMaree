import { useState, useEffect } from 'react';

interface TidePoint {
  date: Date;
  height: number;
  coefficient: number;
}

interface TideData {
  currentHeight: number;
  currentDepth: number;
  nextPM: { time: string; height: number };
  nextBM: { time: string; height: number };
  coefficient: number;
}

export function useTideData(portAltitude: number) {
  const [tideData, setTideData] = useState<TideData | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulation d'interpolation des données de marée
  const interpolateTideHeight = (now: Date): number => {
    // Simulation avec une courbe sinusoïdale pour la démo
    const hours = now.getHours() + now.getMinutes() / 60;
    const phase = (hours / 12) * Math.PI; // 2 marées par jour
    return 2.5 + 1.5 * Math.sin(phase); // Entre 1m et 4m
  };

  const getNextTides = (now: Date) => {
    // Simulation des prochaines marées
    const nextPMHour = Math.ceil(now.getHours() / 6) * 6;
    const nextBMHour = nextPMHour + 6;
    
    const nextPM = new Date(now);
    nextPM.setHours(nextPMHour, 0, 0, 0);
    
    const nextBM = new Date(now);
    nextBM.setHours(nextBMHour, 0, 0, 0);
    
    if (nextBM.getDate() !== now.getDate()) {
      nextBM.setDate(nextBM.getDate() + 1);
    }

    return {
      nextPM: {
        time: nextPM.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        height: 3.8
      },
      nextBM: {
        time: nextBM.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        height: 1.2
      }
    };
  };

  useEffect(() => {
    const updateTideData = () => {
      const now = new Date();
      const currentHeight = interpolateTideHeight(now);
      const currentDepth = Math.max(0, currentHeight + portAltitude);
      const { nextPM, nextBM } = getNextTides(now);
      
      setTideData({
        currentHeight,
        currentDepth,
        nextPM,
        nextBM,
        coefficient: 75 // Simulation
      });
      setLoading(false);
    };

    updateTideData();
    const interval = setInterval(updateTideData, 60000); // Mise à jour chaque minute

    return () => clearInterval(interval);
  }, [portAltitude]);

  return { tideData, loading };
} 
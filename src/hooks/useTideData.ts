import { useState, useEffect } from 'react';

export interface TideEntry {
    date: string;
    heure: string;
    hauteur: number;
    coef: number;
}

interface TideDataCache {
    entries: TideEntry[];
    loaded: boolean;
    error: string | null;
}

const cache: TideDataCache = {
    entries: [],
    loaded: false,
    error: null,
};

export const useTideData = () => {
    const [loading, setLoading] = useState(!cache.loaded);
    const [error, setError] = useState<string | null>(cache.error);
    const [entries, setEntries] = useState<TideEntry[]>(cache.entries);

    useEffect(() => {
        if (cache.loaded) {
            setLoading(false);
            setEntries(cache.entries);
            setError(cache.error);
            return;
        }

        const fetchTideData = async () => {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}maree_2026_heure.txt`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const text = await response.text();
                const lines = text.split('\n');
                
                const parsedEntries: TideEntry[] = lines
                    .slice(1) // Skip header
                    .map(line => {
                        const parts = line.split(',');
                        if (parts.length >= 4) {
                            return {
                                date: parts[0].trim(),
                                heure: parts[1].trim(),
                                hauteur: parseFloat(parts[2].trim()),
                                coef: parseInt(parts[3].trim())
                            };
                        }
                        return null;
                    })
                    .filter((item): item is TideEntry => item !== null);

                cache.entries = parsedEntries;
                cache.loaded = true;
                cache.error = null;
                
                setEntries(parsedEntries);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                cache.error = errorMessage;
                cache.loaded = true;
                
                setError(errorMessage);
                console.error("Error fetching tide data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTideData();
    }, []);

    /**
     * Get tide data for a specific time
     * @param date - Date in format DD/MM/YYYY (e.g., "17/03/2026")
     * @param heure - Time in format HH:MM (e.g., "14:30")
     * @returns Tide entry if found, or null
     */
    const getTideAtTime = (date: string, heure: string): TideEntry | null => {
        return entries.find(entry => entry.date === date && entry.heure === heure) || null;
    };

    /**
     * Get the closest tide data to a specific time
     * @param date - Date in format DD/MM/YYYY
     * @param heure - Time in format HH:MM
     * @returns Closest tide entry
     */
    const getClosestTide = (date: string, heure: string): TideEntry | null => {
        const targetEntriesForDate = entries.filter(entry => entry.date === date);
        
        if (targetEntriesForDate.length === 0) return null;

        const [targetHours, targetMinutes] = heure.split(':').map(Number);
        const targetTotalMinutes = targetHours * 60 + targetMinutes;

        let closest = targetEntriesForDate[0];
        let minDiff = Math.abs(
            (parseInt(closest.heure.split(':')[0]) * 60 + parseInt(closest.heure.split(':')[1])) - targetTotalMinutes
        );

        targetEntriesForDate.forEach(entry => {
            const [hours, minutes] = entry.heure.split(':').map(Number);
            const entryTotalMinutes = hours * 60 + minutes;
            const diff = Math.abs(entryTotalMinutes - targetTotalMinutes);
            
            if (diff < minDiff) {
                minDiff = diff;
                closest = entry;
            }
        });

        return closest;
    };

    /**
     * Get tides for a specific date
     * @param date - Date in format DD/MM/YYYY
     * @returns Array of entries for that date
     */
    const getTidesForDate = (date: string): TideEntry[] => {
        return entries.filter(entry => entry.date === date);
    };

    /**
     * Get tides between two times on a specific date
     * @param date - Date in format DD/MM/YYYY
     * @param startHeure - Start time in format HH:MM
     * @param endHeure - End time in format HH:MM
     * @returns Array of entries in the time range
     */
    const getTidesBetween = (date: string, startHeure: string, endHeure: string): TideEntry[] => {
        const [startHours, startMinutes] = startHeure.split(':').map(Number);
        const [endHours, endMinutes] = endHeure.split(':').map(Number);
        const startTotal = startHours * 60 + startMinutes;
        const endTotal = endHours * 60 + endMinutes;

        return entries.filter(entry => {
            if (entry.date !== date) return false;
            const [hours, minutes] = entry.heure.split(':').map(Number);
            const entryTotal = hours * 60 + minutes;
            return entryTotal >= startTotal && entryTotal <= endTotal;
        });
    };

    return {
        loading,
        error,
        entries,
        getTideAtTime,
        getClosestTide,
        getTidesForDate,
        getTidesBetween,
    };
};

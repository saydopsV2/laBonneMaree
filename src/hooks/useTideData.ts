import { useState, useEffect } from 'react';

export interface TideEntry {
    date: string;
    heure: string;
    hauteur: number;
    coef: number;
}

export interface TideEvent {
    date: string; // Format YYYY-MM-DD
    heure: string; // Format HH:MM
    type: 'Haute Mer' | 'Basse Mer';
    hauteur: number;
    coef: number;
}

interface TideDataCache {
    entries: TideEntry[];
    events: TideEvent[];
    loaded: boolean;
    error: string | null;
}

const cache: TideDataCache = {
    entries: [],
    events: [],
    loaded: false,
    error: null,
};

export const useTideData = () => {
    const [loading, setLoading] = useState(!cache.loaded);
    const [error, setError] = useState<string | null>(cache.error);
    const [entries, setEntries] = useState<TideEntry[]>(cache.entries);
    const [events, setEvents] = useState<TideEvent[]>(cache.events);

    useEffect(() => {
        if (cache.loaded) {
            setLoading(false);
            setEntries(cache.entries);
            setEvents(cache.events);
            setError(cache.error);
            return;
        }

        const fetchTideData = async () => {
            try {
                // Fetch detailed tide data (maree_2026_heure.txt)
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

                // Fetch tide events (marree.txt)
                const eventsResponse = await fetch(`${import.meta.env.BASE_URL}marree.txt`);
                if (!eventsResponse.ok) {
                    throw new Error(`HTTP error! status: ${eventsResponse.status}`);
                }
                const eventsText = await eventsResponse.text();
                const eventsLines = eventsText.split('\n');

                const parsedEvents: TideEvent[] = eventsLines
                    .slice(1) // Skip header
                    .map(line => {
                        const parts = line.split(',');
                        if (parts.length >= 4) {
                            return {
                                date: parts[0].trim(), // YYYY-MM-DD
                                heure: parts[1].trim(), // HH:MM
                                type: parts[2].trim() as 'Haute Mer' | 'Basse Mer',
                                hauteur: parseFloat(parts[3].trim()),
                                coef: parseInt(parts[4].trim())
                            };
                        }
                        return null;
                    })
                    .filter((item): item is TideEvent => item !== null);

                cache.entries = parsedEntries;
                cache.events = parsedEvents;
                cache.loaded = true;
                cache.error = null;
                
                setEntries(parsedEntries);
                setEvents(parsedEvents);
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

    /**
     * Get tide events (Basse/Haute Mer) for a specific date
     * @param date - Date in format DD/MM/YYYY
     * @returns Array of tide events for that day (max 4: 2 basses, 2 hautes)
     */
    const getTideEventsForDate = (date: string): TideEvent[] => {
        // Convert DD/MM/YYYY to YYYY-MM-DD for comparison
        const [day, month, year] = date.split('/');
        const isoDate = `${year}-${month}-${day}`;
        return events.filter(event => event.date === isoDate);
    };

    /**
     * Get the height at a specific time (with linear interpolation between known points)
     * @param date - Date in format DD/MM/YYYY
     * @param heure - Time in format HH:MM
     * @returns Interpolated height at that time, or null if date not found
     */
    const getHauteurAt = (date: string, heure: string): number | null => {
        const tideForDate = entries.filter(e => e.date === date);
        if (tideForDate.length === 0) return null;

        // Find exact match
        const exact = tideForDate.find(e => e.heure === heure);
        if (exact) return exact.hauteur;

        // Get the time in minutes
        const [targetHours, targetMinutes] = heure.split(':').map(Number);
        const targetTotalMinutes = targetHours * 60 + targetMinutes;

        // Find surrounding points for interpolation
        let before: TideEntry | null = null;
        let after: TideEntry | null = null;

        for (const entry of tideForDate) {
            const [h, m] = entry.heure.split(':').map(Number);
            const entryTotalMinutes = h * 60 + m;

            if (entryTotalMinutes <= targetTotalMinutes) {
                before = entry;
            }
            if (entryTotalMinutes >= targetTotalMinutes && !after) {
                after = entry;
            }
        }

        // Linear interpolation
        if (before && after) {
            const [beforeH, beforeM] = before.heure.split(':').map(Number);
            const [afterH, afterM] = after.heure.split(':').map(Number);
            const beforeTotalMinutes = beforeH * 60 + beforeM;
            const afterTotalMinutes = afterH * 60 + afterM;

            const ratio = (targetTotalMinutes - beforeTotalMinutes) / (afterTotalMinutes - beforeTotalMinutes);
            return before.hauteur + (after.hauteur - before.hauteur) * ratio;
        }

        return before?.hauteur ?? after?.hauteur ?? null;
    };

    /**
     * Find the next time when tide height crosses a threshold
     * @param date - Current date in format DD/MM/YYYY
     * @param heure - Current time in format HH:MM
     * @param seuil - Threshold height to cross
     * @param direction - 'up' to find crossing upward, 'down' to find crossing downward
     * @returns Object with time and height when crossing occurs, or null if not found today
     */
    const findNextCrossing = (
        date: string,
        heure: string,
        seuil: number,
        direction: 'up' | 'down'
    ): { heure: string; hauteur: number } | null => {
        const tideForDate = entries.filter(e => e.date === date);
        if (tideForDate.length === 0) return null;

        const [currentH, currentM] = heure.split(':').map(Number);
        const currentTotalMinutes = currentH * 60 + currentM;

        // Filter to only the times after current time
        const futureTides = tideForDate.filter(e => {
            const [h, m] = e.heure.split(':').map(Number);
            return h * 60 + m >= currentTotalMinutes;
        });

        if (futureTides.length < 2) return null;

        // Find the crossing
        for (let i = 0; i < futureTides.length - 1; i++) {
            const current = futureTides[i];
            const next = futureTides[i + 1];

            const currentCrossed = direction === 'up' ? current.hauteur < seuil && next.hauteur >= seuil : current.hauteur > seuil && next.hauteur <= seuil;

            if (currentCrossed) {
                // Linear interpolation to find exact crossing time
                const [currH, currM] = current.heure.split(':').map(Number);
                const [nextH, nextM] = next.heure.split(':').map(Number);
                const currTotalMin = currH * 60 + currM;
                const nextTotalMin = nextH * 60 + nextM;

                const ratio = (seuil - current.hauteur) / (next.hauteur - current.hauteur);
                const crossingTotalMin = currTotalMin + (nextTotalMin - currTotalMin) * ratio;
                const crossingH = Math.floor(crossingTotalMin / 60);
                const crossingM = Math.round(crossingTotalMin % 60);

                return {
                    heure: `${String(crossingH).padStart(2, '0')}:${String(crossingM).padStart(2, '0')}`,
                    hauteur: seuil
                };
            }
        }

        return null;
    };

    return {
        loading,
        error,
        entries,
        events,
        getTideAtTime,
        getClosestTide,
        getTidesForDate,
        getTidesBetween,
        getTideEventsForDate,
        getHauteurAt,
        findNextCrossing,
    };
};

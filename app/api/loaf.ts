// api/loaf.ts
import { NextApiRequest, NextApiResponse } from 'next';

// Define types for LoAF and event entries
interface LoAFEntry extends PerformanceEntry {
    blockingDuration: number;
    renderStart: number;
    scripts: ScriptTiming[];
}

interface EventEntry extends PerformanceEntry {
    // Define additional properties as needed
}

interface ScriptTiming {
    duration: number;
    forcedStyleAndLayoutDuration: number;
    // Define additional properties as needed
}

// Create a map to store correlated LoAF and event entries
const combinedMap: Map<LoAFEntry, EventEntry> = new Map();

// Define a function to print and analyze combined data
function printAndAnalyze(): void {
    // Retrieve entries from the combined map and perform analysis
    const entries = [...combinedMap.entries()].sort((a, b) => b[0].duration - a[0].duration);
    for (const [loaf, event] of entries) {
        // Conduct thorough analysis of combined data
        // Example analysis: calculating blocking duration, event duration, and script execution time
        let longestScript: ScriptTiming | null = null;
        let totalThrashingDuration = 0;
        for (const script of loaf.scripts) {
            totalThrashingDuration += script.forcedStyleAndLayoutDuration;
            if (!longestScript || script.duration > longestScript.duration) {
                longestScript = script;
            }
        }

        // Print analysis results
        console.log({
            loafBlockingDuration: loaf.blockingDuration,
            eventDuration: event.duration,
            longestScript,
            totalThrashingDuration,
            renderTime: loaf.startTime + loaf.duration - loaf.renderStart,
            loaf,
            event,
        });
    }
}

// Define a function to process fetched LoAF entries
function processLoAFEntries(loafEntries: LoAFEntry[], pendingEventEntries: EventEntry[]): void {
    // Loop through the pending LoAF entries
    for (const loafEntry of loafEntries) {
        // Check if the LoAF entry has blocking duration
        if (loafEntry.blockingDuration) {
            for (const eventEntry of pendingEventEntries) {
                if (eventEntry.startTime >= loafEntry.startTime && eventEntry.startTime + eventEntry.duration <= loafEntry.startTime + loafEntry.duration) {
                    combinedMap.set(loafEntry, eventEntry);
                    break;
                }
            }
        }
    }

    // Print and analyze combined data
    printAndAnalyze();

    // Clear combined map after processing to maintain memory efficiency
    combinedMap.clear();
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { loaFEntries, eventEntries } = req.body;

    // Process fetched LoAF entries
    processLoAFEntries(loaFEntries, eventEntries);

    // Send response
    res.status(200).json({ message: 'Data processed successfully' });
}

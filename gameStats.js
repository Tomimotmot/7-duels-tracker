/**
 * Ruft die Verteilung der Siegesbedingungen aus der Supabase-Datenbank ab.
 * Erwartet, dass jedes Spiel ein Feld "win_condition" hat, z.B.:
 * "Sieg nach Punkten (Zivilisten)", "Sieg durch Militärische Überlegenheit", "Sieg durch Wissenschaftliche Überlegenheit", "Sieg durch Senats-Überlegenheit (Supremacy)"
 * @returns {Promise<Map<string, number>>} Map mit Siegesbedingung als Key und Anzahl als Value
 */
export async function getWinConditionDistribution() {
    console.log('Lade Siegesbedingungen-Verteilung...');
    // Holt für jedes Spiel die Siegbedingung als Name über die Relation
    const { data: games, error } = await supabase
        .from('games')
        .select('win_condition:win_condition_id (name)');

    if (error) {
        console.error('Fehler beim Abrufen der Siegesbedingungen:', error);
        return new Map();
    }

    // Zähle die Vorkommen jeder Siegesbedingung
    const counts = new Map();
    games.forEach(game => {
        // game.win_condition ist ein Objekt { name: ... }
        const cond = game.win_condition && game.win_condition.name ? game.win_condition.name : 'Unbekannt';
        counts.set(cond, (counts.get(cond) || 0) + 1);
    });
    return counts;
}
import { supabase } from './supabaseClient.js';
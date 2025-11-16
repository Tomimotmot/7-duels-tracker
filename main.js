import { getHeadToHeadStats } from './gameStats.js';

/**
 * Ruft die Statistik ab und rendert die Head-to-Head-Matrix als HTML-Tabelle.
 */
async function displayHeadToHeadMatrix() {
    const container = document.getElementById('stats-output');
    container.innerHTML = '<h2>Lade Head-to-Head-Statistiken...</h2>'; 

    try {
        const matrix = await getHeadToHeadStats();
        const playerNames = Object.keys(matrix).sort();
        
        if (playerNames.length === 0) {
            container.innerHTML = '<p>Keine Spieler gefunden, um eine Matrix zu erstellen.</p>';
            return;
        }

        let html = '<h2>⚔️ Head-to-Head-Bilanz</h2>';
        html += '<p>Die Zahl in der Zelle zeigt an, wie oft der Spieler in der **Zeile** gegen den Spieler in der **Spalte** gewonnen hat.</p>';
        
        // Tabellenstruktur starten
        html += '<table border="1" style="border-collapse: collapse; width: 100%;">';
        
        // Kopfzeile (Spaltennamen: Gegner)
        html += '<thead><tr><th>VS</th>';
        playerNames.forEach(name => {
            html += `<th>${name}</th>`;
        });
        html += '</tr></thead><tbody>';

        // Datenzeilen (Zeilennamen: Spieler)
        playerNames.forEach(rowPlayer => {
            html += `<tr><th>${rowPlayer}</th>`;
            playerNames.forEach(colPlayer => {
                const wins = matrix[rowPlayer][colPlayer];
                
                let cellContent = wins;
                let bgColor = 'white';

                if (rowPlayer === colPlayer) {
                    cellContent = '—'; // Kein Spiel gegen sich selbst
                    bgColor = '#f0f0f0';
                } else if (wins > 0) {
                    bgColor = '#D9F7E8'; // Leicht grün für Siege
                }
                
                html += `<td style="text-align: center; background-color: ${bgColor}; font-weight: bold;">${cellContent}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;

    } catch (error) {
        container.innerHTML = `<p style="color: red;">Fehler beim Laden der Head-to-Head-Daten: ${error.message}</p>`;
        console.error(error);
    }
}

// Funktion aufrufen (diese ersetzt die vorherige Diagramm-Anzeige)
displayHeadToHeadMatrix();

import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
export default function GameListPage() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState({});
  const [winConditions, setWinConditions] = useState({});
  const [loading, setLoading] = useState(true);

  // Lade Spieler und Siegbedingungen als Map für schnelle Anzeige
  useEffect(() => {
    async function fetchMeta() {
      const { data: playerData } = await supabase.from('players').select('id, name');
      const { data: winData } = await supabase.from('win_conditions').select('id, name');
      setPlayers(Object.fromEntries((playerData||[]).map(p => [p.id, p.name])));
      setWinConditions(Object.fromEntries((winData||[]).map(w => [w.id, w.name])));
    }
    fetchMeta();
  }, []);

  // Lade die letzten 5 Spiele
  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (!error && data) setGames(data);
      setLoading(false);
    }
    fetchGames();
  }, []); // Nach neuem Spiel neu laden (jetzt über key in App gesteuert)

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 16 }}>
      <h2>Letzte 5 Spiele</h2>
      {loading ? (
        <p>Lade Spiele...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th>Datum</th>
              <th>Spieler 1</th>
              <th>Spieler 2</th>
              <th>Sieger</th>
              <th>Siegbedingung</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game.id}>
                <td>{game.created_at ? new Date(game.created_at).toLocaleDateString() : '-'}</td>
                <td>{players[game.player_1_id] || '-'}</td>
                <td>{players[game.player_2_id] || '-'}</td>
                <td>{players[game.winner_id] || '-'}</td>
                <td>{winConditions[game.win_condition_id] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
// ...existing code...

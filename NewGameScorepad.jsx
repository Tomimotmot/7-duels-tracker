import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const initialScoreState = {
    player1: '',
    player2: '',
    winner: '',
    win_condition: '',
    p1_total_score: '',
    p2_total_score: '',
    p1_score_blue_cards: '',
    p1_score_green_cards: '',
    p1_score_purple_cards: '',
    p1_score_coin_points: '',
    p1_score_military_points: '',
    p2_score_blue_cards: '',
    p2_score_green_cards: '',
    p2_score_purple_cards: '',
    p2_score_coin_points: '',
    p2_score_military_points: '',
};


export default function NewGameScorepad({ open, onClose, onSave }) {
    const [score, setScore] = useState(initialScoreState);
    const [players, setPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);
    const [winConditions, setWinConditions] = useState([]);
    const [loadingWinConditions, setLoadingWinConditions] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open) return;
        setLoadingPlayers(true);
        supabase
            .from('players')
            .select('id, name')
            .then(({ data, error }) => {
                if (!error && data) setPlayers(data);
                setLoadingPlayers(false);
            });
        setLoadingWinConditions(true);
        supabase
            .from('win_conditions')
            .select('id, name')
            .then(({ data, error }) => {
                if (!error && data) setWinConditions(data);
                setLoadingWinConditions(false);
            });
    }, [open]);


    // Hilfsfunktion: Summiere alle relevanten Felder für Gesamtpunkte
    const calcTotal = (prefix) => {
        const keys = [
            'score_blue_cards',
            'score_green_cards',
            'score_yellow_cards',
            'score_purple_cards',
            'score_gods_cards',
            'score_wonders_points',
            'score_capitol_points',
            'score_senator_points',
            'score_military_points',
            'score_progress_points',
            'score_coin_points',
        ];
        return keys.reduce((sum, k) => sum + (parseInt(score[`${prefix}_${k}`], 10) || 0), 0);
    };

    // Automatisch Gesamtpunkte berechnen
    const p1Total = calcTotal('p1');
    const p2Total = calcTotal('p2');

    // Write-Funktion: Speichert das Spiel in die Datenbank
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        // Mapping der Felder auf die DB-Spalten
        const payload = {
            player_1_id: score.player1,
            player_2_id: score.player2,
            winner_id: score.winner,
            win_condition_id: score.win_condition,
            p1_score_blue_cards: parseInt(score.p1_score_blue_cards, 10) || 0,
            p1_score_green_cards: parseInt(score.p1_score_green_cards, 10) || 0,
            p1_score_yellow_cards: parseInt(score.p1_score_yellow_cards, 10) || 0,
            p1_score_purple_cards: parseInt(score.p1_score_purple_cards, 10) || 0,
            p1_score_great_temple: parseInt(score.p1_score_great_temple, 10) || 0,
            p1_score_gods_cards: parseInt(score.p1_score_gods_cards, 10) || 0,
            p1_score_wonders_points: parseInt(score.p1_score_wonders_points, 10) || 0,
            p1_score_capitol_points: parseInt(score.p1_score_capitol_points, 10) || 0,
            p1_score_senator_points: parseInt(score.p1_score_senator_points, 10) || 0,
            p1_score_military_points: parseInt(score.p1_score_military_points, 10) || 0,
            p1_score_progress_points: parseInt(score.p1_score_progress_points, 10) || 0,
            p1_score_coin_points: parseInt(score.p1_score_coin_points, 10) || 0,
            p2_score_blue_cards: parseInt(score.p2_score_blue_cards, 10) || 0,
            p2_score_green_cards: parseInt(score.p2_score_green_cards, 10) || 0,
            p2_score_yellow_cards: parseInt(score.p2_score_yellow_cards, 10) || 0,
            p2_score_purple_cards: parseInt(score.p2_score_purple_cards, 10) || 0,
            p2_score_great_temple: parseInt(score.p2_score_great_temple, 10) || 0,
            p2_score_gods_cards: parseInt(score.p2_score_gods_cards, 10) || 0,
            p2_score_wonders_points: parseInt(score.p2_score_wonders_points, 10) || 0,
            p2_score_capitol_points: parseInt(score.p2_score_capitol_points, 10) || 0,
            p2_score_senator_points: parseInt(score.p2_score_senator_points, 10) || 0,
            p2_score_military_points: parseInt(score.p2_score_military_points, 10) || 0,
            p2_score_progress_points: parseInt(score.p2_score_progress_points, 10) || 0,
            p2_score_coin_points: parseInt(score.p2_score_coin_points, 10) || 0,
        };
        // Insert in Supabase
        const { error } = await supabase.from('games').insert([payload]);
        setSaving(false);
        if (error) {
            setError('Fehler beim Speichern: ' + error.message);
        } else {
            setScore(initialScoreState);
            if (onSave) onSave(score);
            if (onClose) onClose();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.35)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
        }}>
            <div style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                padding: 24,
                width: '95vw',
                maxWidth: 420,
                maxHeight: '95vh',
                overflowY: 'auto',
                animation: 'fadeInUp 0.3s',
            }}>
                <h3 style={{textAlign:'center',marginBottom:16}}>Neues Spiel eintragen</h3>
                <form onSubmit={handleSave}>
                                        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                                        {saving && <div style={{ color: '#0074D9', marginBottom: 8 }}>Speichere...</div>}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{fontWeight:'bold'}}>Spieler 1<br />
                                <select
                                    value={score.player1}
                                    onChange={e => setScore(s => ({ ...s, player1: e.target.value }))}
                                    style={{ width: '100%' }}
                                    required
                                    disabled={loadingPlayers}
                                >
                                    <option value="">{loadingPlayers ? 'Lade...' : 'Bitte wählen'}</option>
                                    {players.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{fontWeight:'bold'}}>Spieler 2<br />
                                <select
                                    value={score.player2}
                                    onChange={e => setScore(s => ({ ...s, player2: e.target.value }))}
                                    style={{ width: '100%' }}
                                    required
                                    disabled={loadingPlayers}
                                >
                                    <option value="">{loadingPlayers ? 'Lade...' : 'Bitte wählen'}</option>
                                    {players.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16, fontSize: '1rem' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}></th>
                                <th style={{ width: '30%' }}>{players.find(p => p.id === score.player1)?.name || 'P1'}</th>
                                <th style={{ width: '30%' }}>{players.find(p => p.id === score.player2)?.name || 'P2'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Blaue Karten</td>
                                <td><input type="number" value={score.p1_score_blue_cards} onChange={e => setScore(s => ({ ...s, p1_score_blue_cards: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_blue_cards} onChange={e => setScore(s => ({ ...s, p2_score_blue_cards: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>
                            <tr>
                                <td>Grüne Karten</td>
                                <td><input type="number" value={score.p1_score_green_cards} onChange={e => setScore(s => ({ ...s, p1_score_green_cards: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_green_cards} onChange={e => setScore(s => ({ ...s, p2_score_green_cards: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>
                            <tr>
                                <td>Gelbe Karten</td>
                                <td><input type="number" value={score.p1_score_yellow_cards} onChange={e => setScore(s => ({ ...s, p1_score_yellow_cards: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_yellow_cards} onChange={e => setScore(s => ({ ...s, p2_score_yellow_cards: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>
                            <tr>
                                <td>Gilden</td>
                                <td><input type="number" value={score.p1_score_purple_cards} onChange={e => setScore(s => ({ ...s, p1_score_purple_cards: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_purple_cards} onChange={e => setScore(s => ({ ...s, p2_score_purple_cards: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>

                            <tr>
                                <td>Großtempel</td>
                                <td><input type="number" value={score.p1_score_great_temple} onChange={e => setScore(s => ({ ...s, p1_score_great_temple: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_great_temple} onChange={e => setScore(s => ({ ...s, p2_score_great_temple: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>

                            <tr>
                                <td>Götter</td>
                                <td><input type="number" value={score.p1_score_gods_cards} onChange={e => setScore(s => ({ ...s, p1_score_gods_cards: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_gods_cards} onChange={e => setScore(s => ({ ...s, p2_score_gods_cards: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>
                            <tr>
                                <td>Weltwunder</td>
                                <td><input type="number" value={score.p1_score_wonders_points} onChange={e => setScore(s => ({ ...s, p1_score_wonders_points: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_wonders_points} onChange={e => setScore(s => ({ ...s, p2_score_wonders_points: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>
                            <tr>
                                <td>Senat</td>
                                <td><input type="number" value={score.p1_score_senator_points} onChange={e => setScore(s => ({ ...s, p1_score_senator_points: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_senator_points} onChange={e => setScore(s => ({ ...s, p2_score_senator_points: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>
                            <tr>
                                <td>Militär</td>
                                <td><input type="number" value={score.p1_score_military_points} onChange={e => setScore(s => ({ ...s, p1_score_military_points: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_military_points} onChange={e => setScore(s => ({ ...s, p2_score_military_points: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>
                            <tr>
                                <td>Forschung</td>
                                <td><input type="number" value={score.p1_score_progress_points} onChange={e => setScore(s => ({ ...s, p1_score_progress_points: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_progress_points} onChange={e => setScore(s => ({ ...s, p2_score_progress_points: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>
                            <tr>
                                <td>Münzen</td>
                                <td><input type="number" value={score.p1_score_coin_points} onChange={e => setScore(s => ({ ...s, p1_score_coin_points: e.target.value }))} style={{ width: '90%' }} /></td>
                                <td><input type="number" value={score.p2_score_coin_points} onChange={e => setScore(s => ({ ...s, p2_score_coin_points: e.target.value }))} style={{ width: '90%' }} /></td>
                            </tr>
                            <tr>
                                <td style={{fontWeight:'bold'}}>Gesamtpunkte</td>
                                <td><input type="number" value={p1Total} readOnly style={{ width: '90%', background: '#f4f4f4' }} tabIndex={-1} /></td>
                                <td><input type="number" value={p2Total} readOnly style={{ width: '90%', background: '#f4f4f4' }} tabIndex={-1} /></td>
                            </tr>
                        </tbody>
                    </table>
                    {/* Sieger und Siegbedingung jetzt unter Gesamtpunkte */}
                    <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{fontWeight:'bold'}}>Sieger<br />
                                <select
                                    value={score.winner}
                                    onChange={e => setScore(s => ({ ...s, winner: e.target.value }))}
                                    style={{ width: '100%' }}
                                    required
                                    disabled={!score.player1 || !score.player2}
                                >
                                    <option value="">Bitte wählen</option>
                                    {[score.player1, score.player2].filter(Boolean).map(pid => {
                                        const p = players.find(pl => pl.id === pid);
                                        return p ? <option key={p.id} value={p.id}>{p.name}</option> : null;
                                    })}
                                </select>
                            </label>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{fontWeight:'bold'}}>Siegbedingung<br />
                                <select
                                    value={score.win_condition}
                                    onChange={e => setScore(s => ({ ...s, win_condition: e.target.value }))}
                                    style={{ width: '100%' }}
                                    required
                                    disabled={loadingWinConditions}
                                >
                                    <option value="">{loadingWinConditions ? 'Lade...' : 'Bitte wählen'}</option>
                                    {winConditions.map(wc => (
                                        <option key={wc.id} value={wc.id}>{wc.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                        <button type="submit" style={{ background: '#2ECC40', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', fontSize: '1rem', cursor: 'pointer' }}>Speichern</button>
                        <button type="button" style={{ background: '#AAAAAA', color: 'white', border: 'none', borderRadius: 4, padding: '8px 20px', fontSize: '1rem', cursor: 'pointer' }} onClick={onClose}>Abbrechen</button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @media (max-width: 600px) {
                    .scorepad-modal { max-width: 99vw !important; padding: 8px !important; }
                }
            `}</style>
        </div>
    );
}

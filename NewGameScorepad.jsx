
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from './supabaseClient';


const initialScoreState = {
    player1: '',
    player2: '',
    winner: '',
    win_condition: '',
    p1_score_blue_cards: '',
    p1_score_green_cards: '',
    p1_score_yellow_cards: '',
    p1_score_purple_cards: '',
    p1_score_great_temple: '',
    p1_score_gods_cards: '',
    p1_score_wonders_points: '',
    p1_score_capitol_points: '',
    p1_score_senator_points: '',
    p1_score_military_points: '',
    p1_score_progress_points: '',
    p1_score_coin_points: '',
    p2_score_blue_cards: '',
    p2_score_green_cards: '',
    p2_score_yellow_cards: '',
    p2_score_purple_cards: '',
    p2_score_great_temple: '',
    p2_score_gods_cards: '',
    p2_score_wonders_points: '',
    p2_score_capitol_points: '',
    p2_score_senator_points: '',
    p2_score_military_points: '',
    p2_score_progress_points: '',
    p2_score_coin_points: '',
};



export default function NewGameScorepad({ open, onClose, onSave }) {
    const { register, handleSubmit, watch, setValue, reset } = useForm({ defaultValues: initialScoreState });
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
        reset(initialScoreState);
    }, [open, reset]);



    // Hilfsfunktion: Summiere alle relevanten Felder für Gesamtpunkte
    const calcTotal = (prefix) => {
        const keys = [
            'score_blue_cards',
            'score_green_cards',
            'score_yellow_cards',
            'score_purple_cards',
            'score_great_temple',
            'score_gods_cards',
            'score_wonders_points',
            'score_capitol_points',
            'score_senator_points',
            'score_military_points',
            'score_progress_points',
            'score_coin_points',
        ];
        const values = watch();
        return keys.reduce((sum, k) => sum + (parseInt(values[`${prefix}_${k}`], 10) || 0), 0);
    };
    const p1Total = calcTotal('p1');
    const p2Total = calcTotal('p2');


    // Write-Funktion: Speichert das Spiel in die Datenbank
    const onSubmit = async (data) => {
        setSaving(true);
        setError(null);
        const payload = {
            player_1_id: data.player1,
            player_2_id: data.player2,
            winner_id: data.winner,
            win_condition_id: data.win_condition,
            p1_score_blue_cards: parseInt(data.p1_score_blue_cards, 10) || 0,
            p1_score_green_cards: parseInt(data.p1_score_green_cards, 10) || 0,
            p1_score_yellow_cards: parseInt(data.p1_score_yellow_cards, 10) || 0,
            p1_score_purple_cards: parseInt(data.p1_score_purple_cards, 10) || 0,
            p1_score_great_temple: parseInt(data.p1_score_great_temple, 10) || 0,
            p1_score_gods_cards: parseInt(data.p1_score_gods_cards, 10) || 0,
            p1_score_wonders_points: parseInt(data.p1_score_wonders_points, 10) || 0,
            p1_score_capitol_points: parseInt(data.p1_score_capitol_points, 10) || 0,
            p1_score_senator_points: parseInt(data.p1_score_senator_points, 10) || 0,
            p1_score_military_points: parseInt(data.p1_score_military_points, 10) || 0,
            p1_score_progress_points: parseInt(data.p1_score_progress_points, 10) || 0,
            p1_score_coin_points: parseInt(data.p1_score_coin_points, 10) || 0,
            p2_score_blue_cards: parseInt(data.p2_score_blue_cards, 10) || 0,
            p2_score_green_cards: parseInt(data.p2_score_green_cards, 10) || 0,
            p2_score_yellow_cards: parseInt(data.p2_score_yellow_cards, 10) || 0,
            p2_score_purple_cards: parseInt(data.p2_score_purple_cards, 10) || 0,
            p2_score_great_temple: parseInt(data.p2_score_great_temple, 10) || 0,
            p2_score_gods_cards: parseInt(data.p2_score_gods_cards, 10) || 0,
            p2_score_wonders_points: parseInt(data.p2_score_wonders_points, 10) || 0,
            p2_score_capitol_points: parseInt(data.p2_score_capitol_points, 10) || 0,
            p2_score_senator_points: parseInt(data.p2_score_senator_points, 10) || 0,
            p2_score_military_points: parseInt(data.p2_score_military_points, 10) || 0,
            p2_score_progress_points: parseInt(data.p2_score_progress_points, 10) || 0,
            p2_score_coin_points: parseInt(data.p2_score_coin_points, 10) || 0,
        };
        const { error } = await supabase.from('games').insert([payload]);
        setSaving(false);
        if (error) {
            setError('Fehler beim Speichern: ' + error.message);
        } else {
            reset(initialScoreState);
            if (onSave) onSave(data);
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
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                padding: 0,
                width: '100vw',
                maxWidth: 480,
                maxHeight: '98vh',
                overflowY: 'auto',
                animation: 'fadeInUp 0.3s',
            }}>
                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20 }} autoComplete="off">
                    <h3 style={{ textAlign: 'center', marginBottom: 20, fontSize: 22 }}>Neues Spiel eintragen</h3>
                    {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                    {saving && <div style={{ color: '#0074D9', marginBottom: 8 }}>Speichere...</div>}

                    {/* Spieler Auswahl */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 16 }}>Spieler 1</label>
                            <select {...register('player1', { required: true })} style={{ width: '100%', fontSize: 18, padding: 8, marginTop: 4, borderRadius: 6 }} disabled={loadingPlayers}>
                                <option value="">{loadingPlayers ? 'Lade...' : 'Bitte wählen'}</option>
                                {players.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 16 }}>Spieler 2</label>
                            <select {...register('player2', { required: true })} style={{ width: '100%', fontSize: 18, padding: 8, marginTop: 4, borderRadius: 6 }} disabled={loadingPlayers}>
                                <option value="">{loadingPlayers ? 'Lade...' : 'Bitte wählen'}</option>
                                {players.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Punktefelder als gestapelte Blöcke */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                        {[
                            { label: 'Blaue Karten', p1: 'p1_score_blue_cards', p2: 'p2_score_blue_cards' },
                            { label: 'Grüne Karten', p1: 'p1_score_green_cards', p2: 'p2_score_green_cards' },
                            { label: 'Gelbe Karten', p1: 'p1_score_yellow_cards', p2: 'p2_score_yellow_cards' },
                            { label: 'Gilden', p1: 'p1_score_purple_cards', p2: 'p2_score_purple_cards' },
                            { label: 'Großtempel', p1: 'p1_score_great_temple', p2: 'p2_score_great_temple' },
                            { label: 'Götter', p1: 'p1_score_gods_cards', p2: 'p2_score_gods_cards' },
                            { label: 'Weltwunder', p1: 'p1_score_wonders_points', p2: 'p2_score_wonders_points' },
                            { label: 'Senat', p1: 'p1_score_senator_points', p2: 'p2_score_senator_points' },
                            { label: 'Militär', p1: 'p1_score_military_points', p2: 'p2_score_military_points' },
                            { label: 'Forschung', p1: 'p1_score_progress_points', p2: 'p2_score_progress_points' },
                            { label: 'Münzen', p1: 'p1_score_coin_points', p2: 'p2_score_coin_points' },
                        ].map(row => (
                            <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 2 }}>{row.label}</div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <input type="number" inputMode="numeric" min="0" {...register(row.p1)} aria-label={row.label + ' Spieler 1'} style={{ flex: 1, fontSize: 18, padding: 10, borderRadius: 6, border: '1px solid #ccc', background: '#f8f8f8', width: '100%' }} />
                                    <input type="number" inputMode="numeric" min="0" {...register(row.p2)} aria-label={row.label + ' Spieler 2'} style={{ flex: 1, fontSize: 18, padding: 10, borderRadius: 6, border: '1px solid #ccc', background: '#f8f8f8', width: '100%' }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gesamtpunkte */}
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ flex: 2, fontWeight: 'bold', fontSize: 16 }}>Gesamtpunkte</div>
                        <input type="number" value={p1Total} readOnly style={{ flex: 1, fontSize: 18, background: '#f4f4f4', border: 'none', textAlign: 'center' }} tabIndex={-1} />
                        <input type="number" value={p2Total} readOnly style={{ flex: 1, fontSize: 18, background: '#f4f4f4', border: 'none', textAlign: 'center' }} tabIndex={-1} />
                    </div>

                    {/* Sieger und Siegbedingung */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 16 }}>Sieger</label>
                            <select {...register('winner', { required: true })} style={{ width: '100%', fontSize: 18, padding: 8, marginTop: 4, borderRadius: 6 }} disabled={!watch('player1') || !watch('player2')}>
                                <option value="">Bitte wählen</option>
                                {[watch('player1'), watch('player2')].filter(Boolean).map(pid => {
                                    const p = players.find(pl => pl.id === pid);
                                    return p ? <option key={p.id} value={p.id}>{p.name}</option> : null;
                                })}
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 16 }}>Siegbedingung</label>
                            <select {...register('win_condition', { required: true })} style={{ width: '100%', fontSize: 18, padding: 8, marginTop: 4, borderRadius: 6 }} disabled={loadingWinConditions}>
                                <option value="">{loadingWinConditions ? 'Lade...' : 'Bitte wählen'}</option>
                                {winConditions.map(wc => (
                                    <option key={wc.id} value={wc.id}>{wc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12, marginBottom: 8 }}>
                        <button type="submit" style={{ background: '#2ECC40', color: 'white', border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer' }}>Speichern</button>
                        <button type="button" style={{ background: '#AAAAAA', color: 'white', border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer' }} onClick={onClose}>Abbrechen</button>
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
                    form { padding: 8px !important; }
                    input, select { font-size: 18px !important; padding: 12px 8px !important; }
                    .score-row { flex-direction: column !important; gap: 4px !important; }
                }
            `}</style>
        </div>
    );
}

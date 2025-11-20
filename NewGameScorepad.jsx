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
    p1_score_senator_points: '',
    p1_score_military_points: '',
    p1_score_progress_points: '',
    p1_score_coin_points: '',
    p1_score_thalassa_points: '', // Seemacht
    p2_score_blue_cards: '',
    p2_score_green_cards: '',
    p2_score_yellow_cards: '',
    p2_score_purple_cards: '',
    p2_score_great_temple: '',
    p2_score_gods_cards: '',
    p2_score_wonders_points: '',
    p2_score_senator_points: '',
    p2_score_military_points: '',
    p2_score_progress_points: '',
    p2_score_coin_points: '',
    p2_score_thalassa_points: '', // Seemacht
    p1_wonder1: '',
    p1_wonder2: '',
    p1_wonder3: '',
    p1_wonder4: '',
    p2_wonder1: '',
    p2_wonder2: '',
    p2_wonder3: '',
    p2_wonder4: '',
};


export default function NewGameScorepad({ open, onClose, onSave, game, mode }) {
    const [players, setPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);
    const [winConditions, setWinConditions] = useState([]);
    const [loadingWinConditions, setLoadingWinConditions] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [wonders, setWonders] = useState([]);

    const { register, handleSubmit, watch, reset, setValue } = useForm({ defaultValues: initialScoreState });
    const isEdit = mode === 'edit' && game;

    // Prefill form if editing
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
        // Lade Weltwunder
        supabase
            .from('weltwunder')
            .select('id, name')
            .then(({ data, error }) => {
                if (!error && data) setWonders(data);
            });
        if (isEdit) {
            // Map DB fields to form fields
            const editValues = {
                player1: game.player_1_id || '',
                player2: game.player_2_id || '',
                winner: game.winner_id || '',
                win_condition: game.win_condition_id || '',
                p1_score_blue_cards: game.p1_score_blue_cards?.toString() || '',
                p1_score_green_cards: game.p1_score_green_cards?.toString() || '',
                p1_score_yellow_cards: game.p1_score_yellow_cards?.toString() || '',
                p1_score_purple_cards: game.p1_score_purple_cards?.toString() || '',
                p1_score_great_temple: game.p1_score_great_temple?.toString() || '',
                p1_score_gods_cards: game.p1_score_gods_cards?.toString() || '',
                p1_score_wonders_points: game.p1_score_wonders_points?.toString() || '',
                p1_score_senator_points: game.p1_score_senator_points?.toString() || '',
                p1_score_military_points: game.p1_score_military_points?.toString() || '',
                p1_score_progress_points: game.p1_score_progress_points?.toString() || '',
                p1_score_coin_points: game.p1_score_coin_points?.toString() || '',
                p1_score_thalassa_points: game.p1_score_thalassa_points?.toString() || '',
                p2_score_blue_cards: game.p2_score_blue_cards?.toString() || '',
                p2_score_green_cards: game.p2_score_green_cards?.toString() || '',
                p2_score_yellow_cards: game.p2_score_yellow_cards?.toString() || '',
                p2_score_purple_cards: game.p2_score_purple_cards?.toString() || '',
                p2_score_great_temple: game.p2_score_great_temple?.toString() || '',
                p2_score_gods_cards: game.p2_score_gods_cards?.toString() || '',
                p2_score_wonders_points: game.p2_score_wonders_points?.toString() || '',
                p2_score_senator_points: game.p2_score_senator_points?.toString() || '',
                p2_score_military_points: game.p2_score_military_points?.toString() || '',
                p2_score_progress_points: game.p2_score_progress_points?.toString() || '',
                p2_score_coin_points: game.p2_score_coin_points?.toString() || '',
                p2_score_thalassa_points: game.p2_score_thalassa_points?.toString() || '',
                p1_wonder1: game.p1_wonder1 || '',
                p1_wonder2: game.p1_wonder2 || '',
                p1_wonder3: game.p1_wonder3 || '',
                p1_wonder4: game.p1_wonder4 || '',
                p2_wonder1: game.p2_wonder1 || '',
                p2_wonder2: game.p2_wonder2 || '',
                p2_wonder3: game.p2_wonder3 || '',
                p2_wonder4: game.p2_wonder4 || '',
            };
            reset(editValues);
        } else {
            reset(initialScoreState);
        }
    }, [open, reset, isEdit, game]);

    // Calculate total points for a player
    const calcTotal = (prefix) => {
        const keys = [
            'score_blue_cards',
            'score_green_cards',
            'score_yellow_cards',
            'score_purple_cards',
            'score_great_temple',
            'score_gods_cards',
            'score_wonders_points',
            'score_senator_points',
            'score_military_points',
            'score_progress_points',
            'score_coin_points',
            'score_thalassa_points', // Seemacht
        ];
        const values = watch();
        return keys.reduce((sum, k) => sum + (parseInt(values[`${prefix}_${k}`], 10) || 0), 0);
    };
    const p1Total = calcTotal('p1');
    const p2Total = calcTotal('p2');

    // Save or update game in database
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
            p1_score_senator_points: parseInt(data.p1_score_senator_points, 10) || 0,
            p1_score_military_points: parseInt(data.p1_score_military_points, 10) || 0,
            p1_score_progress_points: parseInt(data.p1_score_progress_points, 10) || 0,
            p1_score_coin_points: parseInt(data.p1_score_coin_points, 10) || 0,
            p1_score_thalassa_points: parseInt(data.p1_score_thalassa_points, 10) || 0,
            p2_score_blue_cards: parseInt(data.p2_score_blue_cards, 10) || 0,
            p2_score_green_cards: parseInt(data.p2_score_green_cards, 10) || 0,
            p2_score_yellow_cards: parseInt(data.p2_score_yellow_cards, 10) || 0,
            p2_score_purple_cards: parseInt(data.p2_score_purple_cards, 10) || 0,
            p2_score_great_temple: parseInt(data.p2_score_great_temple, 10) || 0,
            p2_score_gods_cards: parseInt(data.p2_score_gods_cards, 10) || 0,
            p2_score_wonders_points: parseInt(data.p2_score_wonders_points, 10) || 0,
            p2_score_senator_points: parseInt(data.p2_score_senator_points, 10) || 0,
            p2_score_military_points: parseInt(data.p2_score_military_points, 10) || 0,
            p2_score_progress_points: parseInt(data.p2_score_progress_points, 10) || 0,
            p2_score_coin_points: parseInt(data.p2_score_coin_points, 10) || 0,
            p2_score_thalassa_points: parseInt(data.p2_score_thalassa_points, 10) || 0,
            p1_wonder1: data.p1_wonder1 || null,
            p1_wonder2: data.p1_wonder2 || null,
            p1_wonder3: data.p1_wonder3 || null,
            p1_wonder4: data.p1_wonder4 || null,
            p2_wonder1: data.p2_wonder1 || null,
            p2_wonder2: data.p2_wonder2 || null,
            p2_wonder3: data.p2_wonder3 || null,
            p2_wonder4: data.p2_wonder4 || null,
        };
        let error = null;
        if (isEdit && game?.id) {
            // Update existing game
            ({ error } = await supabase.from('games').update(payload).eq('id', game.id));
        } else {
            // Insert new game
            ({ error } = await supabase.from('games').insert([payload]));
        }
        setSaving(false);
        if (error) {
            setError('Fehler beim Speichern: ' + error.message);
        } else {
            reset(initialScoreState);
            if (onSave) onSave(data);
            if (onClose) onClose();
        }
    };

    if (!open) return null;

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
                position: 'relative',
            }}>
                {/* Sticky Header */}
                <div style={{
                    position: 'sticky',
                    top: 0,
                    background: '#fff',
                    zIndex: 2,
                    padding: '18px 0 10px 0',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    textAlign: 'center',
                }}>
                    <h3 style={{ margin: 0, fontSize: 22 }}>Neues Spiel eintragen</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '10px 16px 80px 16px' }} autoComplete="off">
                    {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                    {saving && <div style={{ color: '#0074D9', marginBottom: 8 }}>Speichere...</div>}
                    {/* Spieler Auswahl */}
                    <div style={{ display: 'flex', gap: 14, marginBottom: 22, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 4, display: 'block' }}>Spieler 1</label>
                            <select {...register('player1', { required: true })} style={{ width: '100%', fontSize: 19, padding: 12, marginTop: 0, borderRadius: 8 }} disabled={loadingPlayers}>
                                <option value="">{loadingPlayers ? 'Lade...' : 'Bitte wählen'}</option>
                                {players.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 4, display: 'block' }}>Spieler 2</label>
                            <select {...register('player2', { required: true })} style={{ width: '100%', fontSize: 19, padding: 12, marginTop: 0, borderRadius: 8 }} disabled={loadingPlayers}>
                                <option value="">{loadingPlayers ? 'Lade...' : 'Bitte wählen'}</option>
                                {players.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Punktefelder als gestapelte Blöcke */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
                        {[
                            { label: 'Blaue Karten', p1: 'p1_score_blue_cards', p2: 'p2_score_blue_cards' },
                            { label: 'Grüne Karten', p1: 'p1_score_green_cards', p2: 'p2_score_green_cards' },
                            { label: 'Gelbe Karten', p1: 'p1_score_yellow_cards', p2: 'p2_score_yellow_cards' },
                            { label: 'Gilden', p1: 'p1_score_purple_cards', p2: 'p2_score_purple_cards' },
                            { label: 'Großtempel', p1: 'p1_score_great_temple', p2: 'p2_score_great_temple' },
                            { label: 'Götter', p1: 'p1_score_gods_cards', p2: 'p2_score_gods_cards' },
                            { label: 'Weltwunder', p1: 'p1_score_wonders_points', p2: 'p2_score_wonders_points' },
                            { label: 'Seemacht', p1: 'p1_score_thalassa_points', p2: 'p2_score_thalassa_points' },
                            { label: 'Senat', p1: 'p1_score_senator_points', p2: 'p2_score_senator_points' },
                            { label: 'Militär', p1: 'p1_score_military_points', p2: 'p2_score_military_points' },
                            { label: 'Forschung', p1: 'p1_score_progress_points', p2: 'p2_score_progress_points' },
                            { label: 'Münzen', p1: 'p1_score_coin_points', p2: 'p2_score_coin_points' },
                        ].map((row, idx) => (
                            <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 2 }}>{row.label}</div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        {...register(row.p1)}
                                        aria-label={row.label + ' Spieler 1'}
                                        style={{ flex: 1, fontSize: 20, padding: 14, borderRadius: 8, border: '1.5px solid #bbb', background: '#f8f8f8', width: '100%' }}
                                        tabIndex={2 * idx + 1}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const next = document.querySelector(`[tabindex='${2 * idx + 2}']`);
                                                if (next) next.focus();
                                            }
                                        }}
                                    />
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        min="0"
                                        {...register(row.p2)}
                                        aria-label={row.label + ' Spieler 2'}
                                        style={{ flex: 1, fontSize: 20, padding: 14, borderRadius: 8, border: '1.5px solid #bbb', background: '#f8f8f8', width: '100%' }}
                                        tabIndex={2 * idx + 2}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const next = document.querySelector(`[tabindex='${2 * idx + 3}']`);
                                                if (next) next.focus();
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Gesamtpunkte */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 26 }}>
                        <div style={{ flex: 2, fontWeight: 'bold', fontSize: 17 }}>Gesamtpunkte</div>
                        <input type="number" value={p1Total} readOnly style={{ flex: 1, fontSize: 19, background: '#f4f4f4', border: 'none', textAlign: 'center' }} tabIndex={-1} />
                        <input type="number" value={p2Total} readOnly style={{ flex: 1, fontSize: 19, background: '#f4f4f4', border: 'none', textAlign: 'center' }} tabIndex={-1} />
                    </div>
                    {/* Sieger und Siegbedingung */}
                    <div style={{ display: 'flex', gap: 14, marginBottom: 32, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 4, display: 'block' }}>Sieger</label>
                            <select {...register('winner', { required: true })} style={{ width: '100%', fontSize: 19, padding: 12, marginTop: 0, borderRadius: 8 }} disabled={!watch('player1') || !watch('player2')}>
                                <option value="">Bitte wählen</option>
                                {[watch('player1'), watch('player2')].filter(Boolean).map(pid => {
                                    const p = players.find(pl => pl.id === pid);
                                    return p ? <option key={p.id} value={p.id}>{p.name}</option> : null;
                                })}
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 4, display: 'block' }}>Siegbedingung</label>
                            <select {...register('win_condition', { required: true })} style={{ width: '100%', fontSize: 19, padding: 12, marginTop: 0, borderRadius: 8 }} disabled={loadingWinConditions}>
                                <option value="">{loadingWinConditions ? 'Lade...' : 'Bitte wählen'}</option>
                                {winConditions.map(wc => (
                                    <option key={wc.id} value={wc.id}>{wc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Weltwunder Auswahl */}
                    <div style={{ display: 'flex', gap: 14, marginBottom: 22, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 4, display: 'block' }}>Weltwunder Spieler 1</label>
                            {[1,2,3,4].map(i => (
                                <select key={i} {...register(`p1_wonder${i}`, { required: true })} style={{ width: '100%', fontSize: 17, padding: 8, borderRadius: 8, marginBottom: 4 }}>
                                    <option value="">Weltwunder {i}</option>
                                    {wonders.filter(w => {
                                        // Nur Weltwunder anzeigen, die noch nicht gewählt wurden
                                        const selected = [1,2,3,4].map(j => watch(`p1_wonder${j}`)).concat([1,2,3,4].map(j => watch(`p2_wonder${j}`)));
                                        return !selected.includes(w.id) || watch(`p1_wonder${i}`) === w.id;
                                    }).map(w => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                            ))}
                        </div>
                        <div style={{ flex: 1, minWidth: 120 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 4, display: 'block' }}>Weltwunder Spieler 2</label>
                            {[1,2,3,4].map(i => (
                                <select key={i} {...register(`p2_wonder${i}`, { required: true })} style={{ width: '100%', fontSize: 17, padding: 8, borderRadius: 8, marginBottom: 4 }}>
                                    <option value="">Weltwunder {i}</option>
                                    {wonders.filter(w => {
                                        const selected = [1,2,3,4].map(j => watch(`p1_wonder${j}`)).concat([1,2,3,4].map(j => watch(`p2_wonder${j}`)));
                                        return !selected.includes(w.id) || watch(`p2_wonder${i}`) === w.id;
                                    }).map(w => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                            ))}
                        </div>
                    </div>
                    {/* Sticky Footer */}
                    <div style={{
                        position: 'sticky',
                        bottom: 0,
                        background: '#fff',
                        zIndex: 2,
                        padding: '16px 0 18px 0',
                        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 18,
                    }}>
                        <button type="submit" style={{ background: '#2ECC40', color: 'white', border: 'none', borderRadius: 10, padding: '16px 36px', fontSize: '1.18rem', fontWeight: 700, cursor: 'pointer', minWidth: 120 }}>Speichern</button>
                        <button type="button" style={{ background: '#AAAAAA', color: 'white', border: 'none', borderRadius: 10, padding: '16px 36px', fontSize: '1.18rem', fontWeight: 700, cursor: 'pointer', minWidth: 120 }} onClick={onClose}>Abbrechen</button>
                    </div>
                </form>
                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(40px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @media (max-width: 600px) {
                        .scorepad-modal { max-width: 99vw !important; padding: 4px !important; }
                        form { padding: 4px !important; }
                        input, select { font-size: 19px !important; padding: 16px 8px !important; }
                        .score-row { flex-direction: column !important; gap: 4px !important; }
                    }
                `}</style>
            </div>
        </div>
    );
}

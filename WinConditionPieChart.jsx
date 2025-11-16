import React, { useState, useEffect } from 'react';
import NewGameScorepad from './NewGameScorepad';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getWinConditionDistribution } from './gameStats'; // Importiere deine Daten-Funktion

// Farben, die zu den 7 Wonders Duel Siegbedingungen passen
const COLORS = {
    'Punkte': '#0074D9', // Blau
    'Miliär': '#FF4136', // Rot
    'Forschung': '#2ECC40', // Grün
    'Senat': '#AAAAAA' // Grau
};



const WinConditionPieChart = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScoreBlock, setShowScoreBlock] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const countsMap = await getWinConditionDistribution();
            
            // Recharts erwartet ein Array von Objekten: [{ name: '...', value: X }, ...]
            const dataArray = Array.from(countsMap.entries()).map(([name, count]) => ({
                name,
                value: count
            }));

            setChartData(dataArray);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return <p>Lade Diagramm...</p>;
    }

    if (chartData.length === 0) {
        return <p>Keine Spiel-Endbedingungen gefunden.</p>;
    }

    // Berechnung des Gesamtvolumens für die Prozentanzeige
    const totalGames = chartData.reduce((sum, entry) => sum + entry.value, 0);

    // Benutzerdefinierter Tooltip (Optional, macht es "geiler")
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const entry = payload[0];
            const percentage = ((entry.value / totalGames) * 100).toFixed(1);
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                    <p>{entry.name}</p>
                    <p>Spiele: **{entry.value}** ({percentage}%)</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: 400 }}>
            <button
                style={{
                    marginBottom: '16px',
                    padding: '8px 20px',
                    background: '#0074D9',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }}
                onClick={() => setShowScoreBlock(v => !v)}
            >
                Neues Spiel
            </button>



            {showScoreBlock && (
                <NewGameScorepad
                    open={true}
                    onClose={() => setShowScoreBlock(false)}
                    onSave={score => { alert('Speichern folgt!'); setShowScoreBlock(false); }}
                />
            )}

            <h3>Verteilung der Siegesbedingungen (Total: {totalGames} Spiele)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#888888'} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip totalGames={totalGames} />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WinConditionPieChart;
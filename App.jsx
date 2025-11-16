import React, { useState } from 'react';
import grundspielCover from './src/assets/regeln/regeln_grundspiel.png';
import pantheonCover from './src/assets/regeln/regeln_pantheon.png';
import agoraCover from './src/assets/regeln/regeln_agora.png';
import GameListPage from './GameListPage';
import NewGameScorepad from './NewGameScorepad';

function App() {
  const [showScorepad, setShowScorepad] = useState(false);

  return (
    <div className="App" style={{ padding: '20px 0', maxWidth: '1000px', margin: 'auto' }}>
      <h1 style={{ marginBottom: 12 }}>🏛️ 7 Wonders Duel Tracker</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, marginTop: 24 }}>
        <button
          style={{ padding: '12px 32px', fontSize: '1.2rem', borderRadius: 8, background: '#0074D9', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          onClick={() => setShowScorepad(true)}
        >
          Neues Spiel
        </button>
      </div>
      {showScorepad && (
        <NewGameScorepad
          open={true}
          onClose={() => setShowScorepad(false)}
          onSave={() => setShowScorepad(false)}
        />
      )}

      <GameListPage />

      <section style={{ margin: '40px 0 24px 0', textAlign: 'center', padding: '0 8px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Anleitungen</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            alignItems: 'center',
            maxWidth: 420,
            margin: '0 auto',
          }}
        >
          <a href="https://cdn.svc.asmodee.net/production-rprod/storage/downloads/games/7wonders-duel/de/7du-rules-de-1599056056lq6Tv.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{ width: '100%', maxWidth: 340, textAlign: 'center', cursor: 'pointer', margin: '0 auto' }}>
              <img src={grundspielCover} alt="Grundspiel" style={{ width: '100%', borderRadius: 12, boxShadow: '0 2px 12px #bbb', maxHeight: 340, objectFit: 'contain', background: '#fff' }} />
              <div style={{ marginTop: 12, color: '#222', fontWeight: 700, fontSize: '1.15rem' }}>Grundspiel</div>
            </div>
          </a>
          <a href="https://cdn.svc.asmodee.net/production-rprod/storage/downloads/games/7wonders-duel-pantheon/de/7dpa-rules-de-1624535129NdTv3.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{ width: '100%', maxWidth: 340, textAlign: 'center', cursor: 'pointer', margin: '0 auto' }}>
              <img src={pantheonCover} alt="Pantheon" style={{ width: '100%', borderRadius: 12, boxShadow: '0 2px 12px #bbb', maxHeight: 340, objectFit: 'contain', background: '#fff' }} />
              <div style={{ marginTop: 12, color: '#222', fontWeight: 700, fontSize: '1.15rem' }}>Pantheon</div>
            </div>
          </a>
          <a href="https://cdn.svc.asmodee.net/production-rprod/storage/downloads/games/7wonders-duel-agora/de/7dag-rules-de-1624535491QVdR8.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{ width: '100%', maxWidth: 340, textAlign: 'center', cursor: 'pointer', margin: '0 auto' }}>
              <img src={agoraCover} alt="Agora" style={{ width: '100%', borderRadius: 12, boxShadow: '0 2px 12px #bbb', maxHeight: 340, objectFit: 'contain', background: '#fff' }} />
              <div style={{ marginTop: 12, color: '#222', fontWeight: 700, fontSize: '1.15rem' }}>Agora</div>
            </div>
          </a>
          <a href="https://docs.google.com/document/d/1Q4Gn_Ag5Sbp5MaIa6-uBdqZcfEj0pmUapV6mouQZ_XQ/edit?tab=t.0" target="_blank" rel="noopener noreferrer" style={{ width: '100%' }}>
            <button style={{ padding: '18px 0', width: '100%', maxWidth: 340, fontSize: '1.15rem', borderRadius: 12, background: '#AAAAAA', color: 'white', border: 'none', cursor: 'pointer', marginTop: 8, fontWeight: 700 }}>Thalassa</button>
          </a>
        </div>
      </section>
    </div>
  );
}

export default App;
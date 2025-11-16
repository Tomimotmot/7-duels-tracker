import React from 'react';
import grundspielCover from './src/assets/regeln/regeln_grundspiel.png';
import pantheonCover from './src/assets/regeln/regeln_pantheon.png';
import agoraCover from './src/assets/regeln/regeln_agora.png';
import GameListPage from './GameListPage';


function App() {
  return (
    <div className="App" style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h1>🏛️ 7 Wonders Duel Tracker</h1>

      <GameListPage />

      <section style={{ margin: '32px 0 24px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Anleitungen</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          <a href="https://cdn.svc.asmodee.net/production-rprod/storage/downloads/games/7wonders-duel/de/7du-rules-de-1599056056lq6Tv.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ width: 120, textAlign: 'center', cursor: 'pointer' }}>
              <img src={grundspielCover} alt="Grundspiel" style={{ width: '100%', borderRadius: 8, boxShadow: '0 2px 8px #bbb' }} />
              <div style={{ marginTop: 8, color: '#444', fontWeight: 600 }}>Grundspiel</div>
            </div>
          </a>
          <a href="https://cdn.svc.asmodee.net/production-rprod/storage/downloads/games/7wonders-duel-pantheon/de/7dpa-rules-de-1624535129NdTv3.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ width: 120, textAlign: 'center', cursor: 'pointer' }}>
              <img src={pantheonCover} alt="Pantheon" style={{ width: '100%', borderRadius: 8, boxShadow: '0 2px 8px #bbb' }} />
              <div style={{ marginTop: 8, color: '#444', fontWeight: 600 }}>Pantheon</div>
            </div>
          </a>
          <a href="https://cdn.svc.asmodee.net/production-rprod/storage/downloads/games/7wonders-duel-agora/de/7dag-rules-de-1624535491QVdR8.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ width: 120, textAlign: 'center', cursor: 'pointer' }}>
              <img src={agoraCover} alt="Agora" style={{ width: '100%', borderRadius: 8, boxShadow: '0 2px 8px #bbb' }} />
              <div style={{ marginTop: 8, color: '#444', fontWeight: 600 }}>Agora</div>
            </div>
          </a>
          <a href="https://docs.google.com/document/d/1Q4Gn_Ag5Sbp5MaIa6-uBdqZcfEj0pmUapV6mouQZ_XQ/edit?tab=t.0" target="_blank" rel="noopener noreferrer">
            <button style={{ padding: '10px 24px', fontSize: '1rem', borderRadius: 6, background: '#AAAAAA', color: 'white', border: 'none', cursor: 'pointer', marginTop: 24 }}>Thalassa</button>
          </a>
        </div>
      </section>
    </div>
  );
}

export default App;
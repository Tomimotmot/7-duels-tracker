import React, { useState } from 'react';
import GameListPage from './GameListPage';
import NewGameScorepad from './NewGameScorepad';

function App() {
  const [showScorepad, setShowScorepad] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSave = () => {
    setShowScorepad(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
      <h1>🏛️ 7 Wonders Duel Tracker</h1>
      <button
        style={{ margin: '16px 0', padding: '8px 20px', background: '#0074D9', color: 'white', border: 'none', borderRadius: 4, fontSize: '1rem', cursor: 'pointer' }}
        onClick={() => setShowScorepad(true)}
      >
        Neues Spiel
      </button>
      {showScorepad && (
        <NewGameScorepad
          open={true}
          onClose={() => setShowScorepad(false)}
          onSave={handleSave}
        />
      )}
      <GameListPage key={refreshKey} />
    </div>
  );
}

export default App;
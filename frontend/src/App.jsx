import { useState } from 'react'

function App() {
  const [ticker, setTicker] = useState({ symbol: "VOO", allocation: 40 });

  return (
    <div>
      <p>{ticker.symbol}: {ticker.allocation}%</p>

      <input
        type="text"
        value={ticker.symbol}
        onChange={(e) => setTicker({ symbol: e.target.value, allocation: ticker.allocation })}
      />

      <input
        type="number"
        value={ticker.allocation}
        onChange={(e) => setTicker({ symbol: ticker.symbol, allocation: e.target.value })}
      />
    </div>
  )
}

export default App
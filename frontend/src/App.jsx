import { useState } from 'react'

function App() {
  const [tickers, setTickers] = useState([
    { symbol: "VOO", allocation: 40 },
    { symbol: "NVDA", allocation: 60 },
  ]);

  return (
    <div>
      {tickers.map((t, index) => (
        <div key={index}>
          <input
            type="text"
            value={t.symbol}
            onChange={(e) => {
              const updated = [...tickers];
              updated[index] = { symbol: e.target.value, allocation: t.allocation };
              setTickers(updated);
            }}
          />
          <input
            type="number"
            value={t.allocation}
            onChange={(e) => {
              const updated = [...tickers];
              updated[index] = { symbol: t.symbol, allocation: e.target.value };
              setTickers(updated);
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default App
import { useState } from 'react'

function App() {
  const [tickers, setTickers] = useState([
    { symbol: "VOO", allocation: 40 },
    { symbol: "NVDA", allocation: 60 },
  ]);
  const [startingAmount, setStartingAmount] = useState(10000);
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-08-14");

  return (
    <div>
      <h1>Portfolio Backtester</h1>

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

      <div>
        <label>Starting amount</label>
        <input
          type="number"
          value={startingAmount}
          onChange={(e) => setStartingAmount(e.target.value)}
        />
      </div>

      <div>
        <label>Start date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <label>End date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  )
}

export default App
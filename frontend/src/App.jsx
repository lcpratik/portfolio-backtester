import { useState } from 'react'

function App() {
  const [tickers, setTickers] = useState([
    { symbol: "VOO", allocation: 40 },
    { symbol: "NVDA", allocation: 60 },
  ]);
  const [startingAmount, setStartingAmount] = useState(10000);
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-08-14");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function runBacktest() {

    setIsLoading(true);

    const allocations = {};
    for (const t of tickers) {
      allocations[t.symbol] = Number(t.allocation);
    }

    const response = await fetch("http://localhost:4000/api/backtest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allocations: allocations,
        startingAmount: Number(startingAmount),
        startDate: startDate,
        endDate: endDate,
      }),
    });

    const data = await response.json();
    console.log(data);
    const chartData = result.portfolio.series.map((point, index) => ({
      date: point.date,
      portfolioValue: point.value,
      benchmarkValue: result.benchmark.series[index].value,
    }));
    setResult(data);
    setIsLoading(false);

  }

  return (
    <>
      <div>
        <h1>Portfolio Backtester</h1>
        <button onClick={runBacktest}>Run backtest</button>

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

        <button
          onClick={() => {
            setTickers([...tickers, { symbol: "", allocation: 0 }]);
          }}
        >
          Add ticker
        </button>

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

      <button onClick={runBacktest} disabled={isLoading}>
        {isLoading ? "Running..." : "Run backtest"}
      </button>

      {result && result.error && (
        <p>Something went wrong: {result.error}</p>
      )}


      {result && !result.error && (() => {
        const chartData = result.portfolio.series.map((point, index) => ({
          date: point.date,
          portfolioValue: point.value,
          benchmarkValue: result.benchmark.series[index].value,
        }));

        return (
          <div>
            <p>Portfolio total return: {result.portfolio.stats.totalReturnPct.toFixed(2)}%</p>
            {/* chart goes here, using chartData */}
          </div>
        );
      })()}
    </>
  );
}

export default App

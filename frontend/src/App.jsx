import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import './App.css'

function App() {
  const [tickers, setTickers] = useState([
    { symbol: "VOO", allocation: 40 },
    { symbol: "NVDA", allocation: 60 },
  ]);
  const [startingAmount, setStartingAmount] = useState(10000);
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-08-14");
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
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
    setResult(data);

    if (data.portfolio) {
      const merged = data.portfolio.series.map((point, index) => ({
        date: point.date,
        portfolioValue: point.value,
        benchmarkValue: data.benchmark.series[index].value,
      }));
      setChartData(merged);
    }

    setIsLoading(false);
  }

  return (
    <div className="wrap">
      {/* NAV */}
      <nav>
        <div className="logo">
          <span className="logo-mark"></span>BACKTEST
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="eyebrow">Historical portfolio simulation</div>
        <h1>See what your portfolio<br />would've earned.</h1>
        <p className="hero-sub">
          Build an allocation, pick a date range, and run it against real historical prices.
        </p>
      </section>

      {/* BUILDER */}
      <section className="builder">
        <div className="panel panel-left">
          <div className="panel-label">Your Portfolio</div>

          {tickers.map((t, index) => (
            <div className="ticker-row" key={index}>
              <div className="ticker-badge">
                {t.symbol ? t.symbol.slice(0, 4).toUpperCase() : "—"}
              </div>
              <input
                type="text"
                className="ticker-input"
                placeholder="TICKER"
                value={t.symbol}
                onChange={(e) => {
                  const updated = [...tickers];
                  updated[index] = { symbol: e.target.value.toUpperCase(), allocation: t.allocation };
                  setTickers(updated);
                }}
              />
              <div className="alloc-input">
                <input
                  type="number"
                  value={t.allocation}
                  onChange={(e) => {
                    const updated = [...tickers];
                    updated[index] = { symbol: t.symbol, allocation: e.target.value };
                    setTickers(updated);
                  }}
                />
                <span>%</span>
              </div>
            </div>
          ))}

          <div
            className="add-ticker"
            onClick={() => setTickers([...tickers, { symbol: "", allocation: 0 }])}
          >
            <span className="add-plus">+</span> Add a ticker
          </div>
        </div>

        <div className="panel panel-right">
          <div className="panel-label">Simulation Settings</div>

          <div className="field-row">
            <div className="field">
              <div className="field-label">Starting amount</div>
              <input
                type="number"
                value={startingAmount}
                onChange={(e) => setStartingAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <div className="field-label">Start date</div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="field">
              <div className="field-label">End date</div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <button className="run-btn" onClick={runBacktest} disabled={isLoading}>
            {isLoading ? "Running…" : "Run backtest →"}
          </button>
        </div>
      </section>

      {/* RESULTS */}
      {result && result.error && (
        <section className="results">
          <p className="error-text">Something went wrong: {result.error}</p>
        </section>
      )}

      {result && !result.error && (
        <section className="results">
          <div className="results-head">
            <div>
              <h2>{startDate} — {endDate}</h2>
              <div className="range">${Number(startingAmount).toLocaleString()} starting</div>
            </div>
            <div className="legend">
              <span><span className="dot black"></span>Your Portfolio</span>
              <span><span className="dot gray"></span>Benchmark (S&amp;P 500)</span>
            </div>
          </div>

          <div className="chart-card">
            <LineChart width={640} height={320} data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="portfolioValue" stroke="#0a0a0a" strokeWidth={2.5} dot={false} name="Portfolio" />
              <Line type="monotone" dataKey="benchmarkValue" stroke="#c7c7c5" strokeWidth={2} dot={false} name="Benchmark" />
            </LineChart>
          </div>

          <div className="stat-grid">
            <div className="stat">
              <div className="stat-label">Total Return</div>
              <div className={`stat-value ${result.portfolio.stats.totalReturnPct >= 0 ? "up" : "down"}`}>
                {result.portfolio.stats.totalReturnPct >= 0 ? "+" : ""}
                {result.portfolio.stats.totalReturnPct.toFixed(2)}%
              </div>
              <div className="stat-note">
                vs {result.benchmark.stats.totalReturnPct.toFixed(2)}% benchmark
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">Annualized (CAGR)</div>
              <div className={`stat-value ${result.portfolio.stats.cagrPct >= 0 ? "up" : "down"}`}>
                {result.portfolio.stats.cagrPct >= 0 ? "+" : ""}
                {result.portfolio.stats.cagrPct.toFixed(2)}%
              </div>
              <div className="stat-note">
                vs {result.benchmark.stats.cagrPct.toFixed(2)}% benchmark
              </div>
            </div>

            <div className="stat">
              <div className="stat-label">Max Drawdown</div>
              <div className="stat-value down">
                {result.portfolio.stats.maxDrawdownPct.toFixed(2)}%
              </div>
              <div className="stat-note">Worst peak-to-trough drop</div>
            </div>
          </div>
        </section>
      )}

      <footer>
        <span>Backtest · built by Pratik</span>
        <span>Historical performance is not indicative of future results.</span>
      </footer>
    </div>
  );
}

export default App

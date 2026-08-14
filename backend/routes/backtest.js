import express from "express";
import { getDailyPrices } from "../services/alphaVantage.js";
import { simulateBuyAndHold, computeStats } from "../utils/calculation.js";

const router = express.Router();
const BENCHMARK_TICKER = "SPY";

router.post("/", async (req, res) => {
  try {
    const { allocations, startingAmount, startDate, endDate } = req.body;

    // Convert percentages (40) into decimals (0.4)
    for (const ticker in allocations) {
      allocations[ticker] = allocations[ticker] / 100;
    }

    // Build our list of tickers to fetch: portfolio tickers + the benchmark
    const tickers = Object.keys(allocations);

    const tickersToFetch = [];
    for (const t of tickers) {
      tickersToFetch.push(t);
    }
    tickersToFetch.push(BENCHMARK_TICKER);

    // Fetch prices for everything at once
    const pricePromises = tickersToFetch.map((ticker) => getDailyPrices(ticker));
    const pricesArray = await Promise.all(pricePromises);

    // Organize the results into { TICKER: [...] } shape
    const pricesByTicker = {};
    for (let i = 0; i < tickersToFetch.length; i++) {
      const ticker = tickersToFetch[i];
      pricesByTicker[ticker] = pricesArray[i];
    }

    const portfolioSeries = simulateBuyAndHold(
      pricesByTicker,
      allocations,
      startingAmount,
      startDate,
      endDate
    );
    const portfolioStats = computeStats(portfolioSeries);

    // Benchmark: same two steps, but only using the SPY ticker at 100%
    const benchmarkPrices = {};
    benchmarkPrices[BENCHMARK_TICKER] = pricesByTicker[BENCHMARK_TICKER];

    const benchmarkAllocations = {};
    benchmarkAllocations[BENCHMARK_TICKER] = 1;

    const benchmarkSeries = simulateBuyAndHold(
      benchmarkPrices,
      benchmarkAllocations,
      startingAmount,
      startDate,
      endDate
    );
    const benchmarkStats = computeStats(benchmarkSeries);

    // Send both results back
    res.json({
      portfolio: { series: portfolioSeries, stats: portfolioStats },
      benchmark: { series: benchmarkSeries, stats: benchmarkStats },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
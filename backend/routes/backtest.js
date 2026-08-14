import express from "express";
import { getDailyPrices } from "../services/alphaVantage.js";
import { simulateBuyAndHold, computeStats } from "../utils/calculations.js";

const router = express.Router();
const BENCHMARK_TICKER = "SPY";

router.post("/", async (req, res) => {
  try {
    const { allocations, startingAmount, startDate, endDate } = req.body;

    for (const ticker in allocations) {
      allocations[ticker] = allocations[ticker] / 100;
    }

    const tickers = Object.keys(allocations);
    const tickersToFetch = [...tickers, BENCHMARK_TICKER];

    const pricePromises = tickersToFetch.map((ticker) => getDailyPrices(ticker));
    const pricesArray = await Promise.all(pricePromises);

   
    const pricesByTicker = {};
    tickersToFetch.forEach((ticker, index) => {
      pricesByTicker[ticker] = pricesArray[index];
    });

  
    const portfolioSeries = simulateBuyAndHold(pricesByTicker, allocations, startingAmount, startDate, endDate);
    const portfolioStats = computeStats(portfolioSeries);

    // Benchmark: series -> stats (100% into SPY only)
    const benchmarkPrices = { [BENCHMARK_TICKER]: pricesByTicker[BENCHMARK_TICKER] };
    const benchmarkAllocations = { [BENCHMARK_TICKER]: 1 };
    const benchmarkSeries = simulateBuyAndHold(benchmarkPrices, benchmarkAllocations, startingAmount, startDate, endDate);
    const benchmarkStats = computeStats(benchmarkSeries);

    res.json({
      portfolio: { series: portfolioSeries, stats: portfolioStats },
      benchmark: { series: benchmarkSeries, stats: benchmarkStats },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to perform backtest" });
  }
});

export default router;
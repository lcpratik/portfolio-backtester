import express from "express";
import { getDailyPrices } from "../services/alphaVantage.js";
import { simulateBuyAndHold, computeStats } from "../utils/calculations.js";

const router = express.Router();
const BENCHMARK_TICKER = "SPY";

router.post("/", async (req, res) => {
  try {
    const portfolioSeries = simulateBuyAndHold(pricesByTicker, allocations, startingAmount, startDate, endDate);
    const portfolioStats = computeStats(portfolioSeries);
    const benchmarkSeries = simulateBuyAndHold(
      { [BENCHMARK_TICKER]: pricesByTicker[BENCHMARK_TICKER] },
      { [BENCHMARK_TICKER]: 1 },
      startingAmount,
      startDate,
      endDate
    );
    const benchmarkStats = computeStats(benchmarkSeries);
    res.json({
      portfolio: { series: portfolioSeries, stats: portfolioStats },
      benchmark: { series: benchmarkSeries, stats: benchmarkStats },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to perform backtest" });
  }
});

    export default router;
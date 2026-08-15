import express from "express";
import { getDailyPrices } from "../services/alphaVantage.js";
import { simulateBuyAndHold, computeStats } from "../utils/calculation.js";

const router = express.Router();
const BENCHMARK_TICKER = "SPY";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.post("/", async (req, res) => {
  try {
    const { allocations, startingAmount, startDate, endDate } = req.body;

    // Convert percentages (40) into decimals (0.4)
    for (const ticker in allocations) {
      allocations[ticker] = allocations[ticker] / 100;
    }

    // Build our list of tickers to fetch: portfolio tickers + the benchmark ticker (SPY)
    const tickers = Object.keys(allocations);

    const tickersToFetch = [];
    for (const t of tickers) {
      tickersToFetch.push(t);
    }
    tickersToFetch.push(BENCHMARK_TICKER);

    // Fetch prices ONE AT A TIME, waiting between each — respects Alpha
    // Vantage's free-tier limit of 1 request per second
    const pricesByTicker = {};
    for (const ticker of tickersToFetch) {
      const prices = await getDailyPrices(ticker);
      pricesByTicker[ticker] = prices;
      await wait(1200); // wait 1.2seconds before the next request
    }

    // Portfolio:run the simulation, then compute stats from the result
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
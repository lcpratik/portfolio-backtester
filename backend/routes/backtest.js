import express from "express";
import { getDailyPrices } from "../services/alphaVantage.js";
import { simulateBuyAndHold, computeStats } from "../utils/calculations.js";

const router = express.Router();
const BENCHMARK_TICKER = "SPY";

router.post("/", async (req, res) => {
  try {
    const portfolioSeries = simulateBuyAndHold(pricesByTicker, allocations, startingAmount, startDate, endDate);

    const portfolioStats = computeStats(portfolioSeries);

    for (const ticker in allocations) {
      allocations[ticker] = allocations[ticker] / 100;
    }

    const tickers = Object.keys(allocations);
    tickers.push(BENCHMARK_TICKER);

    // step 3: use Promise.all + .map() to fetch prices for all of them at once
    const pricePromises = tickers.map((ticker) => getDailyPrices(ticker, startDate, endDate));
    const pricesArray = await Promise.all(pricePromises);

    const pricesByTicker = {};
    tickers.forEach((ticker, index) => {
      pricesByTicker[ticker] = pricesArray[index];
    });

    const portfolioStats = await simulateBuyAndHold(pricesByTicker, allocations, startingAmount);

    const benchmarkStats = await simulateBuyAndHold(pricesByTicker, { [BENCHMARK_TICKER]: 1 }, startingAmount);
=
    res.json({ portfolio: portfolioStats, benchmark: benchmarkStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
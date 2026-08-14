import { simulateBuyAndHold, computeStats } from "./utils/calculations.js";

const pricesByTicker = {
  VOO: [
    { date: "2023-01-01", close: 100 },
    { date: "2023-06-01", close: 120 },
    { date: "2023-09-01", close: 90 },
    { date: "2024-01-01", close: 130 },
  ],
};

const allocations = { VOO: 1.0 };

const series = simulateBuyAndHold(pricesByTicker, allocations, 10000, "2023-01-01", "2024-01-01");
const stats = computeStats(series);

console.log(series);
console.log(stats);
import "dotenv/config";
import { getDailyPrices } from "./services/alphaVantage.js";
import express from "express";
import cors from "cors";


const app = express(); // express is a function that returns an object that represents the app. This object has methods for routing HTTP requests, configuring middleware, rendering HTML views, registering a template engine, and modifying application settings.

app.use(express.json());
app.use(cors());

app.get("/api/test-prices/:ticker", async (req, res) => {
  try {
    const prices = await getDailyPrices(req.params.ticker);
    res.json(prices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch daily prices" });
  }
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});


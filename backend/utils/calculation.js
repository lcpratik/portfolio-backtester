function alignByDate(pricesByTicker) {
  const tickers = Object.keys(pricesByTicker); // tickers means symbols

  // Build a Set of dates for each ticker, so we can quickly check "does this ticker have this date?"
  const dateSets = tickers.map(
    (t) => new Set(pricesByTicker[t].map((p) => p.date))
  );

  // Start from the first ticker's dates, keep only dates that exist in EVERY ticker's Set 
  const commonDates = pricesByTicker[tickers[0]]
    .map((p) => p.date)
    .filter((date) => dateSets.every((set) => set.has(date)));

  return commonDates;
}
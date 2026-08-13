function alignByDate(pricesByTicker) {
  const tickers = Object.keys(pricesByTicker); 

  const dateSets = tickers.map(
    (t) => new Set(pricesByTicker[t].map((p) => p.date))
  );

  const commonDates = pricesByTicker[tickers[0]]
    .map((p) => p.date)
    .filter((date) => dateSets.every((set) => set.has(date)));

    const closeByTickerAndDate = {};  

for (const t of tickers) {
  closeByTickerAndDate[t] = {};   

  for (const p of pricesByTicker[t]) {
    closeByTickerAndDate[t][p.date] = p.close;  
  }
}

  return { commonDates, closeByTickerAndDate };
}
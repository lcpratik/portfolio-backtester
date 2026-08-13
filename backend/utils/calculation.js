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

        for (const p of pricesByTicker[t])  
        {
            closeByTickerAndDate[t][p.date] = p.close;  
        }
    }

  return { commonDates, closeByTickerAndDate };
}

function simulateBuyAndHold(pricesByTicker, allocations, startingAmount, startDate, endDate) {
  const { commonDates, closeByTickerAndDate } = alignByDate(pricesByTicker);

  const datesInRange = commonDates.filter(
  (date) => date >= startDate && date <= endDate
    );

  const firstdate = datesInRange[0];

   for(const ticker of Object.keys(allocations)) {
        shares[ticker] = (startingAmount * allocations[ticker]) / closeByTickerAndDate[ticker][firstDate];
   }

    const series = [];  // created ONCE, before the outer loop — same rule as before

for (const date of datesInRange) {
  let totalValue = 0;
  for (const ticker of Object.keys(allocations)) {
    totalValue += shares[ticker] * closeByTickerAndDate[ticker][date];
  }
  series.push({ date, value: totalValue });
}
  return{series};
}
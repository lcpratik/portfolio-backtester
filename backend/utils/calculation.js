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

  // step 3: for each ticker in `allocations`, compute how many shares were bought
  //   shares[ticker] = (startingAmount * allocations[ticker]) / closeByTickerAndDate[ticker][firstDate]

  // step 4: for each date in the filtered range, compute total portfolio value that day
  //   value = sum over all tickers of (shares[ticker] * closeByTickerAndDate[ticker][date])

  // return an array of { date, value } objects
}
export function alignByDate(pricesByTicker) {
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

export function simulateBuyAndHold(pricesByTicker, allocations, startingAmount, startDate, endDate) {
    const { commonDates, closeByTickerAndDate } = alignByDate(pricesByTicker);

    const datesInRange = commonDates.filter(
        (date) => date >= startDate && date <= endDate
    );

    const firstdate = datesInRange[0];

    let shares = {};

    for (const ticker of Object.keys(allocations)) {
        shares[ticker] = (startingAmount * allocations[ticker]) / closeByTickerAndDate[ticker][firstdate];
    }

    const series = [];  // created ONCE, before the outer loop — same rule as before

    for (const date of datesInRange) {
        let totalValue = 0;
        for (const ticker of Object.keys(allocations)) {
            totalValue += shares[ticker] * closeByTickerAndDate[ticker][date];
        }
        series.push({ date, value: totalValue });
    }
    return series;
}

export function computeStats(series) {
  const startValue = series[0].value;
  const endValue = series[series.length - 1].value;

  const totalReturnPct = ((endValue - startValue) / startValue) * 100;
  const years = (new Date(series[series.length - 1].date) - new Date(series[0].date)) / (1000 * 60 * 60 * 24 * 365.25);
  const cagrPct = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;

  return { totalReturnPct, cagrPct };
}
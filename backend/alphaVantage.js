import axios from "axios";

 export async function getDailyPrices(ticker) {
    try {
        const response = await axios.get("https://www.alphavantage.co/query", {
            params: {
                function: "TIME_SERIES_DAILY",
                symbol: ticker,
                outputsize: "full",
                apikey: process.env.ALPHA_VANTAGE_API_KEY
            }
        });
        const series = response.data["Time Series (Daily)"];
        if(!series) {
            throw new Error("Invalid response from Alpha Vantage API");
        }
        const prices = Object.entries(series).map(([date, data]) => ({
            date,
            close: parseFloat(data["4. close"]),
        }));
        prices.sort((a, b) => new Date(a.date) - new Date(b.date));
        return prices;
    } catch (error) {
        console.error(error);
        throw error;    
    }
}
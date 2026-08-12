import axios from "axios";

async export function getDailyPrices(ticker) {
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
        return series;
    } catch (error) {
        console.error(error);
        throw error;    
    }
}
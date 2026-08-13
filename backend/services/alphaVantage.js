import axios from "axios";

 export async function getDailyPrices(ticker) {
    try {
        const response = await axios.get("https://www.alphavantage.co/query", {
            params: {
                function: "TIME_SERIES_DAILY",
                symbol: ticker,
                outputsize: "compact",
                apikey: process.env.ALPHA_VANTAGE_API_KEY
            }
        });
        console.log(response.data);
        const series = response.data["Time Series (Daily)"];
        if(!series) {
            throw new Error("Invalid response from Alpha Vantage API");
        }
        const prices = Object.entries(series).map(([date, data]) => ({
            date,
            close: parseFloat(data["4. close"]), //4. means 
        }));
        prices.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort prices by date in ascending order. negative value means a comes before b, 
        // positive value means b comes before a, and 0 means they are equal. So, if we get negative value that means it is already sorted in ascending order. If we get positive value that means it is sorted in descending order. If we get 0 that means they are equal and we can keep them in the same order.
        return prices;
    } catch (error) {
        console.error(error);
        throw error;    
    }
}
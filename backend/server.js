import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express(); // express is a function that returns an object that represents the app. This object has methods for routing HTTP requests, configuring middleware, rendering HTML views, registering a template engine, and modifying application settings.

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  res.json({ message: "Okay!" });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});


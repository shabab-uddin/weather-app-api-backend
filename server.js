
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Backend API endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city?.trim();
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city) {
      return res.status(400).json({
        error: "Please enter a city name."
      });
    }

    if (!apiKey || apiKey === "PASTE_YOUR_API_KEY_HERE") {
      return res.status(500).json({
        error: "Weather API key is not configured on the server."
      });
    }

    const url = new URL(
      "https://api.openweathermap.org/data/2.5/weather"
    );

    url.searchParams.set("q", city);
    url.searchParams.set("appid", apiKey);
    url.searchParams.set("units", "metric");

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          error: "City not found. Please check the spelling."
        });
      }

      if (response.status === 401) {
        return res.status(502).json({
          error: "Weather API key is invalid or not active yet."
        });
      }

      return res.status(502).json({
        error: "The weather service is temporarily unavailable."
      });
    }

    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    });
  } catch (error) {
    console.error("Weather request failed:", error.message);

    res.status(500).json({
      error: "Could not retrieve weather. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Weather app running on http://localhost:${PORT}`);
});

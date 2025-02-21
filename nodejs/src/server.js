const express = require("express");
const cors = require("cors");
const axios = require("axios");
const NodeCache = require("node-cache");

const app = express();
app.use(cors());

const API_KEY = "1faa79df56bb438:630wax86moi1t7z";
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

const fetchGDPData = async (country) => {
  const cacheKey = `gdp_${country}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get(
      `https://api.tradingeconomics.com/historical/country/${country}/indicator/GDP?c=${API_KEY}`,
    );
    const data = response.data.map((item) => ({
      year: new Date(item.DateTime).getFullYear(),
      value: item.Value,
    }));
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${country}:`, error.response?.data || error.message);
    throw error;
  }
};

app.get("/api/gdp/:country", async (req, res) => {
  const country = req.params.country;
  try {
    const data = await fetchGDPData(country);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: "Failed to fetch GDP data" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

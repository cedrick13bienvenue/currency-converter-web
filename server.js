const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.EXCHANGE_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Get supported currencies
app.get("/api/currencies", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/codes`,
      {
        timeout: 10000,
      }
    );

    if (response.data.result === "success") {
      const currencies = response.data.supported_codes.map((code) => ({
        code: code[0],
        name: code[1],
      }));
      res.json({ success: true, currencies });
    } else {
      res.status(400).json({ error: "Failed to fetch currencies" });
    }
  } catch (error) {
    console.error("Currency fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch currencies" });
  }
});

// Convert currency
app.post("/api/convert", async (req, res) => {
  try {
    const { amount, from, to } = req.body;

    // Validation
    if (!amount || !from || !to) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    // Same currency conversion
    if (from === to) {
      return res.json({
        success: true,
        result: parseFloat(amount),
        rate: 1,
        from,
        to,
      });
    }

    // Fetch exchange rate
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}`,
      { timeout: 10000 }
    );

    if (response.data.result === "success") {
      const rate = response.data.conversion_rate;
      const result = amount * rate;

      res.json({
        success: true,
        result: parseFloat(result.toFixed(2)),
        rate,
        from,
        to,
      });
    } else {
      res.status(400).json({ error: "Invalid currency pair" });
    }
  } catch (error) {
    console.error("Conversion error:", error.message);

    if (error.code === "ECONNABORTED") {
      res.status(408).json({ error: "Request timeout" });
    } else {
      res.status(500).json({ error: "Conversion failed" });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Currency Converter running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} to view the app`);

  if (!API_KEY) {
    console.log(
      "⚠️  Warning: EXCHANGE_API_KEY not found in environment variables"
    );
  }
});

module.exports = app;

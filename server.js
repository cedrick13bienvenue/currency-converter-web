const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path"); // ADD THIS LINE - was missing
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

// Get supported currencies
app.get("/api/currencies", async (req, res) => {
  try {
    console.log("Fetching currencies...");

    if (!API_KEY) {
      console.error("API key not configured");
      return res
        .status(500)
        .json({ success: false, error: "API key not configured" });
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
      console.log(`Loaded ${currencies.length} currencies`);
      res.json({ success: true, currencies });
    } else {
      console.error("API returned error:", response.data);
      res
        .status(400)
        .json({ success: false, error: "Failed to fetch currencies" });
    }
  } catch (error) {
    console.error("Currency fetch error:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch currencies" });
  }
});

// Convert currency
app.post("/api/convert", async (req, res) => {
  try {
    const { amount, from, to } = req.body;
    console.log(`Converting ${amount} ${from} to ${to}`);

    // Validation
    if (!amount || !from || !to) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    if (!API_KEY) {
      return res
        .status(500)
        .json({ success: false, error: "API key not configured" });
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
      console.error("Conversion API error:", response.data);
      res.status(400).json({ success: false, error: "Invalid currency pair" });
    }
  } catch (error) {
    console.error("Conversion error:", error.message);

    if (error.code === "ECONNABORTED") {
      res.status(408).json({ success: false, error: "Request timeout" });
    } else {
      res.status(500).json({ success: false, error: "Conversion failed" });
    }
  }
});

// Catch-all handler for undefined routes - Express 5.x compatible
app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ success: false, error: "API endpoint not found" });
  } else {
    res.sendFile(path.join(__dirname, "public", "index.html"));
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
    console.log("Please set EXCHANGE_API_KEY in your .env file");
  } else {
    console.log("✅ API key configured");
  }
});

module.exports = app;

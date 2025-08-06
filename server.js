

const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const axios = require("axios");
const db = require("./server/db");
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Finnhub API
const FINNHUB_API_KEY = "d290t0hr01qvka4rjcfgd290t0hr01qvka4rjcg0"; // replace with your real API key

// Fetch last 5 investments
app.get("/api/investments", (req, res) => {
  const sql = `SELECT * FROM investments ORDER BY id DESC LIMIT 5`;
  db.query(sql, async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    const enriched = await Promise.all(results.map(async inv => {
      const url = `https://finnhub.io/api/v1/quote?symbol=${inv.symbol}&token=${FINNHUB_API_KEY}`;
      try {
        const { data } = await axios.get(url);
        const current_price = data.c || inv.price;
        return {
          ...inv,
          amount_invested: (inv.price * inv.quantity).toFixed(2),
          current_price,
          current_value: (current_price * inv.quantity).toFixed(2),
        };
      } catch (err) {
        return { ...inv, current_price: inv.price, current_value: (inv.price * inv.quantity).toFixed(2) };
      }
    }));
    res.json(enriched);
  });
});

// Portfolio value and profit
app.get("/api/portfolio-status", async (req, res) => {
  const sql = `SELECT * FROM investments`;
  db.query(sql, async (err, rows) => {
    if (err) return res.status(500).json({ error: err });

    let total_invested = 0;
    let total_current = 0;

    for (let inv of rows) {
      const url = `https://finnhub.io/api/v1/quote?symbol=${inv.symbol}&token=${FINNHUB_API_KEY}`;
      try {
        const { data } = await axios.get(url);
        const live_price = data.c || inv.price;
        total_invested += inv.price * inv.quantity;
        total_current += live_price * inv.quantity;
      } catch (e) {
        total_invested += inv.price * inv.quantity;
        total_current += inv.price * inv.quantity;
      }
    }

    res.json({
      total_invested: total_invested.toFixed(2),
      total_current: total_current.toFixed(2),
      profit_loss: (total_current - total_invested).toFixed(2)
    });
  });
});

// Sector-wise chart
app.get("/api/chart-data", (req, res) => {
  const sql = `SELECT sector, SUM(price * quantity) AS total FROM investments GROUP BY sector`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

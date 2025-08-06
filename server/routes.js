const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all investments
router.get('/investments', (req, res) => {
  db.query("SELECT * FROM investments ORDER BY date DESC LIMIT 5", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Add a new investment
router.post('/buy', (req, res) => {
  const { company_name, symbol, current_price, sector, quantity, amount_invested } = req.body;
  const sql = "INSERT INTO investments (company_name, symbol, current_price, sector, quantity, amount_invested) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [company_name, symbol, current_price, sector, quantity, amount_invested], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

// Get sector-wise data for Pie Chart
router.get('/sector-data', (req, res) => {
  db.query("SELECT sector, SUM(quantity) AS total FROM investments GROUP BY sector", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = router;

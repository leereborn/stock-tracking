var express = require("express");
var router = express.Router();

const Stock = require("../models/stock.js");

router.get("/init", (req, res) => {
  const newStock1 = new Stock({
    stockname: "apple",
    price: 121.42,
  });

  const newStock2 = new Stock({
    stockname: "google",
    price: 2097.07,
  });

  const newStock3 = new Stock({
    stockname: "amazon",
    price: 3333.43,
  });
  newStock1.save();
  newStock2.save();
  newStock3.save();
  res.json({ isSuccess: true, message: "Initialized" });
});

router.post("/addorupdate", (req, res) => {
  const { stockname, price } = req.body;
  Stock.findOne({ stockname: stockname }).exec((err, stock) => {
    if (stock) {
      stock.price = price;
      stock.save();
      res.json({ isSuccess: true, message: "Price updated" });
    } else {
      const newStock = new Stock({
        stockname: stockname,
        price: price,
      });
      newStock.save();
      res.json({ isSuccess: true, message: "New stock added" });
    }
  });
});

router.get("/all", (req, res) => {
  Stock.find({}, (err, docs) => {
    if (err) return res.status(500).json({ isSuccess: false, message: err });
    res.json({ isSuccess: true, message: docs });
  });
});
module.exports = router;

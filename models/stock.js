const mongoose = require("mongoose");
const StockSchema = new mongoose.Schema({
  stockname: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;

const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
  asset: { type: String, required: true },
  quantity: { type: Number, required: true },
  fromBase: { type: String, required: true },
  toBase: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transfer", transferSchema);

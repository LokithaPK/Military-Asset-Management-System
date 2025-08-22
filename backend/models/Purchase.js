const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  asset: { type: String, required: true },
  quantity: { type: Number, required: true },
  base: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Purchase", purchaseSchema);

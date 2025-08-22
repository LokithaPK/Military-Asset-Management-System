const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  asset: { type: String, required: true },
  assignedTo: { type: String, required: true },
  base: { type: String, required: true },
  expended: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Assignment", assignmentSchema);

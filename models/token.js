const mongoose = require("mongoose");
const schema = mongoose.Schema;

const tokenSchema = schema({
  modId: { type: String, unique: true, required: true },
  token: { type: String, unique: true, required: true },
  createAt: { type: Date, default: Date.now, expires: 30 * 86400 },
});

const ModToken = new mongoose.model("ModToken", tokenSchema);

module.exports = ModToken;

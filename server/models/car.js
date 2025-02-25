const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CarSchema = new Schema({
  make: String,
  model: String,
  manufactureYear: Number,
  price: Number,
  imageUrl: String,
});

module.exports = mongoose.model("Car", CarSchema);

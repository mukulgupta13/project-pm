const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100,
  },
  subtitle: {
    type: String,
    maxLength: 100,
  },
  description: {
    type: String,
    maxLength: 1000,
  },
  code: {
    type: String,
    required: true,
    maxLength: 20,
    unique: true
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

contentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Content", contentSchema);

const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  file_path: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

fileSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  next();
});

module.exports = mongoose.model("File", fileSchema);

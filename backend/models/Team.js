const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema({
    name: {
      type: String,
      reqired: true,
      maxLength:256,
      unique: true,
    },
    description: {
      type: String
    },
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    members: {
      type: Array
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
  
  teamSchema.pre("save", function (next) {
      this.updatedAt = Date.now();
      next();
    });
    
    module.exports = mongoose.model("Team", teamSchema);
    
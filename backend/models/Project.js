const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    reuired: true,
    maxLength:50,
    unique: true,
  },
  code: {
    type: Number,
    required: true,
    maxLength: 30,
    unique:true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxLength: 1000,
  },
  startDate: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: String,
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

projectSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
  });
  
  module.exports = mongoose.model("Project", projectSchema);
  
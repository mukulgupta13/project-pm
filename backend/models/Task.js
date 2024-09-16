const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  ID: {
    type: Number,
    reqired: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  project: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  efforts: {
    type: Number,
    required: true,
  },
  importance: {
    type: Number,
    required: true,
  },
  IsDeleted:{
    type: Boolean,
  },
  createdBy:{
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

taskSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
  });
  
  module.exports = mongoose.model("Task", taskSchema);
  
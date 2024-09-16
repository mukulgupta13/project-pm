const mongoose = require("mongoose");
const timesheetSchema = new mongoose.Schema({
  date: {
    type:Date,
  },
  task: {
    type:String,
  },
  starttime: {
    type: String,
  },
  endtime: {
    type: String,
  },
  duration: {
    type: String,
  },
  status: {
    type: String,
  },
  employee: {
    type: mongoose.Types.ObjectId,
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

timesheetSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
  
  module.exports = mongoose.model("Timesheet", timesheetSchema);
  
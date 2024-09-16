const mongoose = require("mongoose");
const projectAssignmentSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  teams: {
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

projectAssignmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("ProjectAssigment", projectAssignmentSchema);

const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    reqired: true,
    maxLength:256,
    unique: true,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
  },
  phonenumber: {
    type: String,
  },
  dob: {
    type: Date,
  },
  dom: {
    type: Date,
  },
  addressline1: {
    type: String,
  },
  addressline2: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pincode: {
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

employeeSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
  });
  
  module.exports = mongoose.model("Employee", employeeSchema);
  
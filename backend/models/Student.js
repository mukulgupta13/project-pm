const mongoose = require("mongoose");
const User = require("./User");
const { dobValidator } = require("../common/validator");

const studentSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
    validate: {
      validator: dobValidator,
      message: (props) => `${props.value} is not a valid Date of Birth string`,
    },
  },
  occupation: {
    type: String,
    maxlength: 50,
  },
  gender: {
    type: String,
    validate: {
      validator: (v) => ["male", "female", "others"].includes(v),
      message: (props) => `${props.value} is not a valid gender`,
    },
  },
  gmeet: {
    type: String,
  },
  whatsapp: {
    type: String,
  },
  current_standard: {
    type: String,
    required: true,
    maxlength: 50,
  },
});

const Student = User.discriminator("Student", studentSchema);

module.exports = mongoose.model("Student");

const mongoose = require("mongoose");
const User = require("./User");

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100,
  },
  pin_code: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v.toString().length === 6,
      message: (props) => `${props.value} is not a valiud pin code.`,
    },
  },
  geo_tag_location: {
    longtitude: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v > -180 && v < 180,
        message: (props) => `${props.value} is not a valid longtitude!`,
      },
    },
    latitude: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v > -90 && v < 90,
        message: (props) => `${props.value} is not a valid latitude!`,
      },
    },
  },
});

const School = User.discriminator("School", schoolSchema);

module.exports = mongoose.model("School");

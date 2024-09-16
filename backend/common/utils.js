var ObjectId = require('mongoose').Types.ObjectId;
require("dotenv").config({ path: `../.env.${process.env.NODE_ENV}` });
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function userWithEmailExists(email, userId) {
  const filter = { email: email };
  if (userId) {
    var objId = new ObjectId(userId);
    filter._id =  { '$ne': objId };
  }
  const user = await User.findOne(filter);
  if (user) return true;
  return false;
}

async function userWithPhoneExists(phoneNumber, userId) {
  const filter = { phone_number: phoneNumber };
  if (userId) {
    var objId = new ObjectId(userId);
    filter._id =  { '$ne': objId };
  }
  const user = await User.findOne(filter);
  if (user) return true;
  return false;
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
  userWithEmailExists,
  generateAccessToken,
  generateRefreshToken,
  userWithPhoneExists
};

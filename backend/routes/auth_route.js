const express = require("express");
const router = express.Router();
const {
  registerUser, 
  login,
  logout,
  token,
} = require("../controller/auth_controller");
const {
  loginRequestValidator,
  registerValidator,
} = require("../middleware/validator_middleware");

router.post("/register", registerValidator(), registerUser);

router.post("/login", loginRequestValidator, login);

router.delete("/logout", logout);

router.post("/token", token);


module.exports = router;


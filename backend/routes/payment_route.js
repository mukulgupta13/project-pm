const express = require("express");
const router = express.Router();
const {
  razorpayPayment,
  completePayment,
} = require("../controller/payment_controller");
const {
  paymentRequestValidator,
} = require("../middleware/validator_middleware");

router.post("/razorpay", paymentRequestValidator, razorpayPayment);

router.post("/complete", completePayment);

module.exports = router;

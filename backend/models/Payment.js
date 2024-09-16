const mongoose = require("mongoose");

const paymentDetailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  razorpay_customer_id: {
    type: String,
  },
  paytm_customer_id: {
    type: String,
  },
  razorpay_subscription_id: {
    type: String,
  },
});

const membershipPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  user_type: {
    type: String,
    enum: ["student", "school"],
  },
  subscription_type: {
    type: String,
    enum: ["monthly", "yearly"],
  },
  razorpay_plan_id: {
    type: String,
  },
  paytm_plan_id: {
    type: String,
  },
});

const PaymentDetail = mongoose.model("PaymentDetail", paymentDetailSchema);
const Membership = mongoose.model("Membership", membershipPlanSchema);

module.exports = { PaymentDetail, Membership };

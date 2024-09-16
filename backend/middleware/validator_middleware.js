const User = require("../models/User");
const { check } = require("express-validator");
const {
  ValidationError,
  ObjectDoesNotExist,
  SubscriptionError,
} = require("../common/error_types");

function loginRequestValidator(req, res, next) {
  const { email_or_phone, password } = req.body;

  if (!email_or_phone) {
    return next(new ValidationError(400, "Email or phone number is required."));
  }
  if (!password) {
    return next(new ValidationError(400, "Password field is required."));
  }
  next();
}

const passwordValidator = () => {
  return check("password")
    .notEmpty()
    .withMessage("This field is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom((value) => !/\s/.test(value))
    .withMessage("Password cannot contain spaces");
};

const registerSchoolValidator = () => {
  // checks request body against the validator for school registration
  return [
    check("name").notEmpty().trim(),
    check("email", "Email is required").notEmpty().isEmail().normalizeEmail(),
    passwordValidator(),
    check("pin_code", "Pin code is required").notEmpty(),
    check("longtitude", "Longtitude is required").notEmpty(),
    check("latitude", "Latitude is required").notEmpty(),
  ];
};

const registerValidator = () => {
  // checks request body against the validator for student registration
  return [
    check("phone_number", "Phone number is required").notEmpty(),
    check("email", "Email is required")
      .optional({ checkFalsy: true })
      .isEmail(),
    passwordValidator(),
    check("first_name", "First name is required").trim(),
    check("last_name", "Last name is required").notEmpty().trim(),
  ];
};

const updateStudentValidator = () => {
  // checks request body against the validator for student registration
  return [
    check("phone_number", "Phone number is required").notEmpty(),
    check("email", "Email is required")
      .optional({ checkFalsy: true })
      .isEmail()
      .normalizeEmail(),
    check("first_name", "First name is required").trim(),
    check("last_name", "Last name is required").notEmpty().trim(),
    check("dob", "Date of birth is required").notEmpty(),
    check("occupation", "Occupation is required").notEmpty().trim(),
    check("gender", "Gender is required").notEmpty(),
    check("current_standard", "Current Standard is required").notEmpty(),
  ];
};

async function paymentRequestValidator(req, res, next) {
  const { email_or_phone } = req.body;
  if (!email_or_phone) {
    return next(new ValidationError(400, "Email or phone number is required"));
  }
  let user;
  const include_fields = ["is_subscribed", "email", "role", "phone_number"];
  user = await User.findOne({ email: email_or_phone }).select(include_fields);
  if (!user) {
    user = await User.findOne({ phone_number: email_or_phone }).select(
      include_fields
    );
  }
  if (!user) {
    return next(new ObjectDoesNotExist(404, "User does not exist."));
  }
  if (user.is_subscribed) {
    return next(new SubscriptionError(401, "User is already subscribed."));
  }
  req.user = user;
  next();
}

function changePwdRequestValidator(req, res, next) {
  const { newPassword, password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password field is empty",
      error: [
        {
          password: "This field is required.",
        },
      ],
    });
  }
  if (!newPassword) {
    return res.status(400).json({
      success: false,
      message: "New Password field is empty",
      error: [
        {
          password: "This field is required.",
        },
      ],
    });
  }
  next();
}
module.exports = {
  changePwdRequestValidator,
  loginRequestValidator,
  registerSchoolValidator,
  registerValidator,
  updateStudentValidator,
  paymentRequestValidator,
};

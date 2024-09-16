const mongoose = require("mongoose");
const { emailValidator, phoneNumberValidator } = require("../common/validator");

const options = { discriminatorKey: "role" };

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      minLength: 10,
      validate: {
        validator: emailValidator,
        message: (props) => `${props.value} is not a valid email address`,
      },
      index: { unique: true, sparse: true },
    },
    password: {
      type: String,
      required: true,
    },
    txtPwd:{type: String},
    is_user: {
      type: Boolean,
      default: false,
      immutable: true,
    },
    is_active: {
      type: Boolean,
      default: true,
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

    tokens: [{
      token: {
        type: String,
        required: true
      }
    }]
  },
  options
);

userSchema.methods.display = function () {
  console.log(`${this}`);
};

userSchema.pre("save", function (next) {
  console.log("pre save");
  this.updatedAt = Date.now();
  next();
});

userSchema.pre("validate", function (next) {
  if (this.email == null) {
    // make email required for all users
    this.invalidate("email", "Email is required");
  }
  const temp = this.toObject();
  // and hasOwnProperty returns false when checking
  // against mongoose document object,
  // so it need to be converted to plain object
  if (!temp.hasOwnProperty("role") && this.email == null) {
    // makes sure user other than school has email
    this.invalidate("email", "Email is required");
  }
  next();
});

const bcrypt = require('bcryptjs');
// This function will be called before user object get saved in the Users collection. It will simply hash the plain text passord if it is modified by the user.
userSchema.pre('save', async function (next) {
  const user = this
  // It will check if the password is being modified or not.
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})
const jwt = require('jsonwebtoken')
userSchema.methods.generateUserToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber }, 'thesecretcode');
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email })
  if (!user) {
    throw new Error('Unable to Signin1')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable to Signin:2')
  }
  return user
}

const User = mongoose.model("User", userSchema);

module.exports = User;

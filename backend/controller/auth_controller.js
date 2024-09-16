require("dotenv").config({ path: `../.env.${process.env.NODE_ENV}` });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const {
  userWithEmailExists,
  userWithPhoneExists,
  generateAccessToken,
  generateRefreshToken,
} = require("../common/utils");
const User = require("../models/User");
const catchAsync = require("../common/catch_async");
const {
  DuplicateEntry,
  ObjectDoesNotExist,
  ValidationError,
  UnAuthorized,
} = require("../common/error_types");



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Module for creating, logging in and logging out users.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     School:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Auto generated id of school.
 *         name:
 *           type: string
 *           description: Name of school.
 *         pin_code:
 *           type: number
 *           description: Pin code of school.
 *           example: 123456
 *         email:
 *           type: string
 *           description: Email of school.
 *           format: email
 *         phone_number:
 *           type: string
 *           description: Phone number of school.
 *         geo_tag_location:
 *           description: Geo tag location of the school.
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               description: Latitude of school.
 *               example: 23.56
 *             longitude:
 *               type: number
 *               description: Longitude of school.
 *               example: -23.56
 *     Student:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           description: First name of student.
 *         last_name:
 *           type: string
 *           description: Last name of student.
 *         dob:
 *           type: date
 *           description: Date of birth of student.
 *           format: date
 *         email:
 *           type: string
 *           description: Email of school.
 *           format: email
 *         phone_number:
 *           type: string
 *           description: Phone number of school.
 *         occupation:
 *           type: string
 *           description: Occupation of student.
 *         gender:
 *           type: string
 *           description: Gender of the student.
 *           enum: ["male", "female", "others"]
 *         current_standard:
 *           type: string
 *           description: The current grade of the student.
 */

/**
 * @swagger
 * /register-user:
 *  post:
 *   summary: Register student user.
 *   description: Register student user.
 *   tags: [Auth]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               properties:
 *                 password:
 *                   type: string
 *                   format: password
 *                   description: Password of the school.
 *                   minLength: 8
 *             - $ref: '#/components/schemas/Student'
 *               required:
 *                 - phone_number
 *                 - password
 *                 - first_name
 *                 - last_name
 *                 - dob
 *                 - gender
 *                 - current_standard
 *   responses:
 *     201:
 *       description: Student user succssfully created.
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/responses/success'
 *               - type: object
 *                 properties:
 *                   data:
 *                     type: array
 *                     length: 1
 *                     items:
 *                       allOf:
 *                         - type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: Auto generated id of student.
 *                         - $ref: '#/components/schemas/Student'
 *
 *
 *     400:
 *       description: Invalid data.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/responses/error'
 *     500:
 *       description: Internal server error.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/responses/error'
 */
const registerUser = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationError(400, "Invalid data.", errors.array()));
  }
  const {
    phone_number,
    email,
    password,
    first_name,
    last_name
  } = req.body;

  if (email && (await userWithEmailExists(email))) {
    // check if request body has email
    // because passing undefined to model.findOne
    // returns first data from database
    return next(new DuplicateEntry(400, "Email address already in use."));
  }
  if (await userWithPhoneExists(phone_number)) {
    return next(new DuplicateEntry(400, "Phone number already in use."));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const student = await User.create({
    email: email,
    phone_number: phone_number,
    password: hashedPassword,
    first_name: first_name,
    last_name: last_name
  });
  return res.status(201).json({
    success: true,
    message: "User successfully registered.",
    data: [
      {
        id: student.id,
        email: student.email,
        first_name: student.first_name,
        last_name: student.last_name,
        phone_number: student.phone_number
      },
    ],
  });
});

/**
 * @swagger
 * /login:
 *  post:
 *   summary: Provide access and refresh token for authenticating users.
 *   description: Only subscribed users can get tokens.
 *   tags: [Auth]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - email_or_phone
 *             - password
 *           properties:
 *             email_or_phone:
 *               type: string
 *               description: Email address or phone number of the user.
 *             password:
 *               type: string
 *               description: Password of the user.
 *   responses:
 *     200:
 *       description: Tokens successfully generated.
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/responses/success'
 *               - type: object
 *                 properties:
 *                   data:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/token'
 *     4XX:
 *       description: Error occurred.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/responses/error'
 *     500:
 *       description: Internal server error.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/responses/error"
 */
const login = catchAsync(async (req, res, next) => {
  const { email_or_phone, password } = req.body;

  let user;
  user = await User.findOne({ email: email_or_phone });
  if (!user) {
    user = await User.findOne({ phone_number: email_or_phone });
  }
  if (user == null) {
    return next(
      new ObjectDoesNotExist(404, "Account not found with given credentials.")
    );
  }

  if (await bcrypt.compare(password, user.password)) {
    const { email, phone_number, id, role, is_admin } = user;

    const accessToken = generateAccessToken({
      id,
      phone_number,
      email,
      role,
      is_admin,
    });
    const refreshToken = generateRefreshToken({
      id,
      phone_number,
      email,
      role,
      is_admin
    });
    return res.status(200).json({
      success: true,
      message: "Login successfull.",
      data: [
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      ],
    });
  } else {
    return next(
      new UnAuthorized(401, "Invalid email/phone number or password.")
    );
  }
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Log out user.
 *     tags: [Auth]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       204:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/success'
 *       401:
 *         description: No token provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/error'
 */
const logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) {
    return next(new UnAuthorized(401, "No token provided."));
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err) => {
      if (err) {
        return next(new UnAuthorized(403, "Invalid token."));
      }
      return res.status(204).json({
        success: true,
        message: "Logout successful.",
      });
    }
  );
});

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Provide access token to the user.
 *     description: Provide access token to the user based on refresh token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: A valid refresh token.
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/responses/success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                        type: object
 *                        properties:
 *                          accessToken:
 *                            type: string
 *
 *     400:
 *       description: No token provided.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/responses/error'
 *     401:
 *       description: Invalid token.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/responses/error'
 *     500:
 *       description: Internal server error.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/responses/error'
 */

const token = catchAsync(async (req, res, next) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) {
    return next(new ValidationError(401, "No token provided."));
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) {
        return next(new UnAuthorized(403, "Invalid token."));
      }

      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        is_admin: user.is_admin,
      });
      return res.status(200).json({
        success: true,
        message: "Token refreshed.",
        data: [
          {
            accessToken: accessToken,
          },
        ],
      });
    }
  );
});

module.exports = {
  registerUser,
  login,
  logout,
  token
};

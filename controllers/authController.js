const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const {
  createJwt,
  attachCookiesToResponse,
  isTokenvalid,
} = require("../utils/jwt");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  // check if user already exists
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({ name, email, password, verificationToken });
  if (!user) {
    throw new CustomError.BadRequestError(
      "Sorry could not register, try again !"
    );
  }
  const origin = process.env.ORIGIN;
  await sendVerificationEmail(name, email, verificationToken, origin);

  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email",
    data: user,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("No user found");
  }
  const passwordMatch = await user.comparePassword(req.body.password);
  if (!passwordMatch) {
    throw new CustomError.UnauthenticatedError("Incorrect password");
  }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError(
      "Please verify your email to login"
    );
  }
  const token = createJwt({
    name: user.name,
    userID: user._id,
    role: user.role,
  });

  // create refresh token
  let refreshToken = "";

  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user, refreshToken });
    res.status(StatusCodes.OK).json({
      user,
      // tokenModel,
    });
    return;
  }

  // check for existing token
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, userAgent, ip, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user, refreshToken });
  res.status(StatusCodes.OK).json({
    user,
    // tokenModel,
  });
};

exports.logout = async (req, res) => {
  res.cookie("token", " ", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({
    msg: "logout",
  });
};

exports.verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  if (!verificationToken) {
    throw new CustomError.BadRequestError("Sorry no token found");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("Sorry no user found");
  }
  if (user.verificationToken != verificationToken) {
    throw new CustomError.BadRequestError("Sorry your token does not match");
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  await user.save();
  res.status(StatusCodes.OK).json({
    msg: "email verified",
    verificationToken,
    user,
  });
};

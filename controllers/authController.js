const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const jwtMethod = require("../utils/jwt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  // check if user already exists
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  const user = await User.create({ name, email, password });
  if (!user) {
    throw new CustomError.BadRequestError(
      "Sorry could not register, try again !"
    );
  }
  const token = jwtMethod.createJwt({
    name,
    userID: user._id,
    role: user.role,
  });
  jwtMethod.attachCookiesToResponse({ res, token });

  res.status(StatusCodes.CREATED).json({
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
  const token = jwtMethod.createJwt({
    name: user.name,
    userID: user._id,
    role: user.role,
  });
  jwtMethod.attachCookiesToResponse({ res, token });
  res.status(StatusCodes.OK).json({
    user,
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

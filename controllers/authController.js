const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const jwtMethod = require("../utils/jwt");

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
  const token = jwtMethod.createJwt({ name, userID: user._id });
  res.status(StatusCodes.CREATED).json({
    data: user,
    token,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  res.status(StatusCodes.OK).json({
    data: user,
  });
};

// exports.logout = async (req, res) => {
exports.logout = (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "logout",
  });
};

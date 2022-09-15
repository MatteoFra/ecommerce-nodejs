const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors/index");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(email, name, password);
  // check if user already exists
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError("Email already exists");
  }

  const user = await User.create({ name, email, password });
  res.status(StatusCodes.CREATED).json({
    data: user,
  });
};

// exports.login = async (req, res) => {
exports.login = (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "login",
  });
};

// exports.logout = async (req, res) => {
exports.logout = (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "logout",
  });
};

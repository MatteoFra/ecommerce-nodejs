const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

exports.getAllUsers = async (req, res) => {
  // console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");
  if (!users) {
    throw new CustomError.NotFoundError("No user found");
  }
  res.status(StatusCodes.OK).json({
    users,
  });
};
exports.getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError("No user found");
  }
  res.status(StatusCodes.OK).json({
    user,
  });
};
exports.showCurrentUser = async (req, res) => {
  const { user } = req;
  res.status(StatusCodes.OK).json({
    user,
  });
};
exports.updateUser = async (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "ok",
  });
};
exports.updateUserPassword = async (req, res) => {
  const { userID } = req.user;
  const user = await User.findById(userID);
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("You need to provide both passwords");
  }
  const matchingPassword = await user.comparePassword(oldPassword);
  if (!matchingPassword) {
    throw new CustomError.UnauthenticatedError("Wrong old password");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({
    user,
  });
};

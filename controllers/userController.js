const User = require("../models/userModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const jwtMethod = require("../utils/jwt");
const checkPermissions = require("../utils/checkPermissions");

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
  checkPermissions(req.user, id);
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

exports.updateUser = async (req, res) => {
  const { userID } = req.user;
  const { name, email } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError(
      "Please provide informations to update"
    );
  }
  const user = await User.findByIdAndUpdate(userID, req.body, {
    new: true,
    runValidators: true,
  });
  await user.save();
  const token = jwtMethod.createJwt({
    name: user.name,
    userID: user._id,
    role: user.role,
  });
  jwtMethod.attachCookiesToResponse({ res, token });

  res.status(StatusCodes.OK).json({
    msg: "Updated",
    token,
  });
};

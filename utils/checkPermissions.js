const CustomError = require("../errors/index");

const checkPermissions = (reqUser, resUserID, next) => {
  const { role, userID } = reqUser;
  if (role === "admin") return;
  if (userID === resUserID) return;
  throw new CustomError.UnauthorizeError("Sorry you can not access this route");
};

module.exports = checkPermissions;

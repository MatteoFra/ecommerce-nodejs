const CustomError = require("../errors/index");
const jwtMethod = require("../utils/jwt");

exports.authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("You are not logged in");
  }
  try {
    const { name, userID, role } = jwtMethod.isTokenvalid({ token });
    req.user = { name, userID, role };
    next();
  } catch (err) {
    throw new CustomError.UnauthenticatedError("Invalid authentication");
  }
};

exports.authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizeError(
        "Sorry you can not access this route"
      );
    }
    next();
  };
};

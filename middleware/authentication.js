const Token = require("../models/tokenModel");
const CustomError = require("../errors/index");
const { isTokenvalid, attachCookiesToResponse } = require("../utils/jwt");

exports.authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  // const token = req.signedCookies.token;
  // if (!token) {
  //   throw new CustomError.UnauthenticatedError("You are not logged in");
  // }
  try {
    if (accessToken) {
      const payload = isTokenvalid(accessToken);
      req.user = payload;
      return next();
    }
    const payload = isTokenvalid(refreshToken);
    const existingToken = await Token.findOne({
      user: payload._id,
      refreshToken: payload.refreshToken,
    });
    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError("Invalid authentication");
    }
    attachCookiesToResponse({
      res,
      user: payload,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload;
    next();
    // const { name, userID, role } = jwtMethod.isTokenvalid({ token });
    // req.user = { name, userID, role };
    // next();
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

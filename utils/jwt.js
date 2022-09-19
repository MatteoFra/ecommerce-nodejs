const jwt = require("jsonwebtoken");

// exports.createJwt = payload => {
const createJwt = payload => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
// exports.createJwt = payload => {
//   const token = jwt.sign(payload, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
//   return token;
// };

const isTokenvalid = token => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJwt({ payload: user });
  const refreshTokenJWT = createJwt({ user, refreshToken });

  const oneDay = 1000 * 60 * 60 * 24;
  const fiveDays = oneDay * 5;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: 1000 * 60 * 15,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + fiveDays),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};
// exports.attachCookiesToResponse = ({ res, token }) => {
//   const oneDay = 1000 * 60 * 60 * 24;
//   const fiveSeconds = 1000 * 5;

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + fiveSeconds),
//     secure: process.env.NODE_ENV === "production",
//     signed: true,
//   });
// };

module.exports = { createJwt, attachCookiesToResponse, isTokenvalid };

const jwt = require("jsonwebtoken");

exports.createJwt = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

exports.isTokenvalid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const jwt = require("jsonwebtoken");

const config = require("../config");

const createToken = (userId, userTypeMapId) =>
  jwt.sign({ userId, userTypeMapId }, config.jwt.secret, {
    expiresIn: "8h",
  });

const verifyToken = (token) => {
  try {
    const verifiedToken = jwt.verify(token, config.jwt.secret);

    return verifiedToken;
  } catch (e) {
    return null;
  }
};

module.exports = {
  createToken,
  verifyToken,
};

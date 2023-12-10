const jwt = require("jsonwebtoken");

const config = require("../config");

const createToken = (userTypeMapId) =>
  jwt.sign({ userTypeMapId }, config.jwt.secret, {
    // TODO: Скорректировать время жизни токена
    expiresIn: "30s",
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

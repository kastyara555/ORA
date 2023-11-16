const dotenv = require("dotenv");

dotenv.config();

const config = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  hash: {
    salt: process.env.HASH_SALT,
  }
};

module.exports = config;

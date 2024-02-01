const dotenv = require("dotenv");

dotenv.config();

const config = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  hash: {
    salt: process.env.HASH_SALT,
  },
  email: {
    name: process.env.EMAIL_NAME,
    password: process.env.EMAIL_PASSWORD,
  },
};

module.exports = config;

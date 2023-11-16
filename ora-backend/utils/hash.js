const { createHmac } = require("node:crypto");

const config = require("../config");

const generateHash = (password) =>
  createHmac("sha256", password).update(config.hash.salt).digest("hex");

module.exports = {
  generateHash,
};

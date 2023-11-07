const { createHmac } = require("node:crypto");

const generateHash = (password) =>
  createHmac("sha256", password).update("ora-beauty.by").digest("hex");

module.exports = {
  generateHash,
};

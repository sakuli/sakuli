const base = require("./jest.config.base");

module.exports = {
  ...base,
  projects: ["<rootDir>/packages/*/jest.it.config.js"],
  coverageDirectory: "<rootDir>/coverage/it/",
};

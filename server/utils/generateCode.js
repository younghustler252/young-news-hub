const crypto = require('crypto');

const generateCode = () => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit code
};

module.exports = generateCode;

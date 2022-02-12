const twilio = require("twilio");
const { accountSid, authToken } = require("./constants").twilio;

module.exports = twilio(accountSid, authToken);

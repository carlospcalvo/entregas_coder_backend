const nodemailer = require("nodemailer");
const { mailing } = require("../config/constants");
const { host, port, auth } = mailing;

module.exports = nodemailer.createTransport({
	host,
	port,
	auth,
});

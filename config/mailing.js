const { adminEmail } = require("../config/constants");
const nodemailer = require("nodemailer");
module.exports = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: adminEmail,
		pass: "m2DSQrKdvuaAuFeuv8",
	},
});

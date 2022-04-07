require("dotenv").config({
	path: process.env.NODE_ENV !== "production" ? "./.env.local" : "./.env",
});

module.exports = {
	server: {
		port: process.env.PORT || 8080,
		mongo: process.env.MONGO_URL || "",
	},
	mailing: {
		host: process.env.SMTP_HOST || "",
		port: process.env.SMTP_PORT || "",
		auth: {
			user: process.env.SMTP_EMAIL || "",
			pass: process.env.SMTP_PASS || "",
		},
	},
	auth: {
		jwtSecret: process.env.JWT_SECRET || "",
		jwtDuration: process.env.JWT_EXPIRES_IN || 300,
	},
};

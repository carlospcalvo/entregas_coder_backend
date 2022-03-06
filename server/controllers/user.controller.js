const logger = require("../logger");
const passport = require("passport");
require("../auth/config");

module.exports = class UserController {
	constructor() {
		this.signupController = passport.authenticate("signup", {
			// successRedirect: "/login",
			failureRedirect: "/api/user/signup/failed",
			failureMessage: true,
		});

		this.loginController = passport.authenticate("login", {
			failureRedirect: "/api/user/login/failed",
			failureMessage: true,
			// successRedirect: "/",
		});
	}

	postRegisterController = (req, res) => {
		res.sendStatus(201);
	};

	postLoginController = (req, res) => {
		req.logIn(req.user, (err) => {
			if (err) logger.fatal(err);
			req.session.user = req.user.username;
			logger.info(`User '${req.user.username}' logueado`);
			res.redirect("/");
		});
	};

	logoutController = (req, res) => {
		req.session.destroy((err) => {
			if (err) logger.fatal(err);
			res.sendStatus(200);
		});
	};

	failedSignupController = (req, res) => {
		res.json({
			status: "error",
			message: req.session.messages[req.session.messages.length - 1],
		});
	};

	failedLoginController = (req, res) => {
		res.json({
			status: "error",
			message: req.session.messages[req.session.messages.length - 1],
		});
	};

	sessionController = (req, res) => {
		if (req.user) {
			res.status(200).json({ user: req.user.username });
		} else {
			res.status(204).json({ user: undefined });
		}
	};
};

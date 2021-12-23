const express = require("express");
const logger = require("tracer").colorConsole();
const router = express.Router();
const passport = require("passport");
require("../auth/config");

router.post(
	"/signup",
	passport.authenticate("signup", {
		successRedirect: "/login",
		failureRedirect: "/user/signup/failed",
		failureMessage: true,
	})
);

router.post(
	"/login",
	passport.authenticate("login", {
		failureRedirect: "/user/login/failed",
		failureMessage: true,
		successRedirect: "/",
	}),
	(req, res) => {
		req.logIn(req.user, (err) => {
			if (err) logger.fatal(err);
			req.session.user = req.user.username;
			logger.info(`User '${req.user.username}' logueado`);
			res.redirect("/");
		});
		/* 
		if (req.isAuthenticated()) {
			let user = req.user;
			logger.info(`User '${user.username}' logueado`);
		} */
	}
);

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) logger.fatal(err);
		res.sendStatus(200);
	});
});

router.get("/signup/failed", (req, res) => {
	res.json({
		status: "error",
		message: req.session.messages[req.session.messages.length - 1],
	});
});

router.get("/login/failed", (req, res) => {
	res.json({
		status: "error",
		message: req.session.messages[req.session.messages.length - 1],
	});
});

router.get("/session", (req, res) => {
	if (req.user) {
		res.status(200).json({ user: req.user.username });
	} else {
		res.status(204).json({ user: undefined });
	}
});

module.exports = router;

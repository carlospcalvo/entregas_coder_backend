const express = require("express");
const router = express.Router();
const {
	signupController,
	loginController,
	postLoginController,
	logoutController,
	failedSignupController,
	failedLoginController,
	sessionController,
} = require("../controllers/user.controller");

router.post("/signup", signupController);

router.post("/login", loginController, postLoginController);

router.get("/logout", logoutController);

router.get("/signup/failed", failedSignupController);

router.get("/login/failed", failedLoginController);

router.get("/session", sessionController);

module.exports = router;

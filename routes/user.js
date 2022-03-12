const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

module.exports = class UserRouter {
	constructor() {
		this.userController = new UserController();
	}

	start() {
		router.post(
			"/signup",
			this.userController.signupController,
			this.userController.postRegisterController
		);

		router.post(
			"/login",
			this.userController.loginController,
			this.userController.postLoginController
		);

		router.get("/logout", this.userController.logoutController);

		router.get(
			"/signup/failed",
			this.userController.failedSignupController
		);

		router.get("/login/failed", this.userController.failedLoginController);

		router.get("/session", this.userController.sessionController);

		return router;
	}
};

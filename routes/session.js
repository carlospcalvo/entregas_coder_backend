const express = require("express");
const logger = require("tracer").colorConsole();
const router = express.Router();

router.get("/", (req, res) => {
	if (req.session.name) {
		res.status(200).json({ status: "logged", name: req.session.name });
	} else {
		res.status(200).json({ status: "not logged" });
	}
});

router.post("/login", (req, res) => {
	try {
		req.session.name = req.body.name;
		logger.info(`User ${req.session.name} logged in`);
		res.status(200).json({ status: 200, name: req.session.name });
	} catch (error) {
		logger.error(error);
		res.status(500).json({ status: 500, message: error });
	}
});

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (!err) {
			logger.info("User logged out");
			res.status(200).json({ status: 200, message: "Logout exitoso" });
		} else {
			logger.error(err);
			res.status(500).json({ status: "logout ERROR", body: err });
		}
	});
});

module.exports = router;

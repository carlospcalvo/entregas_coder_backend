const express = require("express");
const router = express.Router();
const RandomController = require("../controllers/random.controller");

module.exports = class RandomRouter {
	constructor() {
		this.randomController = new RandomController();
	}

	start() {
		router.get("/", this.randomController.calculate);
		return router;
	}
};

// module.exports = router;

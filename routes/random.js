const express = require("express");
const { fork } = require("child_process");
const router = express.Router();

router.get("/", (req, res) => {
	const quantity = req.query.cant || 100_000_000;
	let result;

	const forked = fork("./randomCalc.js");

	forked.on("message", (message) => {
		if (message === "ready") {
			forked.send(quantity.toString());
		} else {
			result = { ...result, ...message };
		}
	});

	forked.on("exit", () => {
		res.json(result);
	});
});

module.exports = router;

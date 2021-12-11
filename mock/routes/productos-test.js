const express = require("express");
const {
	getMockedProducts,
} = require("../controllers/productos-test.controller");

const router = express.Router();

router.get("/", getMockedProducts);

module.exports = router;

const express = require("express");

const {
	getProducts,
	postProduct,
	updateProduct,
	deleteProduct,
	productNotFound,
} = require("../controllers/products.controller");

const router = express.Router();

router.get("/:id?", productNotFound, getProducts);

router.post("/", postProduct);

router.put("/:id", productNotFound, updateProduct);

router.delete("/:id", productNotFound, deleteProduct);

module.exports = router;

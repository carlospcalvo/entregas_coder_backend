const express = require("express");
const isAdmin = require("../controllers/auth/auth.controller");
const {
	getProducts,
	postProduct,
	updateProduct,
	deleteProduct,
	productNotFound,
} = require("../controllers/products.controller");

const router = express.Router();

router.get("/:id?", productNotFound, getProducts);

router.post("/", isAdmin, postProduct);

router.put("/:id", isAdmin, productNotFound, updateProduct);

router.delete("/:id", isAdmin, productNotFound, deleteProduct);

module.exports = router;

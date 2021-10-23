const express = require("express");
const {
	getAllProducts,
	getProductByID,
	postProduct,
	updateProduct,
	deleteProduct,
	productNotFound,
} = require("../controllers/products.controller");

const router = express.Router();

router.get("/", getAllProducts);

router.post("/", postProduct);

router.get("/:id", productNotFound, getProductByID);

router.put("/:id", productNotFound, updateProduct);

router.delete("/:id", productNotFound, deleteProduct);

module.exports = router;

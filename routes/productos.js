const express = require("express");
const { verifyToken, verifyPrivileges } = require("../auth/middleware");
const {
	getProducts,
	postProduct,
	updateProduct,
	deleteProduct,
	productNotFound,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/:id?", productNotFound, getProducts);

router.post("/", verifyToken, verifyPrivileges, postProduct);

router.put(
	"/:id",
	verifyToken,
	verifyPrivileges,
	productNotFound,
	updateProduct
);

router.delete(
	"/:id",
	verifyToken,
	verifyPrivileges,
	productNotFound,
	deleteProduct
);

module.exports = router;

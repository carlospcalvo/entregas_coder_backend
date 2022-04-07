const express = require("express");
const { productNotFound } = require("../controllers/product.controller");
const {
	emptyCart,
	getCartProducts,
	addProductsToCart,
	deleteProductFromCart,
	confirmCart,
} = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", getCartProducts);

router.post("/", addProductsToCart);

router.get("/confirmar", confirmCart);

router.delete("/", emptyCart);

router.delete("/:id", productNotFound, deleteProductFromCart);

module.exports = router;

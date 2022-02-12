const express = require("express");
const {
	createCart,
	deleteCart,
	getCartProducts,
	addProductToCart,
	deleteProductFromCart,
	confirmCart,
} = require("../controllers/cart.controller");
const { productNotFound } = require("../controllers/products.controller");

const router = express.Router();

router.post("/", createCart);

router.delete("/:id", deleteCart);

router.get("/confirmar", confirmCart);

router.get("/:id/productos", getCartProducts);

router.post("/:id/productos", /* productNotFound, */ addProductToCart);

router.delete(
	"/:id/productos/:id_prod",
	productNotFound,
	deleteProductFromCart
);

module.exports = router;

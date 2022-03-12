const express = require("express");
const ProductController = require("../controllers/products.controller");

const router = express.Router();

module.exports = class ProductRouter {
	constructor() {
		this.productController = new ProductController();
	}

	start() {
		router.get("/", this.productController.getAllProducts);

		router.post("/", this.productController.postProduct);

		router.get(
			"/:id",
			this.productController.productNotFound,
			this.productController.getProductByID
		);

		router.put(
			"/:id",
			this.productController.productNotFound,
			this.productController.updateProduct
		);

		router.delete(
			"/:id",
			this.productController.productNotFound,
			this.productController.deleteProduct
		);

		return router;
	}
};

// module.exports = router;

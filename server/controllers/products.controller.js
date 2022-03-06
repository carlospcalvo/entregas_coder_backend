const ProductService = require("../services/products.services");

module.exports = class ProductController {
	constructor() {
		this.productService = new ProductService();
	}

	getAllProducts = async (req, res) => {
		await this.productService.getAllProductsService(req, res);
	};

	postProduct = async (req, res) => {
		await this.productService.postProductService(req, res);
	};

	updateProduct = async (req, res) => {
		await this.productService.updateProductService(req, res);
	};

	deleteProduct = async (req, res) => {
		await this.productService.deleteProductService(req, res);
	};

	getProductByID = async (req, res) => {
		await this.productService.getProductByIDService(req, res);
	};

	productNotFound = async (req, res, next) => {
		await this.productService.productNotFoundService(req, res, next);
	};

	initializeProducts = async (PORT) => {
		await this.productService.initializeProductsService(PORT);
	};
};

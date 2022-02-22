const {
	getAllProductsService,
	postProductService,
	updateProductService,
	deleteProductService,
	getProductByIDService,
	productNotFoundService,
	initializeProductsService,
} = require("../services/products.services");

const getAllProducts = async (req, res) => {
	await getAllProductsService(req, res);
};

const postProduct = async (req, res) => {
	await postProductService(req, res);
};

const updateProduct = async (req, res) => {
	await updateProductService(req, res);
};

const deleteProduct = async (req, res) => {
	await deleteProductService(req, res);
};

const getProductByID = async (req, res) => {
	await getProductByIDService(req, res);
};

const productNotFound = async (req, res, next) => {
	await productNotFoundService(req, res, next);
};

const initializeProducts = async (PORT) => {
	await initializeProductsService(PORT);
};

module.exports = {
	initializeProducts,
	getProductByID,
	getAllProducts,
	postProduct,
	updateProduct,
	deleteProduct,
	productNotFound,
};

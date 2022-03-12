const ProductDAO = require("../../database/DAOs/product");
const productDAO = new ProductDAO();

// Read
const getProductResolver = async (parent, args) =>
	await productDAO.getById(args.id);
const getAllProductsResolver = async () => await productDAO.getAll();

// Write
const createProductResolver = async (parent, args) =>
	await productDAO.save(args.data);
const updateProductResolver = async (parent, args) => {
	const { data, id } = args;
	return await productDAO.modifyItem({ ...data, id });
};
const deleteProductResolver = async (parent, args) =>
	await productDAO.deleteById(args.id);

module.exports = {
	getProductResolver,
	getAllProductsResolver,
	createProductResolver,
	updateProductResolver,
	deleteProductResolver,
};

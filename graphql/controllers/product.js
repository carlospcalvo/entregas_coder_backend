const { GraphQLInt, GraphQLList } = require("graphql");
const { ProductType, ProductInputType } = require("../types/product");
const {
	getProductResolver,
	getAllProductsResolver,
	createProductResolver,
	updateProductResolver,
	deleteProductResolver,
} = require("../resolvers/product");

// Read
const productController = {
	type: ProductType,
	args: {
		id: { type: GraphQLInt },
	},
	resolve: getProductResolver,
};

const productsController = {
	type: GraphQLList(ProductType),
	resolve: getAllProductsResolver,
};

// Write
const createProductController = {
	type: ProductType,
	args: { data: { type: ProductInputType } },
	resolve: createProductResolver,
};

const updateProductController = {
	type: ProductType,
	args: {
		id: { type: GraphQLInt },
		data: { type: ProductInputType },
	},
	resolve: updateProductResolver,
};

const deleteProductController = {
	type: ProductType,
	args: {
		id: { type: GraphQLInt },
	},
	resolve: deleteProductResolver,
};

module.exports = {
	productController,
	productsController,
	createProductController,
	updateProductController,
	deleteProductController,
};

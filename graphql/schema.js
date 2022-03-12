const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const {
	productController,
	productsController,
	createProductController,
	updateProductController,
	deleteProductController,
} = require("./controllers/product");
const {
	getMessagesController,
	createMessageController,
} = require("./controllers/message");
const {
	currentUserController,
	createUserController,
	loginController,
} = require("./controllers/user");

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		product: productController,
		products: productsController,
		messages: getMessagesController,
		currentUser: currentUserController,
	},
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		createProduct: createProductController,
		updateProduct: updateProductController,
		deleteProduct: deleteProductController,
		createMessage: createMessageController,
		createUser: createUserController,
		login: loginController,
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});

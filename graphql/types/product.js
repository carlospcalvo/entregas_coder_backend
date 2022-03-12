const {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLFloat,
} = require("graphql");

const ProductType = new GraphQLObjectType({
	name: "Product",
	fields: () => ({
		id: { type: GraphQLInt },
		title: { type: GraphQLString },
		price: { type: GraphQLFloat },
		thumbnail: { type: GraphQLString },
	}),
});

const ProductInputType = new GraphQLInputObjectType({
	name: "ProductInput",
	fields: {
		title: { type: GraphQLString },
		price: { type: GraphQLFloat },
		thumbnail: { type: GraphQLString },
	},
});

module.exports = {
	ProductType,
	ProductInputType,
};

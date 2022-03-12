const {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLString,
} = require("graphql");

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		username: { type: GraphQLString },
		password: { type: GraphQLString },
	}),
});

const UserInputType = new GraphQLInputObjectType({
	name: "UserInput",
	fields: () => ({
		username: { type: GraphQLString },
		password: { type: GraphQLString },
	}),
});

module.exports = {
	UserType,
	UserInputType,
};

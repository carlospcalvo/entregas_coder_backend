const {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLInt,
	GraphQLString,
} = require("graphql");

const AuthorType = new GraphQLObjectType({
	name: "Author",
	fields: () => ({
		email: { type: GraphQLString },
		nombre: { type: GraphQLString },
		apellido: { type: GraphQLString },
		edad: { type: GraphQLInt },
		alias: { type: GraphQLString },
		avatar: { type: GraphQLString },
	}),
});

const AuthorInputType = new GraphQLInputObjectType({
	name: "AuthorInputType",
	fields: () => ({
		email: { type: GraphQLString },
		nombre: { type: GraphQLString },
		apellido: { type: GraphQLString },
		edad: { type: GraphQLInt },
		alias: { type: GraphQLString },
		avatar: { type: GraphQLString },
	}),
});

const MessageType = new GraphQLObjectType({
	name: "Message",
	fields: () => ({
		author: {
			type: AuthorType,
		},
		text: { type: GraphQLString },
		date: { type: GraphQLString },
		timestamp: { type: GraphQLInt },
	}),
});

const MessageInputType = new GraphQLInputObjectType({
	name: "MessageInput",
	fields: () => ({
		author: {
			type: AuthorInputType,
		},
		text: { type: GraphQLString },
		date: { type: GraphQLString },
		timestamp: { type: GraphQLInt },
	}),
});

module.exports = {
	AuthorType,
	AuthorInputType,
	MessageType,
	MessageInputType,
};

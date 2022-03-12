const { GraphQLList } = require("graphql");
const { MessageType, MessageInputType } = require("../types/message");
const {
	createMessageResolver,
	getMessagesResolver,
} = require("../resolvers/message");

const getMessagesController = {
	type: GraphQLList(MessageType),
	resolve: getMessagesResolver,
};

const createMessageController = {
	type: MessageType,
	args: { data: { type: MessageInputType } },
	resolve: createMessageResolver,
};

module.exports = {
	getMessagesController,
	createMessageController,
};

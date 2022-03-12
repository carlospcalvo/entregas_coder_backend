const MessageDAO = require("../../database/DAOs/message");
const messageDAO = new MessageDAO();

const getMessagesResolver = async () => await messageDAO.getAll();

const createMessageResolver = async (parent, args) =>
	await messageDAO.save(args.data);

module.exports = {
	getMessagesResolver,
	createMessageResolver,
};

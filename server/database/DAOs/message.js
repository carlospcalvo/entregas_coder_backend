const DAO = require("./DAO");
const Message = require("../models/message");
let messageDAOInstance = null;

class MessageDAO extends DAO {
	constructor() {
		super(Message);
	}

	static getInstance() {
		if (!messageDAOInstance) {
			messageDAOInstance = new MessageDAO();
		}
		return messageDAOInstance;
	}
}

module.exports = MessageDAO;

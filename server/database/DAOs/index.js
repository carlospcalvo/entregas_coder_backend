const MessageDAO = require("./message");
const ProductDAO = require("./product");
const UserDAO = require("./user");

class DAOFactory {
	constructor() {}
	/**
	 * Creates a DAO
	 * @param {String} model "Messages" | "Products" | "Users"
	 */
	createDAO(model) {
		switch (model) {
			case "Messages":
				return MessageDAO.getInstance();
			case "Products":
				return ProductDAO.getInstance();
			case "Users":
				return UserDAO.getInstance();
			default:
				throw new Error(
					`Error instantiating DAO: model ${model} doesn't exist`
				);
		}
	}
}

module.exports = DAOFactory;

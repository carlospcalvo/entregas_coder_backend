const DAO = require("./DAO");
const User = require("../models/user");
let UserDAOInstance = null;

class UserDAO extends DAO {
	constructor() {
		super(User);
	}

	static getInstance() {
		if (!UserDAOInstance) {
			UserDAOInstance = new UserDAO();
		}
		return UserDAOInstance;
	}
}

module.exports = UserDAO;

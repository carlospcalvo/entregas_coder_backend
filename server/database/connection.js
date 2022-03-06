const mongoose = require("mongoose");
const logger = require("../logger");
require("dotenv").config();

let instance = null;

class MongoConnection {
	constructor() {
		mongoose
			.connect(process.env.MONGO_URL, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(() => logger.info("Connected to MongoDB!"))
			.catch((err) =>
				logger.error("Error connecting to MongoDB: ", err.stack)
			);
	}

	static getInstance() {
		if (!instance) {
			instance = new MongoConnection();
		}
		return instance;
	}
}

module.exports = MongoConnection;

const logger = require("tracer").colorConsole();
const DAOs = require("./daos");
const args = process.argv.slice(2)[0];

const database = {
	mongo: {
		url: "mongodb://localhost:27017/ecommerce",
	},
};

const initialize = () => {
	switch (args) {
		case "mongo":
			logger.log("MongoDB 🍃 selected");
			const mongoose = require("mongoose");
			mongoose
				.connect(database.mongo.url, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				})
				.then(() => logger.trace("Connected to MongoDB!"))
				.catch((err) =>
					logger.error("Error connecting to MongoDB: ", err.stack)
				);
			break;
		case "archivo":
			logger.log("File System 📂 selected");
			break;
		case "firebase":
			logger.log("Firebase 🔥 selected");
			break;
		default:
			break;
	}
};

module.exports = {
	initialize,
	DAO: DAOs[`${args}`],
};

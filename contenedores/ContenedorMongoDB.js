const mongoose = require("mongoose");
const logger = require("tracer").colorConsole();
const Producto = require("../models/product");
const Carrito = require("../models/cart");

module.exports = class MongoDataHandler {
	/**
	 * Initialize new instance
	 * @param {String} schemaName
	 * @param {mongoose.Schema} schema
	 */
	constructor(schemaName) {
		if (schemaName === "Producto") {
			this.model = Producto;
		} else if (schemaName === "Carrito") {
			this.model = Carrito;
		} else {
			throw new Error(
				`Error connecting to mongo: Schema ${schemaName} not found.`
			);
		}
	}
	/**
	 * Saves an object in database.
	 * @param {Object} newData Object to be saved.
	 * @returns {Number} New object id
	 */
	async save(newData = {}) {
		try {
			let lastId = await this.model
				.find({})
				.select({ id: 1 })
				.sort({ id: "desc" })
				.limit(1);
			let id = lastId.length > 0 ? parseInt(lastId[0].id) + 1 : 1;

			let result = await this.model({ ...newData, id }).save();
			logger.info(
				`${this.model.modelName} created: ${JSON.stringify(
					result,
					null,
					4
				)}`
			);
			return result.id;
		} catch (error) {
			logger.error(error.message);
			throw new Error(error.message);
		}
	}

	/**
	 * Get an element from database by its id
	 * @param {Number} queryId Element's id
	 * @returns {Object} Element
	 */
	async getById(queryId) {
		try {
			const item = await this.model.find({ id: queryId });
			return item[0];
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Get all elements from database
	 * @returns {Array} Array of elements
	 */
	async getAll() {
		try {
			return await this.model.find({});
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Deletes an element from the database by id
	 * @param {Number} queryId Id of the element to be deleted
	 */
	async deleteById(queryId) {
		try {
			await this.model.deleteOne({ id: queryId });
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Modifies an item by replacing it (PUT)
	 * @param {Object} item Item to be modified
	 */
	async modifyItem(item) {
		try {
			await this.model.findOneAndReplace({ id: item.id }, item);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Deletes all elements in the file
	 */
	async deleteAll() {
		try {
			await this.model.deleteMany({});
		} catch (error) {
			throw new Error(error.message);
		}
	}
};

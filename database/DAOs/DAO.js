const mongoose = require("mongoose");
const MessageDTO = require("../DTOs/message");
const logger = require("tracer").colorConsole();

module.exports = class DAO {
	/**
	 * Initialize new instance
	 * @param {mongoose.Model} model
	 */
	constructor(model) {
		this.model = model;
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

			if (this.model.modelName === "Message") {
				return new MessageDTO(result);
			}

			return result;
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
			const item = await this.model
				.find({ id: queryId })
				.select({ __v: 0, _id: 0 })
				.lean();
			if (this.model.modelName === "Message") {
				return new MessageDTO(item[0]);
			}
			return item[0];
		} catch (error) {
			logger.error(error);
			throw new Error(error.message);
		}
	}

	/**
	 * Get all elements from database
	 * @returns {Array} Array of elements
	 */
	async getAll() {
		try {
			const data = await this.model
				.find({})
				.select({ __v: 0, _id: 0 })
				.lean();

			if (this.model.modelName === "Message") {
				return data.map((msg) => new MessageDTO(msg));
			}
			return data;
		} catch (error) {
			logger.error(error);
			throw new Error(error.message);
		}
	}

	/**
	 * Deletes an element from the database by id
	 * @param {Number} queryId Id of the element to be deleted
	 */
	async deleteById(queryId) {
		try {
			const deleted = await this.getById(queryId);
			await this.model.deleteOne({ id: queryId });
			return deleted;
		} catch (error) {
			logger.error(error);
			throw new Error(error.message);
		}
	}

	/**
	 * Modifies an item by replacing it (PUT)
	 * @param {Object} item Item to be modified
	 * @return {Object} New item data
	 */
	async modifyItem(item) {
		try {
			return await this.model.findOneAndReplace(
				{ id: parseInt(item.id) },
				item,
				{
					returnDocument: "after",
					projection: { _id: 0 },
					lean: true,
				}
			);
		} catch (error) {
			logger.error(error);
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
			logger.error(error);
			throw new Error(error.message);
		}
	}
};

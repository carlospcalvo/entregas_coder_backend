const datefns = require("date-fns");

module.exports = class DatabaseHandler {
	/**
	 * Returns a DatabaseHandler instance
	 * @param {String} tableName Name of the table to be queried and/or created
	 * @param {Object} options Options to configure database
	 */
	constructor(tableName, options) {
		this.tableName = tableName.toLowerCase();
		this.knex = require("knex")(options);
	}

	/**
	 * Saves an object into the database.
	 * @param {Object} newData Data to be saved.
	 * @returns {Number} New object id
	 */
	async save(newData = {}) {
		try {
			return await this.knex(this.tableName).insert(newData);
		} catch (error) {
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
			return await this.knex
				.from(this.tableName)
				.select("*")
				.where("id", queryId);
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
			return await this.knex.from(this.tableName).select("*");
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Deletes an element in the database by id
	 * @param {Number} queryId Id of the element to be deleted
	 */
	async deleteById(queryId) {
		try {
			await this.knex(this.tableName).where({ id: queryId }).del();
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Modifies an item (PUT)
	 * @param {Object} data Data to be modified
	 */
	async modifyItem(data) {
		try {
			let id = parseInt(data.id);
			delete data.id;
			await this.knex(this.tableName).where("id", id).update(data);
			return await this.getById(id);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Initializes products
	 */
	async initialize() {
		this.knex.schema.hasTable(this.tableName).then((exists) => {
			//create table if it does not exist, initializes products
			if (!exists) {
				if (this.tableName === "productos") {
					try {
						this.knex.schema
							.createTable(this.tableName, (t) => {
								t.increments("id").unsigned().notNullable();
								t.string("title", 100).notNullable();
								t.string("thumbnail", 100).notNullable();
								t.decimal("price", 10, 2)
									.unsigned()
									.notNullable();
								t.unique(["id", "title"]);
							})
							.catch((err) =>
								console.log(
									`[db_handler] Error creating table ${this.tableName}:`,
									err
								)
							);
						let dummyData = [
							{
								title: "Macbook Air 2020 M1",
								price: 1000,
								thumbnail: "https://placekitten.com/40/40",
							},
							{
								title: "Macbook Pro 2020 M1",
								price: 1200,
								thumbnail: "https://placekitten.com/50/50",
							},
							{
								title: "Macbook Pro 2019 Intel",
								price: 1100,
								thumbnail: "https://placekitten.com/30/40",
							},
						];
						this.knex
							.insert(dummyData)
							.into(this.tableName)
							.then(() => console.log("Database initialized"));
					} catch (error) {
						throw new Error(error.message);
					}
				} else {
					this.knex.schema
						.createTable(this.tableName, (t) => {
							t.increments("id").unsigned().notNullable();
							t.string("email", 100).notNullable();
							t.text("message").notNullable();
							t.string("date")
								.defaultTo(
									datefns.format(
										parseInt(Date.now()),
										"dd/MM/yyyy HH:mm:ss"
									)
								)
								.notNullable();
						})
						.catch((err) =>
							console.log(
								`[db_handler] Error creating table ${this.tableName}:`,
								err
							)
						);
				}
			}
		});
	}
};

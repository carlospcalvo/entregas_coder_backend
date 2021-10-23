const fs = require("fs/promises");
const path = require("path");

module.exports = class Contenedor {
	constructor(fileName) {
		this.fileName = path.resolve(fileName);
	}

	/**
	 * Saves an object into a file.
	 * @param {Object} newData Object to be saved.
	 * @returns {Number} New object id
	 */
	async save(newData = {}) {
		let id = 1;

		try {
			let fileData;
			const data = await fs.readFile(this.fileName, {
				encoding: "utf-8",
			});

			fileData = JSON.parse(data);
			fileData.forEach((element) => {
				if (element.id >= id) {
					id = element.id + 1;
				}
			});
			fileData.push({ id, ...newData });

			await fs.writeFile(
				this.fileName,
				JSON.stringify(fileData, null, 4)
			);
		} catch {
			if (newData) {
				await fs.writeFile(
					this.fileName,
					JSON.stringify([{ id, ...newData }], null, 4)
				);
			} else {
				throw new Error("No se puede agregar un objeto vacío");
			}
		}
		return id;
	}

	/**
	 * Get an element from file by its id
	 * @param {Number} queryId Element's id
	 * @returns {Object} Element
	 */
	async getById(queryId) {
		try {
			const data = await fs.readFile(this.fileName, {
				encoding: "utf-8",
			});
			let fileData = JSON.parse(data);
			let result = fileData.find((item) => item.id === parseInt(queryId));
			return result;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Get all elements from file
	 * @returns {Array} Array of elements
	 */
	async getAll() {
		try {
			const data = await fs.readFile(this.fileName, {
				encoding: "utf-8",
			});
			return JSON.parse(data);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Deletes an element in the file by id
	 * @param {Number} queryId Id of the element to be deleted
	 */
	async deleteById(queryId) {
		try {
			const data = await fs.readFile(this.fileName, {
				encoding: "utf-8",
			});
			let fileData = JSON.parse(data);
			let filteredData = fileData.filter(
				(item) => item.id !== parseInt(queryId)
			);
			await fs.writeFile(
				this.fileName,
				JSON.stringify(filteredData, null, 4)
			);
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
			const fileData = await fs.readFile(this.fileName, {
				encoding: "utf-8",
			});
			let data = JSON.parse(fileData);
			let filteredData = data.filter(
				(storedItem) => storedItem.id !== parseInt(item.id)
			);
			let newData = [...filteredData, item];
			await fs.writeFile(this.fileName, JSON.stringify(newData, null, 4));
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Deletes all elements in the file
	 */
	async deleteAll() {
		try {
			await fs.writeFile(this.fileName, JSON.stringify([], null, 4));
		} catch (error) {
			throw new Error(error.message);
		}
	}
};

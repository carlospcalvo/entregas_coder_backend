module.exports = class Contenedor {
	constructor() {
		this.data = [];
	}

	async save(newData = {}) {
		let id = 1;

		try {
			let currentData = this.data;
			currentData.forEach((element) => {
				if (element.id >= id) {
					id = element.id + 1;
				}
			});
			currentData.push({ id, ...newData });
			return id;
		} catch (error) {
			if (newData) {
				throw new Error(error.message);
			} else {
				throw new Error("No se puede agregar un objeto vacío");
			}
		}
	}

	async getById(queryId) {
		try {
			const currentData = this.data;
			let result = currentData.find(
				(item) => item.id === parseInt(queryId)
			);
			return result || null;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async getAll() {
		try {
			return this.data;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async modifyItem(item) {
		try {
			const currentData = this.data;

			let filteredData = currentData.filter(
				(storedItem) => storedItem.id !== parseInt(item.id)
			);
			this.data = [...filteredData, item];
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async deleteById(queryId) {
		try {
			const currentData = this.data;
			let filteredData = currentData.filter(
				(item) => item.id !== parseInt(queryId)
			);
			this.data = filteredData;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async deleteAll() {
		try {
			this.data = [];
		} catch (error) {
			throw new Error(error.message);
		}
	}
};

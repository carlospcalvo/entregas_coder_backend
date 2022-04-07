const Producto = require("../models/product");
const Carrito = require("../models/cart");
const Usuario = require("../models/user");
const Orden = require("../models/order");
const Mensaje = require("../models/message");
const { v4: uuidv4 } = require("uuid");

module.exports = class MongoDataHandler {
	constructor(schemaName) {
		switch (schemaName) {
			case "Producto":
				this.model = Producto;
				break;
			case "Carrito":
				this.model = Carrito;
				break;
			case "Usuario":
				this.model = Usuario;
				break;
			case "Orden":
				this.model = Orden;
				break;
			case "Mensaje":
				this.model = Mensaje;
				break;
			default:
				throw new Error(
					`Error connecting to mongo: Schema ${schemaName} not found.`
				);
		}
	}

	async save(newData = {}) {
		try {
			let id = uuidv4();
			let result = await this.model({ ...newData, id }).save();
			return result.id;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async getById(queryId) {
		try {
			const item = await this.model.find({ id: queryId });
			return item[0];
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async getAll() {
		try {
			return await this.model.find({});
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async deleteById(queryId) {
		try {
			await this.model.deleteOne({ id: queryId });
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async modifyItem(item) {
		try {
			await this.model.findOneAndReplace({ id: item.id }, item);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async deleteAll() {
		try {
			await this.model.deleteMany({});
		} catch (error) {
			throw new Error(error.message);
		}
	}
};

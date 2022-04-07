const ContenedorMongo = require("../contenedores/ContenedorMongoDB");

module.exports = class ProductosDaoMongo extends ContenedorMongo {
	constructor() {
		super("Usuario");
	}

	/**
	 * Devuelve un usuario en base al email
	 * @param {string} email Emal del usuario
	 * @returns Usuario
	 */
	async findByEmail(email) {
		try {
			return await this.model.findOne({ email });
		} catch (error) {
			throw new Error(error.message);
		}
	}
};

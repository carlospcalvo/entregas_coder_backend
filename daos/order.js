const ContenedorMongo = require("../contenedores/ContenedorMongoDB");

module.exports = class OrdenDaoMongo extends ContenedorMongo {
	constructor() {
		super("Orden");
	}

	async findOrderByOwner(owner_id) {
		try {
			return await this.model.find({ owner: owner_id }).lean();
		} catch (error) {
			throw new Error(error.message);
		}
	}
};

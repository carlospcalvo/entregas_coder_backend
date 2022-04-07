const ContenedorMongo = require("../contenedores/ContenedorMongoDB");

module.exports = class ProductosDaoMongo extends ContenedorMongo {
	constructor() {
		super("Mensaje");
	}
};

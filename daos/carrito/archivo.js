const ContenedorArchivo = require("../../contenedores/ContenedorArchivo");

module.exports = class CarritoDaoArchivo extends ContenedorArchivo {
	constructor() {
		super("db/carrito.json");
	}
};

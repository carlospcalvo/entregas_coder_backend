const ContenedorArchivo = require("../../contenedores/ContenedorArchivo");

module.exports = class ProductosDaoArchivo extends ContenedorArchivo {
	constructor() {
		super("db/productos.json");
	}
};

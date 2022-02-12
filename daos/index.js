const productDAO = require("./productos/index");
const cartDAO = require("./carrito/index");

module.exports = {
	productos: new productDAO(),
	carritos: new cartDAO(),
};

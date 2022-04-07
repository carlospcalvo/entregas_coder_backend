const productDAO = require("./product");
const cartDAO = require("./cart");
const orderDAO = require("./order");
const userDAO = require("./user");
const messageDAO = require("./message");

module.exports = {
	productos: new productDAO(),
	carritos: new cartDAO(),
	ordenes: new orderDAO(),
	usuarios: new userDAO(),
	mensajes: new messageDAO(),
};

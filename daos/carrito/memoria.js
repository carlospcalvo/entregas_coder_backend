const ContenedorMemoria = require("../../contenedores/ContenedorMemoria");

module.exports = class CarritosDaoMemoria extends ContenedorMemoria {
	constructor() {
		super();
	}

	/**
	 * Adds a product and quantity to cart
	 * @param {Carrito} cart
	 * @param {Producto} product
	 * @param {Number} quantity
	 */
	addProduct(cart, product, quantity) {
		cart.productos.push({ item: product, quantity });
	}

	/**
	 * Deletes a product from cart
	 * @param {Carrito} cart
	 * @param {Producto} product_id
	 */
	removeProduct(cart, product_id) {
		console.log(cart);
		cart.productos = cart.productos.filter(
			(order) => parseInt(order.item.id) !== parseInt(product_id)
		);
	}
};

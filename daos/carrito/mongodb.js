const ContenedorMongo = require("../../contenedores/ContenedorMongoDB");

module.exports = class CarritoDaoMongo extends ContenedorMongo {
	constructor() {
		super("Carrito");
	}

	/**
	 * Adds a product and quantity to cart
	 * @param {Carrito} cart
	 * @param {Producto} product
	 * @param {Number} quantity
	 */
	async addProduct(cart, product, quantity) {
		await this.model.updateOne(
			{ id: cart.id },
			{ $push: { productos: { item: product, quantity } } },
			{ upsert: true }
		);
	}

	/**
	 * Deletes a product from cart
	 * @param {Number} cart_id
	 * @param {Number} product_id
	 */
	async removeProduct(cart_id, product_id) {
		await this.model.findOneAndUpdate(
			{ id: cart_id },
			{
				$pull: { productos: { "item.id": product_id } },
			}
		);
	}
};

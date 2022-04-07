const ContenedorMongo = require("../contenedores/ContenedorMongoDB");

module.exports = class CarritoDaoMongo extends ContenedorMongo {
	constructor() {
		super("Carrito");
	}

	/**
	 * Agrega un producto al carrito
	 * @param {Carrito} cart
	 * @param {Producto} product_id
	 * @param {Number} quantity
	 */
	async addProduct(cart, product_id, quantity) {
		try {
			await this.model.updateOne(
				{ id: cart.id },
				{ $push: { productos: { item: product_id, quantity } } },
				{ upsert: true }
			);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Elimina un producto del carrito
	 * @param {Number} cart_id
	 * @param {Number} product_id
	 */
	async removeProduct(cart_id, product_id) {
		try {
			await this.model.findOneAndUpdate(
				{ id: cart_id },
				{
					$pull: { productos: { item: product_id } },
				}
			);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Devuelve el carrito correspondiente a un usuario
	 * @param {string} owner_id
	 * @returns {any} El carrito del usuario
	 */
	async findCartByOwner(owner_id) {
		try {
			return await this.model.findOne({ owner: owner_id }).lean();
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async emptyCart(cart_id) {
		try {
			await this.model.updateOne(
				{ id: cart_id },
				{ $set: { productos: [] } }
			);
		} catch (error) {
			throw new Error(error.message);
		}
	}
};

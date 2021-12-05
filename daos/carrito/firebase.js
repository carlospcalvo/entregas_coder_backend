const ContenedorFirebase = require("../../contenedores/ContenedorFirebase");
const { getDocs, updateDoc, query, where } = require("firebase/firestore/lite");
const logger = require("tracer").colorConsole();

module.exports = class CarritosDaoFirebase extends ContenedorFirebase {
	constructor(firebaseCollection) {
		super(firebaseCollection);
	}
	/**
	 * Adds a product and quantity to cart
	 * @param {Carrito} cart
	 * @param {Producto} product
	 * @param {Number} quantity
	 */
	async addProduct(cart, product, quantity) {
		let querySnapshot = await getDocs(
			query(this.collection, where("id", "==", parseInt(cart.id)))
		);
		let cartRef;
		querySnapshot.forEach(async (doc) => (cartRef = doc.ref));
		cart.productos.push({ item: product, quantity });

		await updateDoc(cartRef, cart);
	}

	/**
	 * Deletes a product from cart
	 * @param {Carrito} cart
	 * @param {Producto} product_id
	 */
	async removeProduct(cart, product_id) {
		let querySnapshot = await getDocs(
			query(this.collection, where("id", "==", parseInt(cart.id)))
		);
		let cartRef;
		querySnapshot.forEach(async (doc) => (cartRef = doc.ref));

		let newCart = {
			...cart,
			productos: cart.productos.filter(
				(order) => parseInt(order.item.id) !== parseInt(product_id)
			),
		};

		await updateDoc(cartRef, newCart);
	}
};

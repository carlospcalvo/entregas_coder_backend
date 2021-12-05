const logger = require("tracer").colorConsole();
const { DAO } = require("../config");
const CartDataHandler = DAO.carritos;
const ProductDataHandler = DAO.productos;

const createCart = async (req, res) => {
	try {
		let new_cart_id = await CartDataHandler.save({
			timestamp: Date.now(),
			productos: [],
		});
		res.status(200).json({
			new_cart_id,
			...req.body,
		});
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const deleteCart = async (req, res) => {
	try {
		await CartDataHandler.deleteById(req.params.id);
		res.status(200).json({
			status: 200,
			message: `Cart with id ${req.params.id} deleted succesfully`,
		});
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const getCartProducts = async (req, res) => {
	try {
		let { productos } = await CartDataHandler.getById(req.params.id);
		res.status(200).json(productos);
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const addProductToCart = async (req, res) => {
	try {
		let { productos } = req.body;
		let cart = await CartDataHandler.getById(req.params.id);

		for (const item of productos) {
			let product = await ProductDataHandler.getById(item.id);

			switch (process.argv[2]) {
				case "mongo":
					await CartDataHandler.addProduct(
						cart,
						product,
						item.quantity
					);
					break;

				case "archivo":
					cart.productos.push({
						item: product,
						quantity: item.quantity,
					});
				case "firebase":
					await CartDataHandler.addProduct(
						cart,
						product,
						item.quantity
					);
					break;
				case "memoria":
					CartDataHandler.addProduct(cart, product, item.quantity);
					break;
				default:
					break;
			}
		}

		if (process.argv[2] === "archivo") {
			await CartDataHandler.modifyItem(cart);
		} else {
			cart = await CartDataHandler.getById(req.params.id);
		}

		res.status(200).json(cart);
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const deleteProductFromCart = async (req, res) => {
	try {
		let product_id = parseInt(req.params.id_prod);
		let cart = await CartDataHandler.getById(req.params.id);
		let newData;
		switch (process.argv[2]) {
			case "mongo":
				await CartDataHandler.removeProduct(req.params.id, product_id);
				break;
			case "archivo":
				let filteredData = cart.productos.filter(
					(order) => order.item.id !== product_id
				);
				newData = { ...cart, productos: filteredData };
				await CartDataHandler.modifyItem(newData);
			case "firebase":
				await CartDataHandler.removeProduct(cart, product_id);
				break;
			case "memoria":
				CartDataHandler.removeProduct(cart, product_id);
				break;
			default:
				break;
		}

		if (process.argv[2] !== "archivo") {
			newData = await CartDataHandler.getById(req.params.id);
		}
		res.status(200).json(newData);
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

module.exports = {
	createCart,
	deleteCart,
	getCartProducts,
	addProductToCart,
	deleteProductFromCart,
};

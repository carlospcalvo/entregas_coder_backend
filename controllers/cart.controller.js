const FileDataHandler = require("../FileDataHandler");
const fileHandler = new FileDataHandler("carrito.json");

const createCart = async (req, res) => {
	try {
		let new_cart_id = await fileHandler.save({
			timestamp: Date.now(),
			productos: [],
		});
		res.status(200).json({
			new_cart_id,
			...req.body,
		});
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const deleteCart = async (req, res) => {
	try {
		await fileHandler.deleteById(req.params.id);
		res.status(200).json({
			status: 200,
			message: `Cart with id ${req.params.id} deleted succesfully`,
		});
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const getCartProducts = async (req, res) => {
	try {
		let { productos } = await fileHandler.getById(req.params.id);
		res.status(200).json(productos);
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const addProductToCart = async (req, res) => {
	try {
		const productFileHandler = new FileDataHandler("productos.json");
		let { id } = req.body;
		let product = await productFileHandler.getById(id);
		let cart = await fileHandler.getById(req.params.id);
		cart.productos.push(product);
		await fileHandler.modifyItem(cart);
		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const deleteProductFromCart = async (req, res) => {
	try {
		let cart = await fileHandler.getById(req.params.id);
		let filteredData = cart.productos.filter(
			(item) => item.id !== parseInt(req.params.id_prod)
		);
		let newData = { ...cart, productos: filteredData };
		await fileHandler.modifyItem(newData);
		res.status(200).json(newData);
	} catch (error) {
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

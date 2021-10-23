const Contenedor = require("../Contenedor");
const fileHandler = new Contenedor("productos.txt");

/**
 * Returns all pproducts in database
 * @param {Request} req
 * @param {Response} res
 */
const getAllProducts = async (req, res) => {
	try {
		let products = await fileHandler.getAll();
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};
/**
 * Creates a product
 * @param {Request} req
 * @param {Response} res
 */
const postProduct = async (req, res) => {
	let error_status = 500;
	try {
		if (Object.keys(req.body).length > 0) {
			let new_item_id = await fileHandler.save(req.body);
			res.status(200).json({
				new_item_id,
				...req.body,
			});
		} else {
			error_status = 400;
			throw new Error("Empty body!");
		}
	} catch (error) {
		res.status(error_status).json({
			status: error_status,
			message: error.message,
		});
	}
};

/**
 * Updates one product based on id
 * @param {Request} req
 * @param {Response} res
 */
const updateProduct = async (req, res) => {
	try {
		let product = req.body;
		await fileHandler.modifyItem(product);
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

/**
 * Deletes one product based on id
 * @param {Request} req
 * @param {Response} res
 */
const deleteProduct = async (req, res) => {
	try {
		await fileHandler.deleteById(req.params.id);
		res.status(200).json({
			status: 200,
			message: `Product with id ${req.params.id} deleted succesfully`,
		});
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

/**
 * Returns a specific product based on id
 * @param {Resquest} req
 * @param {Response} res
 */
const getProductByID = async (req, res) => {
	try {
		let product = await fileHandler.getById(req.params.id);
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

/**
 * Checks if the specified id exists
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const productNotFound = async (req, res, next) => {
	try {
		let product = await fileHandler.getById(req.params.id);

		product
			? next()
			: res.status(404).json({ error: "Producto no encontrado" });
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const initializeProducts = async (PORT) => {
	let dummyData = [
		{
			id: 1,
			title: "Macbook Air 2020 M1",
			price: "1000",
			thumbnail: "https://placekitten.com/200/400",
		},
		{
			id: 2,
			title: "Macbook Pro 2020 M1",
			price: "1200",
			thumbnail: "https://placekitten.com/200/300",
		},
		{
			id: 3,
			title: "Macbook Pro 2019 Intel",
			price: "1100",
			thumbnail: "https://placekitten.com/300/400",
		},
	];

	try {
		await fileHandler.getAll();
		console.log("[products controller] Data loaded from file.");
	} catch (error) {
		await fileHandler.save(dummyData[0]);
		await fileHandler.save(dummyData[1]);
		await fileHandler.save(dummyData[2]);
		console.log("[products controller] Data initialized.");
	} finally {
		console.log(`Server running on port ${PORT}`);
	}
};

module.exports = {
	initializeProducts,
	getProductByID,
	getAllProducts,
	postProduct,
	updateProduct,
	deleteProduct,
	productNotFound,
};

const FileDataHandler = require("../FileDataHandler");
const fileHandler = new FileDataHandler("productos.json");

/**
 * Returns a product if id is specified, else all products
 * @param {Request} req
 * @param {Response} res
 */
const getProducts = async (req, res) => {
	try {
		let products = req.params.id
			? await fileHandler.getById(req.params.id)
			: await fileHandler.getAll();
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
 * Checks if the specified id exists
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const productNotFound = async (req, res, next) => {
	try {
		let product = await fileHandler.getById(req.params.id);

		product || req.params.id === undefined
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
			timestamp: Date.now(),
			codigo: "MBA20_M1_8_256",
			nombre: "Macbook Air 2020 M1",
			descripcion: "Macbook Air 2020 M1 8GB RAM 256GB SSD",
			precio: "1000",
			foto: "https://http2.mlstatic.com/D_NQ_NP_2X_801112-MLA46516512347_062021-F.webp",
			stock: 100,
		},
		{
			id: 2,
			timestamp: Date.now(),
			codigo: "MBP20_M1_8_512",
			nombre: "Macbook Pro 2020 M1",
			descripcion: "Macbook Pro 2020 M1 8GB RAM 512GB SSD",
			precio: "1200",
			foto: "https://http2.mlstatic.com/D_NQ_NP_2X_907433-MLA45795227804_052021-F.webp",
			stock: 50,
		},
		{
			id: 3,
			timestamp: Date.now(),
			codigo: "MBP19_i7_8_256",
			nombre: "Macbook Pro 2019 Intel",
			descripcion: "Macbook Air 2019 Intel i7 8GB RAM 256GB SSD",
			precio: "1100",
			foto: "https://http2.mlstatic.com/D_NQ_NP_864399-MLA31654788775_082019-O.jpg",
			stock: 34,
		},
	];

	try {
		await fileHandler.getAll();
		console.log("Loading products...");
	} catch (error) {
		await fileHandler.save(dummyData[0]);
		await fileHandler.save(dummyData[1]);
		await fileHandler.save(dummyData[2]);
		console.log("Initializing products...");
	} finally {
		console.log(`Server running on port ${PORT}`);
	}
};

module.exports = {
	initializeProducts,
	getProducts,
	postProduct,
	updateProduct,
	deleteProduct,
	productNotFound,
};

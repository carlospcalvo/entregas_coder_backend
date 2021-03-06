const logger = require("../config/logger");
const { productos: DataHandler } = require("../daos/index");
const { v4: uuidv4 } = require("uuid");

/**
 * Returns a product if id is specified, else all products
 * @param {Request} req
 * @param {Response} res
 */
const getProducts = async (req, res) => {
	try {
		let products = req.params.id
			? await DataHandler.getById(req.params.id)
			: await DataHandler.getAll();
		res.status(200).json(products);
	} catch (error) {
		logger.error(error.message);
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
			let new_item_id = await DataHandler.save(req.body);
			res.status(200).json({
				...req.body,
				id: new_item_id,
			});
		} else {
			error_status = 400;
			throw new Error("Empty body!");
		}
	} catch (error) {
		logger.error(error.message);
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
		await DataHandler.modifyItem(product);
		res.status(200).json(product);
	} catch (error) {
		logger.error(error.message);
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
		await DataHandler.deleteById(req.params.id);
		res.status(200).json({
			status: 200,
			message: `Product with id ${req.params.id} deleted succesfully`,
		});
	} catch (error) {
		logger.error(error.message);
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
		let product = await DataHandler.getById(req.params.id);
		product || req.params.id === undefined
			? next()
			: res.status(404).json({ error: "Producto no encontrado" });
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const initializeProducts = async (PORT) => {
	const dummyData = [
		{
			id: uuidv4(),
			timestamp: Date.now(),
			codigo: "MBA20_M1_8_256",
			nombre: "Macbook Air 2020 M1",
			descripcion: "Macbook Air 2020 M1 8GB RAM 256GB SSD",
			precio: 1000,
			foto: "https://http2.mlstatic.com/D_NQ_NP_2X_801112-MLA46516512347_062021-F.webp",
			stock: 100,
		},
		{
			id: uuidv4(),
			timestamp: Date.now(),
			codigo: "MBP20_M1_8_512",
			nombre: "Macbook Pro 2020 M1",
			descripcion: "Macbook Pro 2020 M1 8GB RAM 512GB SSD",
			precio: 1200,
			foto: "https://http2.mlstatic.com/D_NQ_NP_2X_907433-MLA45795227804_052021-F.webp",
			stock: 50,
		},
		{
			id: uuidv4(),
			timestamp: Date.now(),
			codigo: "MBP19_i7_8_256",
			nombre: "Macbook Pro 2019 Intel",
			descripcion: "Macbook Air 2019 Intel i7 8GB RAM 256GB SSD",
			precio: 1100,
			foto: "https://http2.mlstatic.com/D_NQ_NP_864399-MLA31654788775_082019-O.jpg",
			stock: 34,
		},
		{
			id: uuidv4(),
			timestamp: Date.now(),
			codigo: "HP_14_dq2024la",
			nombre: "Notebook Hp 14-dq2024la Core I3 1115g4 8gb 256gb M2 Ssd W10",
			precio: 4100,
			descripcion:
				"enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem",
			foto: "https://placekitten.com/745/730",
			stock: 0,
		},
		{
			id: uuidv4(),
			timestamp: Date.now(),
			codigo: "DELL_latitude_3410",
			nombre: "Notebook Dell Latitude 3410 Core I5 8gb 1tb W10 Pro",
			precio: 2734,
			descripcion:
				"enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem",
			foto: "https://placekitten.com/502/689",
			stock: 100,
		},
		{
			id: uuidv4(),
			timestamp: Date.now(),
			codigo: "HP_240_g7",
			nombre: "Notebook Hp 240 G7 Intel N4020 8gb Hdd 1tb Led 14 Win10 Ctas",
			precio: 1203,
			descripcion:
				"enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem",
			foto: "https://placekitten.com/494/058",
			stock: 100,
		},
		{
			id: uuidv4(),
			timestamp: Date.now(),
			codigo: "HP_250_g7",
			nombre: "Notebook Hp 250 G7 I3 7020u 8gb Ssd 240gb 15.6 Win10 Home",
			precio: 1275,
			descripcion:
				"enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem",
			foto: "https://placekitten.com/862/870",
			stock: 100,
		},
		{
			id: uuidv4(),
			timestamp: Date.now(),
			codigo: "LENOVO_ip_S340_15api",
			nombre: "Notebook Lenovo Ip S340-15api Ryzen 3 3200u 4gb 256ssd D2",
			precio: 2806,
			descripcion:
				"enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem",
			foto: "https://placekitten.com/456/110",
			stock: 100,
		},
		{
			id: uuidv4(),
			timestamp: Date.now(),
			codigo: "DELL_latitude_5420",
			nombre: "Notebook Dell Latitude 5420 I5-1135g7 16gb 256 Ssd Win10p",
			precio: 4800,
			descripcion:
				"enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem",
			foto: "https://placekitten.com/817/907",
			stock: 0,
		},
		{
			id: uuidv4(),
			timestamp: Date.now(),
			codigo: "LENOVO_ip_Flex_15IWL",
			nombre: 'Notebook Lenovo IdeaPad Flex-15IWL onyx black t??ctil 15.6", Intel Core i7 8565U 8GB de RAM 512GB SSD, NVIDIA GeForce MX230 60 Hz 1920x1080px Windows 10 Home',
			precio: 3400,
			descripcion:
				"enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem",
			foto: "https://placekitten.com/250/150",
			stock: 100,
		},
	];

	try {
		logger.info("Loading products...");
		const data = await DataHandler.getAll();
		if (data.length === 0) {
			logger.info("Product collection empty, initializing products...");
			for (const item of dummyData) {
				await DataHandler.save(item);
			}
		}
	} catch (error) {
		logger.error(error);
	} finally {
		logger.info(`Server running on port ${PORT}`);
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

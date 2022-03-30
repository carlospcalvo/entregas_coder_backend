// const logger = require("tracer").colorConsole();
const logger = require("../config/logger");
const DAO = require("../daos/index");
const CartDataHandler = DAO.carritos;
const ProductDataHandler = DAO.productos;
const transporter = require("../config/mailing");
const { adminEmail } = require("../config/constants");
const twilio = require("../config/twilio");

const createCart = async (req, res) => {
	try {
		if (!req.session?.passport?.user) {
			res.sendStatus(401);
			return;
		}

		let new_cart_id = await CartDataHandler.save({
			owner: req.session.passport.user,
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
			await CartDataHandler.addProduct(cart, product, item.quantity);
		}

		cart = await CartDataHandler.getById(req.params.id);

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
		let newData;
		await CartDataHandler.removeProduct(req.params.id, product_id);

		newData = await CartDataHandler.getById(req.params.id);
		res.status(200).json(newData);
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const confirmCart = async (req, res) => {
	try {
		const Usuario = require("../models/user");
		if (!req.session?.passport?.user) {
			res.sendStatus(401);
			return;
		}
		const { email, nombre, telefono } = await Usuario.findById(
			req.session.passport.user
		).lean();
		const cart = await CartDataHandler.findCartByOwner(
			req.session.passport.user
		);
		let html = `<h1>Datos del pedido</h1>`;

		cart.productos.forEach((producto, i) => {
			html += `
				<h3>${producto.item.nombre}</h3>
				<ul>
					<li>Código: ${producto.item.codigo}</li>
					<li>Descripción: ${producto.item.descripcion}</li>
					<li>Cantidad: ${producto.quantity}</li>
					<li>Precio: ${producto.item.precio}</li>
					<li>Stock: ${producto.item.stock}</li>
				</ul>
			`;
		});

		const mailOptions = {
			from: "CoderServer",
			to: adminEmail,
			subject: `Nuevo pedido de ${nombre} (${email})`,
			html,
		};

		await transporter.sendMail(mailOptions);

		/* await twilio.messages.create({
			body: `Nuevo pedido de ${nombre} (${email})`,
			from: "whatsapp:+14155238886",
			to: `whatsapp:${telefono}`,
		});

		await twilio.messages.create({
			body: "Su pedido ha sido recibido y está siendo procesado.",
			from: "+1 845 552 2356",
			to: `whatsapp:${telefono}`,
		}); */
		await CartDataHandler.deleteById(cart.id);

		res.status(200).json({
			status: 200,
			message: "Pedido confirmado con éxito",
		});
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
	confirmCart,
};

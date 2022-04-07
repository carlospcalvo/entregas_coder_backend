const logger = require("../config/logger");
const transporter = require("../config/mailing");
const { mailing } = require("../config/constants");
const DAO = require("../daos/index");
const {
	carritos: CartDataHandler,
	ordenes: OrderDataHandler,
	usuarios: UserDataHandler,
	productos: ProductDataHandler,
} = DAO;

const getCartProducts = async (req, res) => {
	try {
		const cart = await CartDataHandler.findCartByOwner(req.user._id);
		console.log(cart);
		if (req.user._id === cart.owner.toString()) {
			res.status(200).json(cart.productos);
		} else {
			res.status(403).json({
				message: `Usuario no autorizado a consultar carritos ajenos`,
			});
		}
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const addProductsToCart = async (req, res) => {
	try {
		const { productos } = req.body;

		const productList = await ProductDataHandler.getAll();
		const existingProducts = productList.map((product) => product.id);
		const productsExist = productos.every((item) =>
			existingProducts.includes(item.id)
		);

		if (!productsExist) {
			return res.status(404).json({
				message: `Uno de los productos no existe.`,
			});
		}

		let cart = await CartDataHandler.findCartByOwner(req.user._id);

		for (const item of productos) {
			await CartDataHandler.addProduct(cart, item.id, item.quantity);
		}

		cart = await CartDataHandler.findCartByOwner(req.user._id);

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
		const product_id = req.params.id;
		const cart = await CartDataHandler.findCartByOwner(req.user._id);

		await CartDataHandler.removeProduct(cart.id, product_id);

		const newData = await CartDataHandler.getById(cart.id);

		res.status(200).json(newData);
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

const emptyCart = async (req, res) => {
	try {
		const cart = await CartDataHandler.findCartByOwner(req.user._id);

		await CartDataHandler.emptyCart(cart.id);
		res.status(200).json({
			status: 200,
			message: `Carrito con id ${cart.id} vaciado con éxito.`,
		});
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
		const { email, nombre } = await UserDataHandler.findByEmail(
			req.user.email
		);
		const cart = await CartDataHandler.findCartByOwner(req.user._id);

		if (!cart.productos) {
			return res
				.status(400)
				.json({ message: `No es posible confirmar un carrito vacío` });
		}

		let html = `<h1>Datos del pedido</h1>`;

		cart.productos.forEach(async ({ item, quantity }) => {
			const { nombre, codigo, precio, descripcion, stock } =
				await ProductDataHandler.getById(item);
			html += `
				<h3>${nombre}</h3>
				<ul>
					<li>Código: ${codigo}</li>
					<li>Descripción: ${descripcion}</li>
					<li>Cantidad: ${quantity}</li>
					<li>Precio: ${precio}</li>
					<li>Stock: ${stock}</li>
				</ul>
			`;
		});

		const adminMailOptions = {
			from: {
				name: "CoderServer",
				address: mailing.auth.user,
			},
			to: mailing.auth.user,
			subject: `Nuevo pedido de ${nombre} (${email})`,
			html,
		};

		const clientMailOptions = {
			...adminMailOptions,
			to: email,
			subject: `Detalle de su pedido`,
		};

		await Promise.all([
			transporter.sendMail(adminMailOptions),
			transporter.sendMail(clientMailOptions),
		]);

		await OrderDataHandler.save(cart);
		await CartDataHandler.emptyCart(cart.id);

		res.status(200).json({
			status: 200,
			message: "Pedido confirmado con éxito",
		});
	} catch (error) {
		logger.error("Error confirmando pedido: ", error.message);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

module.exports = {
	emptyCart,
	getCartProducts,
	addProductsToCart,
	deleteProductFromCart,
	confirmCart,
};

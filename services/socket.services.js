const datefns = require("date-fns");
const logger = require("../logger");
const DAOFactory = require("../database/DAOs");
const MessageRepo = require("../database/Repositories/message");
const factory = new DAOFactory();
const messageHandler = factory.createDAO("Messages");
const productHandler = new MessageRepo();
const { normalizeMessages } = require("../controllers/messages.controller");

const initializeSocket = async (socket, messages, products) => {
	messages = await messageHandler.getAll();
	products = await productHandler.getAll();
	socket.emit("messages", normalizeMessages(messages));
	socket.emit("products", products);
};

const messageService = async (socket, data, messages) => {
	logger.info("WebSocket - New Message");
	const message = {
		author: {
			email: data.email,
			nombre: data.nombre,
			apellido: data.apellido,
			edad: data.edad,
			alias: data.alias,
			avatar: data.avatar,
		},
		text: data.message,
		date: datefns.format(parseInt(data.timestamp), "dd/MM/yyyy HH:mm:ss"),
		timestamp: data.timestamp,
	};
	messages.push(message);
	const normalizedMessages = normalizeMessages(messages);
	socket.emit("messages", normalizedMessages);
	await messageHandler.save(message);
};

const productService = (socket, data, products) => {
	logger.info("WebSocket - New Product");
	let id = 1;
	products.forEach((item) => {
		if (item.id > id) {
			id = item.id;
		}
	});
	products.push({ id: id + 1, ...data });
	socket.emit("products", products);
	productHandler.save(data);
};

module.exports = { initializeSocket, messageService, productService };

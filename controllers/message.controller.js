const datefns = require("date-fns");
const logger = require("../config/logger");
const messageHandler = require("../daos/index").mensajes;

const initializeSocket = async (socket) => {
	const messages = await messageHandler.getAll();
	socket.emit("messages", messages);
};

const storeMessage = async (socket, data) => {
	logger.info("WebSocket - New Message");
	const message = {
		email: data.email,
		text: data.message,
		date: datefns.format(parseInt(data.timestamp), "dd/MM/yyyy HH:mm:ss"),
		timestamp: data.timestamp,
	};
	await messageHandler.save(message);
	const messages = await messageHandler.getAll();
	socket.emit("messages", messages);
};

const socketController = async (socket) => {
	await initializeSocket(socket);
	socket.on("message", async (data) => await storeMessage(socket, data));
};

module.exports = {
	socketController,
};

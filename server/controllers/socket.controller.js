const {
	messageService,
	productService,
	initializeSocket,
} = require("../services/socket.services");

// Initial config
let messages = [];
let products = [];

const socketController = async (socket) => {
	await initializeSocket(socket, messages, products);
	socket.on("new-product", (data) => productService(socket, data, products));
	socket.on(
		"message",
		async (data) => await messageService(socket, data, messages)
	);
};

module.exports = {
	socketController,
};

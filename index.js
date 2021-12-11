const express = require("express");
const mongoose = require("mongoose");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const PORT = 8080;
const logger = require("tracer").colorConsole();
const faker = require("faker/locale/es_MX");
const mockRouter = require("./mock/routes/productos-test");
const configEngine = require("./engine.config");
const DatabaseHandler = require("./database/DatabaseHandler");
const datefns = require("date-fns");
const config = require("./database/config");
const {
	normalizeMessages,
	denormalizeMessages,
} = require("./controllers/messages.controller");

// Initial config
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

mongoose
	.connect(config.mongo.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => logger.trace("Connected to MongoDB!"))
	.catch((err) => logger.error("Error connecting to MongoDB: ", err.stack));

let messages = [];

const messageHandler = new DatabaseHandler("Messages");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
//app.use("/api/productos", router);
app.use("/api/productos-test", mockRouter);

app.get("/", async (req, res) => {
	res.render("index");
});

httpServer
	.listen(PORT, async () => {
		await configEngine(app);
		logger.trace(`Server running on port ${PORT}!`);
	})
	.on("error", (error) => logger.error("[ERROR]", error.message));

// Sockets

io.on("connection", async (socket) => {
	logger.log("Usuario conectado!");
	messages = await messageHandler.getAll();
	socket.emit("messages", normalizeMessages(messages));
	socket.on("message", async (data) => {
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
			date: datefns.format(
				parseInt(data.timestamp),
				"dd/MM/yyyy HH:mm:ss"
			),
			timestamp: data.timestamp,
		};
		messages.push(message);
		const normalizedMessages = normalizeMessages(messages);
		io.sockets.emit("messages", normalizedMessages);
		await messageHandler.save(message);
	});
});

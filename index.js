const express = require("express");
const mongoose = require("mongoose");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const PORT = 8080;
const logger = require("tracer").colorConsole();
const mockRouter = require("./mock/routes/productos-test");
const configEngine = require("./engine.config");
const DatabaseHandler = require("./database/DatabaseHandler");
const datefns = require("date-fns");
const config = require("./database/config");
const { normalizeMessages } = require("./controllers/messages.controller");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const sessionRouter = require("./routes/session");
require("dotenv").config();

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
app.use(cookieParser());
app.use(
	session({
		store: mongoStore.create({
			mongoUrl: process.env.MONGO_ATLAS_URL,
			mongoOptions: {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
		}),
		secret: "somesecret",
		resave: true,
		saveUninitialized: false,
		cookie: {
			maxAge: 600_000,
		},
	})
);

// Routes
//app.use("/api/productos", router);
app.use("/api/productos-test", mockRouter);

app.use("/session", sessionRouter);

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
		io.sockets.emit("messages", normalizeMessages(messages));
		await messageHandler.save(message);
	});
});

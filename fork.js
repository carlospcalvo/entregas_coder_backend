process.on("message", (params) => {
	const express = require("express");
	const mongoose = require("mongoose");
	const { Server: HttpServer } = require("http");
	const { Server: IOServer } = require("socket.io");
	const session = require("express-session");
	const passport = require("passport");
	const mongoStore = require("connect-mongo");
	const logger = require("./logger");
	const configEngine = require("./engine.config");
	const router = require("./routes/productos");
	const userRouter = require("./routes/user");
	const randomRouter = require("./routes/random");
	const DatabaseHandler = require("./database/DAO");
	const { normalizeMessages } = require("./controllers/messages.controller");
	require("dotenv").config();

	// Mongo
	mongoose
		.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => logger.info("Connected to MongoDB!"))
		.catch((err) =>
			logger.error("Error connecting to MongoDB: ", err.stack)
		);

	// Initial config
	const app = express();
	const httpServer = new HttpServer(app);
	const io = new IOServer(httpServer);
	const PORT = JSON.parse(params).PORT || 8080;
	let messages = [];
	let products = [];
	const messageHandler = new DatabaseHandler("Messages");
	const productHandler = new DatabaseHandler("Products");

	// Passport & session
	app.use(
		session({
			store: mongoStore.create({
				mongoUrl: process.env.MONGO_URL,
				mongoOptions: {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				},
			}),
			secret: "passport_auth",
			cookie: {
				maxAge: 300_000,
			},
			rolling: true,
			resave: true,
			saveUninitialized: false,
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	// Middlewares
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static("public"));
	app.use((req, res, next) => {
		logger.info(`Incoming request: [${req.method}] ${req.originalUrl}`);
		next();
	});

	// Routes
	app.use("/api/user", userRouter);
	app.use("/api/productos", router);
	app.use("/api/randoms", randomRouter);

	app.get("/login", (req, res) => {
		res.render("login");
	});

	app.get("/registrate", (req, res) => {
		res.render("signup");
	});

	app.get("/info/data", (req, res) => {
		res.json({
			entryArgs: process.argv,
			OS: process.platform,
			nodeVersion: process.version,
			totalReservedMemory: process.memoryUsage().rss,
			execPath: process.execPath,
			processId: process.pid,
			projectFolder: process.mainModule.path,
		});
	});

	app.get("/info", (req, res) => {
		console.log("a");
		res.render("info");
	});

	app.get("/", (req, res) => {
		res.render("index");
	});

	app.use((req, res) => {
		logger.warn(
			`Incoming request (404 - Not Found): [${req.method}] ${req.originalUrl}`
		);
		res.status(404).send("Page not found!");
	});

	app.use((err, req, res, next) => {
		logger.error(err);
	});

	httpServer
		.listen(PORT, async () => {
			await configEngine(app);
			logger.info(
				`[FORK MODE] Child process (PID ${process.pid}) - Server running on port ${PORT}!`
			);
		})
		.on("error", (error) =>
			logger.error(
				`[ERROR] - [FORK MODE] Child process (PID ${process.pid})`,
				error.message
			)
		);

	// Sockets

	io.on("connection", async (socket) => {
		messages = await messageHandler.getAll();
		products = await productHandler.getAll();

		socket.emit("messages", normalizeMessages(messages));
		socket.emit("products", products);

		socket.on("new-product", (data) => {
			logger.info("WebSocket - New Product");
			let id = 1;
			products.forEach((item) => {
				if (item.id > id) {
					id = item.id;
				}
			});
			products.push({ id: id + 1, ...data });
			io.sockets.emit("products", products);
			productHandler.save(data);
		});

		socket.on("message", async (data) => {
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
});

process.send("ready");

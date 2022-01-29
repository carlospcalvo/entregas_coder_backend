const express = require("express");
const mongoose = require("mongoose");
const { Server: HttpServer } = require("http");
// const { Server: IOServer } = require("socket.io");
const session = require("express-session");
const passport = require("passport");
const mongoStore = require("connect-mongo");
const logger = require("./logger");
// const datefns = require("date-fns");
const configEngine = require("./engine.config");
// const DatabaseHandler = require("./database/DatabaseHandler");
const router = require("./routes/productos");
// const { normalizeMessages } = require("./controllers/messages.controller");
const userRouter = require("./routes/user");
const parseArgs = require("minimist");
const randomRouter = require("./routes/random");
const cluster = require("cluster");
const { fork } = require("child_process");
const CPUsNum = require("os").cpus().length;
require("dotenv").config();

const serverMode = parseArgs(process.argv.slice(2)).cluster
	? "cluster"
	: "fork";

if (serverMode === "cluster") {
	if (cluster.isMaster) {
		logger.info(
			`Cluster Master process (PID ${process.pid}) is running...`
		);

		for (let i = 0; i < CPUsNum; i++) {
			cluster.fork();
		}

		cluster.on("exit", (worker, code, signal) => {
			logger.error(`Cluster Worker (PID ${worker.process.pid}) died!`);
		});
	} else {
		logger.info(`Cluster Worker (PID ${process.pid}) is running...`);
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
		// const io = new IOServer(httpServer);
		const PORT = parseArgs(process.argv.slice(2)).PORT || 8080;
		// let messages = [];
		// let products = [];
		// const messageHandler = new DatabaseHandler("Messages");
		// const productHandler = new DatabaseHandler("Products");

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
			logger.info(
				`[Cluster ${process.pid}] Incoming request: [${req.method}] ${req.originalUrl}`
			);
			next();
		});

		// Routes
		app.use("/user", userRouter);

		app.use("/api/productos", router);

		app.get("/login", (req, res) => {
			res.render("login");
		});

		app.get("/registrate", (req, res) => {
			res.render("signup");
		});

		app.use("/api/randoms", randomRouter);

		app.get("/info/data", (req, res) => {
			res.json({
				entryArgs: process.argv,
				OS: process.platform,
				nodeVersion: process.version,
				totalReservedMemory: process.memoryUsage().rss,
				execPath: process.execPath,
				processId: process.pid,
				projectFolder: process.mainModule.path,
				CPUS: CPUsNum,
			});
		});

		app.get("/info", (req, res) => {
			res.render("info");
		});

		app.get("/", (req, res) => {
			res.render("index");
		});

		app.use((req, res) => {
			logger.warn(
				`Incoming request (404 - Not Found): [${req.method}] ${
					req.headers.host + req.url
				}`
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
					`Cluster worker ${process.pid} - Server running on port ${PORT}!`
				);
			})
			.on("error", (error) =>
				logger.error(
					`Cluster worker ${process.pid} - [ERROR]`,
					error.message
				)
			);

		// Sockets

		/* io.on("connection", async (socket) => {
			//logger.log("Usuario conectado!");
			messages = await messageHandler.getAll();
			products = await productHandler.getAll();
			socket.emit("messages", normalizeMessages(messages));
			socket.emit("products", products);
			socket.on("new-product", (data) => {
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
		}); */
	}
} else {
	logger.info(
		`[FORK MODE] Master process (PID ${process.pid}) is running...`
	);

	const forked = fork("./fork.js");

	forked.on("message", (message) => {
		if (message === "ready") {
			logger.info(
				`[FORK MODE] Child process (PID ${process.pid}) is running...`
			);
			const PORT = parseArgs(process.argv.slice(2)).PORT || 8080;
			forked.send(JSON.stringify({ PORT }));
		}
	});

	forked.on("exit", () => {
		logger.error(`[FORK MODE] Child process (PID ${forked.pid}) died!`);
	});
}

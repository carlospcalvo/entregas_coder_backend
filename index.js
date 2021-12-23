const express = require("express");
const mongoose = require("mongoose");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const session = require("express-session");
const passport = require("passport");
const mongoStore = require("connect-mongo");
const logger = require("tracer").colorConsole();
const datefns = require("date-fns");
const configEngine = require("./engine.config");
const DatabaseHandler = require("./database/DatabaseHandler");
const config = require("./database/config");
const router = require("./routes/productos");
const { normalizeMessages } = require("./controllers/messages.controller");
const userRouter = require("./routes/user");

// Mongo
mongoose
	.connect(config.mongo.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => logger.info("Connected to MongoDB!"))
	.catch((err) => logger.fatal("Error connecting to MongoDB: ", err.stack));

// Initial config
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = 8080;
let messages = [];
let products = [];
const messageHandler = new DatabaseHandler("Messages");
const productHandler = new DatabaseHandler("Products");

// Passport & session
app.use(
	session({
		store: mongoStore.create({
			mongoUrl: config.mongo.url,
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
	logger.trace(`Incoming request: [${req.method}] ${req.originalUrl}`);
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

app.get("/", (req, res) => {
	res.render("index");
});

app.get("*", (req, res) => {
	res.status(404).send("Page not found!");
});

app.use((err, req, res, next) => {
	logger.fatal(err);
});

httpServer
	.listen(PORT, async () => {
		await configEngine(app);
		logger.info(`Server running on port ${PORT}!`);
	})
	.on("error", (error) => logger.fatal("[ERROR]", error.message));

// Sockets

io.on("connection", async (socket) => {
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
});

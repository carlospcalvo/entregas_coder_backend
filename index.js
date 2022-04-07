const { server: config } = require("./config/constants");
const logger = require("./config/logger");
const express = require("express");
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const mongoose = require("mongoose");
const passport = require("passport");
const productRouter = require("./routes/productos");
const cartRouter = require("./routes/cart");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/orders");
const { socketController } = require("./controllers/message.controller");
const { initializeProducts } = require("./controllers/product.controller");
const { verifyToken } = require("./auth/middleware");

// Init
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
mongoose
	.connect(config.mongo, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => logger.info("Connected to MongoDB!"))
	.catch((err) => logger.error("Error connecting to MongoDB: ", err.stack));

// Middlewares
app.use(passport.initialize());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	logger.trace(
		`Incoming request: [${req.method}] ${req.headers.host + req.url}`
	);
	next();
});

// Routes
app.use("/api/productos", productRouter);
app.use("/api/carrito", verifyToken, cartRouter);
app.use("/api/ordenes", verifyToken, orderRouter);
app.use("/api/user", userRouter);

// Info
app.get("/info/data", (req, res) => {
	res.json({
		entryArgs: process.argv,
		OS: process.platform,
		nodeVersion: process.version,
		totalReservedMemory: process.memoryUsage().rss,
		execPath: process.execPath,
		processId: process.pid,
		projectFolder: process.mainModule.path,
		CPUs: require("os").cpus().length,
	});
});

app.get("/", (req, res) => {
	res.render("info");
});

// 404
app.use((req, res, next) => {
	res.status(404).json({
		status: 404,
		message: `This is not the endpoint you're looking for...`,
	});
});

// Error handler
app.use((err, req, res, next) => {
	logger.fatal(err);
	res.status(500).json({ message: err });
});

httpServer
	.listen(config.port, async () => {
		await initializeProducts(config.port);
		const hbs = handlebars.create({
			extname: "hbs",
			defaultLayout: "main.hbs",
			partialsDir:
				__dirname + "/public/templates/handlebars/views/partials/",
		});
		app.engine("hbs", hbs.engine);
		app.set("view engine", "hbs");
		app.set("views", __dirname + "/public/templates/handlebars/views");
	})
	.on("error", (error) => logger.error("[ERROR]", error.message));

// Sockets
io.on("connection", socketController);

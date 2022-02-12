const express = require("express");
const app = express();
// const logger = require("tracer").colorConsole();
const logger = require("./config/logger");
const PORT = process.env.PORT || 8080;

const session = require("express-session");
const passport = require("passport");
const mongoStore = require("connect-mongo");

const productRouter = require("./routes/productos");
const cartRouter = require("./routes/cart");
const userRouter = require("./routes/user");

const { initializeProducts } = require("./controllers/products.controller");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => logger.trace("Connected to MongoDB!"))
	.catch((err) => logger.error("Error connecting to MongoDB: ", err.stack));

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
		secret: "entrega_final",
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
app.use("/api/carrito", cartRouter);
app.use("/api/user", userRouter);

// 404
app.use((req, res, next) => {
	res.status(404).json({
		status: 404,
		message: `This is not the endpoint you're looking for...`,
	});
});

// Error handler ?
app.use((err, req, res, next) => {
	logger.fatal(err);
	res.sendStatus(500);
});

app.listen(PORT, async () => await initializeProducts(PORT)).on(
	"error",
	(error) => logger.error("[ERROR]", error.message)
);

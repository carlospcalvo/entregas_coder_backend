const express = require("express");
const app = express();
const logger = require("tracer").colorConsole();
const PORT = process.env.PORT || 8080;
const { initialize } = require("./config");
const productRouter = require("./routes/productos");
const cartRouter = require("./routes/cart");
const { initializeProducts } = require("./controllers/products.controller");

initialize();

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

// 404
app.use((req, res, next) => {
	res.status(404).json({
		status: 404,
		message: `This is not the endpoint you're looking for...`,
	});
});

app.listen(PORT, async () => await initializeProducts(PORT)).on(
	"error",
	(error) => logger.error("[ERROR]", error.message)
);

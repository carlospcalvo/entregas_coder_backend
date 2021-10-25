const express = require("express");
const app = express();
const PORT = 8080;
const router = require("./routes/productos");
const { initializeProducts } = require("./controllers/products.controller");
const configEngine = require("./engine.config");
const Contenedor = require("./Contenedor");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/productos", router);

app.get("/productos", async (req, res) => {
	let productsExist = false;
	let products = [];
	try {
		const fileHandler = new Contenedor("productos.txt");
		products = await fileHandler.getAll();
		productsExist = products.length > 0;
	} catch (error) {}

	res.render("productos", { products, productsExist });
});

app.get("/", (req, res) => {
	res.render("index");
});

app.listen(PORT, async () => {
	await configEngine(app);
	await initializeProducts(PORT);
}).on("error", (error) => console.error("[ERROR]", error.message));

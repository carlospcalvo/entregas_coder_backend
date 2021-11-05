const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const PORT = 8080;
const router = require("./routes/productos");
const { initializeProducts } = require("./controllers/products.controller");
const configEngine = require("./engine.config");
const Contenedor = require("./Contenedor");
const datefns = require("date-fns");
// Initial config
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

let products = [];
let messages = [];

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use("/api/productos", router);

app.get("/", async (req, res) => {
	res.render("index");
});

httpServer
	.listen(PORT, async () => {
		await configEngine(app);
		await initializeProducts(PORT);
		products = await getProducts();
	})
	.on("error", (error) => console.error("[ERROR]", error.message));

// Sockets

io.on("connection", (socket) => {
	console.log("Usuario conectado!");
	const productFileHandler = new Contenedor("productos.txt");
	const messageFileHandler = new Contenedor("messages.txt");
	socket.emit("products", products);
	socket.emit("messages", messages);

	socket.on("new-product", (data) => {
		let id = 1;
		products.forEach((item) => {
			if (item.id > id) {
				id = item.id;
			}
		});
		products.push({ id: id + 1, ...data });
		io.sockets.emit("products", products);
		productFileHandler.save(data);
	});

	socket.on("message", (data) => {
		const message = {
			email: data.email,
			message: data.message,
			date: datefns.format(
				parseInt(data.timestamp),
				"dd/MM/yyyy HH:mm:ss"
			),
		};

		messages.push(message);
		io.sockets.emit("messages", messages);
		messageFileHandler.save(message);
	});
});

async function getProducts() {
	let products = [];
	try {
		const fileHandler = new Contenedor("productos.txt");
		products = await fileHandler.getAll();
	} catch (error) {}

	return products;
}

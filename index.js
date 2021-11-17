const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const PORT = 8080;
const router = require("./routes/productos");
const configEngine = require("./engine.config");
const DatabaseHandler = require("./databases/DatabaseHandler");
const datefns = require("date-fns");
const db_config = require("./databases/config");

// Initial config
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

let products = [];
let messages = [];

const productHandler = new DatabaseHandler("productos", db_config.mysql);
const messageHandler = new DatabaseHandler("mensajes", db_config.sqlite);

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
		await productHandler.initialize();
		await messageHandler.initialize();
		console.log(`Server running on port ${PORT}!`);
	})
	.on("error", (error) => console.error("[ERROR]", error.message));

// Sockets

io.on("connection", async (socket) => {
	console.log("Usuario conectado!");
	products = await productHandler.getAll();
	messages = await messageHandler.getAll();

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
		productHandler.save(data);
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
		messageHandler.save(message);
	});
});

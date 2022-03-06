const express = require("express");
const logger = require("../logger");
const UserRouter = require("./user");
const ProductRouter = require("./productos");
const RandomRouter = require("./random");

const router = express.Router();

module.exports = class Router {
	constructor() {
		this.routerUsuarios = new UserRouter();
		this.routerProductos = new ProductRouter();
		this.routerRandom = new RandomRouter();
	}

	start() {
		router.use("/api/user", this.routerUsuarios.start());
		router.use("/api/productos", this.routerProductos.start());
		router.use("/api/randoms", this.routerRandom.start());

		router.get("/login", (req, res) => {
			res.render("login");
		});

		router.get("/registrate", (req, res) => {
			res.render("signup");
		});

		router.get("/info/data", (req, res) => {
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

		router.get("/info", (req, res) => {
			res.render("info");
		});

		router.get("/", (req, res) => {
			res.render("index");
		});

		router.use((req, res) => {
			logger.warn(
				`Incoming request (404 - Not Found): [${req.method}] ${req.originalUrl}`
			);
			res.status(404).send("Page not found!");
		});

		router.use((err, req, res, next) => {
			logger.error(err);
		});

		return router;
	}
};

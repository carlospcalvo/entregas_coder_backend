const handlebars = require("express-handlebars");
const logger = require("tracer").colorConsole();
//const inquirer = require("inquirer");

/**
 * Configures a template engine
 * @param {Express} app Express app to be configured
 */
module.exports = async function configEngine(app) {
	logger.log("Configurando servidor con Handlebars...");
	const hbs = handlebars.create({
		extname: "hbs",
		defaultLayout: "main.hbs",
		layoutsDir: __dirname + "/public/templates/handlebars/views/layout/",
		partialsDir: __dirname + "/public/templates/handlebars/views/partials/",
	});
	app.engine("hbs", hbs.engine);
	app.set("view engine", "hbs");
	app.set("views", __dirname + "/public/templates/handlebars/views");
};

const handlebars = require("express-handlebars");
const inquirer = require("inquirer");

/**
 * Configures a template engine based on user input
 * @param {Express} app Express app to be configured
 */
module.exports = async function configEngine(app) {
	let { engine } = await inquirer.prompt({
		name: "engine",
		message: "Elija un motor de plantillas:",
		default: "hbs",
		type: "list",
		choices: ["hbs", "pug", "ejs"],
	});

	switch (engine) {
		case "hbs":
			console.log("Configurando servidor con Handlebars...");
			const hbs = handlebars.create({
				extname: "hbs",
				defaultLayout: "main.hbs",
				layoutsDir: __dirname + "/templates/handlebars/views/layout/",
				partialsDir:
					__dirname + "/templates/handlebars/views/partials/",
			});
			app.engine("hbs", hbs.engine);
			app.set("view engine", "hbs");
			app.set("views", __dirname + "/templates/handlebars/views");
			break;
		case "pug":
			console.log("Configurando servidor con Pug...");
			app.set("view engine", "pug");
			app.set("views", __dirname + "/templates/pug/views");
			break;
		case "ejs":
			console.log("Configurando servidor con EJS...");
			app.set("view engine", "ejs");
			app.set("views", __dirname + "/templates/ejs/views");
			break;
		default:
			break;
	}
};

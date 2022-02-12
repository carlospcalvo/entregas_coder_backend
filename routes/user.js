const express = require("express");
const logger = require("../config/logger");
const router = express.Router();
const passport = require("passport");
const transporter = require("../config/mailing");
require("../auth/index.js");

// Multer config
const fs = require("fs");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync("./public/uploads")) {
			fs.mkdirSync("public/uploads");
		}
		cb(null, "./public/uploads");
	},
	filename: (req, file, cb) => {
		cb(null, `${req.body.email}.${file.mimetype.split("/")[1]}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png"];
	if (allowedFileTypes.includes(file.mimetype)) {
		//accept file
		cb(null, true);
	} else {
		//reject file
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 15,
	},
	fileFilter: fileFilter,
});

// Routes
router.post(
	"/signup",
	upload.single("avatar"),
	passport.authenticate("signup", {
		successMessage: true,
		failureMessage: true,
	}),
	async (req, res) => {
		try {
			const { email, nombre, direccion, edad, telefono } = req.body;
			const mailOptions = {
				from: "CoderServer",
				to: adminEmail,
				subject: "Nuevo registro",
				html: `
					<h1>Datos del nuevo usuario</h1>
					<ul>
						<li>Email: ${email}</li>
						<li>Nombre: ${nombre}</li>
						<li>Dirección: ${direccion}</li>
						<li>Edad: ${edad}</li>
						<li>Teléfono: ${telefono}</li>
					</ul>
				`,
			};
			await transporter.sendMail(mailOptions);
			logger.trace("Email sento to admin with new user info");
		} catch (error) {
			logger.error(
				"No se pudo enviar los datos al administrador: ",
				error.message
			);
		}
		res.status(200).json({ status: 200, message: "User created!" });
	}
);

router.post(
	"/login",
	passport.authenticate("login", {
		successMessage: true,
		failureMessage: true,
	}),
	(req, res) => {
		req.logIn(req.user, (err) => {
			if (err) {
				logger.fatal("Error during login: ", err);
				res.sendStatus(500);
			} else {
				logger.info(`User '${req.body.email}' logueado`);
				res.status(200).json({
					status: 200,
					message: `User '${req.body.email}' logged in!`,
				});
			}
		});
	}
);

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) logger.fatal(err);
		res.sendStatus(200);
	});
});

router.get("/signup/failed", (req, res) => {
	res.json({
		status: "error",
		message: req.session.messages[req.session.messages.length - 1],
	});
});

router.get("/login/failed", (req, res) => {
	res.json({
		status: "error",
		message: req.session.messages[req.session.messages.length - 1],
	});
});

router.get("/current", async (req, res) => {
	try {
		const Usuario = require("../models/user");
		if (!req.session?.passport?.user) {
			res.sendStatus(401);
			return;
		}
		const user = await Usuario.findById(req.session.passport.user).lean();

		res.status(200).json(user);
	} catch (error) {
		logger.error(error.message);
		res.status(500).json({ status: 500, message: error.message });
	}
});

module.exports = router;

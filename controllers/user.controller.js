const { mailing, auth } = require("../config/constants");
const transporter = require("../config/mailing");
const logger = require("../config/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const DAO = require("../daos/index");
const CartDataHandler = DAO.carritos;

const validatePassword = async (user, password) =>
	bcrypt.compare(password, user.password);

const signUpController = async (req, res) => {
	try {
		const { email, password, nombre, direccion, edad, telefono, role } =
			req.body;
		const user = await User.findOne({ email });

		if (user) {
			logger.trace(`Ya existe un usuario con el email '${email}'.`);
			return res.status(400).json({
				message: `Ya existe un usuario con el email '${email}'.`,
			});
		}

		const newUser = {
			role,
			email,
			password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
			nombre,
			direccion,
			edad,
			telefono,
			avatar: req.file.filename,
		};
		const userCreated = await User.create(newUser);

		// Creamos el carrito que va a estar asignado al usuario
		await CartDataHandler.save({
			owner: userCreated._id,
			timestamp: Date.now(),
			productos: [],
		});

		const mailOptions = {
			from: "CoderServer",
			to: mailing.auth.user,
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
		logger.trace(
			`Usuario '${email}' creado! Email enviado al admin con la información del nuevo usuario`
		);

		res.status(201).json({
			message: `Usuario creado!`,
			user: {
				role: userCreated.role,
				email: userCreated.email,
				nombre: userCreated.nombre,
				direccion: userCreated.direccion,
				edad: userCreated.edad,
				telefono: userCreated.telefono,
			},
		});
	} catch (error) {
		logger.error(`Error durante el registro: ${error}`);
		return res.status(500).json({ error });
	}
};

const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			logger.trace(`El usuario '${email}' no existe`);
			return res.status(401).json({
				message: `El usuario '${email}' no existe`,
			});
		}

		if (!validatePassword(user, password)) {
			logger.trace(`Contraseña inválida para el usuario '${email}'`);
			return res.status(401).json({
				message: `Contraseña incorrecta`,
			});
		}

		const body = {
			_id: user._id,
			email: user.email,
			role: user.role,
		};

		const token = jwt.sign({ user: body }, auth.jwtSecret, {
			expiresIn: auth.jwtDuration,
		});

		res.status(200).json({
			message: `Usuario '${email}' logueado!`,
			token,
		});
	} catch (error) {
		logger.error(`Error en login: ${error}`);
		res.status(500).json({ error });
	}
};

module.exports = {
	signUpController,
	loginController,
};

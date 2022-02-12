const logger = require("../config/logger");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

const validatePassword = (user, password) =>
	bcrypt.compareSync(password, user.password);

passport.use(
	"login",
	new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
		User.findOne({ email }, (err, user) => {
			if (err) {
				logger.error(`Error in login: ${err}`);
				return done(err, null, { message: err });
			}

			if (!user) {
				logger.warn(`User '${email}' not found.`);
				return done(null, false, {
					message: `El usuario '${email}' no existe`,
				});
			}

			if (!validatePassword(user, password)) {
				logger.warn(`Invalid password for user '${email}'`);
				return done(null, false, {
					message: `Contraseña incorrecta`,
				});
			}
			return done(null, user);
		});
	})
);

passport.use(
	"signup",
	new LocalStrategy(
		{ usernameField: "email", passReqToCallback: true },
		async (req, email, password, done) => {
			try {
				const user = await User.findOne({ email });

				if (user) {
					logger.warn(`User '${email}' already exists.`);
					return done(null, false, {
						message: `Ya existe un usuario con el email '${email}'.`,
					});
				}
				const { nombre, direccion, edad, telefono } = req.body;
				const newUser = {
					email,
					password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
					nombre,
					direccion,
					edad,
					telefono,
					avatar: req.file.filename,
				};
				logger.debug("Creating user...");
				let userCreated = await User.create(newUser);

				logger.debug("User created!", newUser);
				return done(null, userCreated);
			} catch (error) {
				logger.error(`Error in signup: ${error}`);
				return done(error);
			}
		}
	)
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => User.findById(id, done));

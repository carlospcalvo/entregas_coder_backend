const logger = require("tracer").colorConsole();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../database/models/user");

const validatePassword = (user, password) =>
	bcrypt.compareSync(password, user.password);

passport.use(
	"login",
	new LocalStrategy((username, password, done) => {
		User.findOne({ username }, (err, user) => {
			if (err) {
				logger.error(`Error in login: ${err}`);
				return done(err, null, { message: err });
			}

			if (!user) {
				logger.warn(`User '${username}' not found.`);
				return done(null, false, {
					message: `El usuario '${username}' no existe`,
				});
			}

			if (!validatePassword(user, password)) {
				logger.warn(`Invalid password for user '${username}'`);
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
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username: username });

			if (user) {
				logger.warn(`User '${username}' already exists.`);
				return done(null, false, {
					message: `Ya existe un usuario con el email '${username}'.`,
				});
			}

			const newUser = {
				username,
				password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
			};
			logger.debug("Creating user...");
			let userCreated = await User.create(newUser);

			logger.info(typeof userCreated);
			logger.debug("User created!");
			return done(null, userCreated);
		} catch (error) {
			logger.error(`Error in signup: ${error}`);
			return done(error);
		}
	})
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => User.findById(id, done));

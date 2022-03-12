const logger = require("../../logger");
const bcrypt = require("bcrypt");
const User = require("../../database/models/user");

const validatePassword = (user, password) =>
	bcrypt.compareSync(password, user.password);

const createUserResolver = async (parent, args, context) => {
	const { username, password } = args.data;
	const user = await User.findOne({ username });

	if (user) {
		logger.warn(`User '${username}' already exists.`);
		return {
			message: `Ya existe un usuario con el email '${username}'.`,
		};
	}

	const newUser = {
		username,
		password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
	};
	logger.info(`Creating user ${username}...`);
	const userCreated = await User.create(newUser);
	logger.info(`User ${username} created!`);

	return userCreated;
};

const loginResolver = async (parent, args, context) => {
	const { username, password } = args.data;
	const user = await User.findOne({ username });

	if (!user) {
		logger.warn(`User '${username}' not found.`);
		return {
			message: `El usuario '${username}' no existe`,
		};
	}

	if (!validatePassword(user, password)) {
		logger.warn(`Invalid password for user '${username}'`);
		return {
			message: `Contraseña incorrecta`,
		};
	}

	context.login(user);

	return user;
};

const currentUserResolver = (parent, args, context) => context.getUser();

module.exports = {
	createUserResolver,
	loginResolver,
	currentUserResolver,
};

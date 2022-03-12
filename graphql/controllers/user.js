const { UserInputType, UserType } = require("../types/user");
const {
	createUserResolver,
	loginResolver,
	currentUserResolver,
} = require("../resolvers/user");

const currentUserController = {
	type: UserType,
	resolve: currentUserResolver,
};

const createUserController = {
	type: UserType,
	args: {
		data: { type: UserInputType },
	},
	resolve: createUserResolver,
};

const loginController = {
	type: UserType,
	args: {
		data: { type: UserInputType },
	},
	resolve: loginResolver,
};

module.exports = {
	currentUserController,
	createUserController,
	loginController,
};

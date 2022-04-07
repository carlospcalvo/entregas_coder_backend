const logger = require("../config/logger");
const { ordenes: DataHandler } = require("../daos/index");

const getOrders = async (req, res) => {
	try {
		const order = await DataHandler.findOrderByOwner(req.user._id);

		order
			? res.status(200).json(order)
			: res.status(404).json({
					message: `El usuario ${req.user.email} no tiene órdenes generadas.`,
			  });
	} catch (error) {
		logger.error(error);
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

module.exports = {
	getOrders,
};

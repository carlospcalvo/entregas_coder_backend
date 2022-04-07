const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	id: { type: String, unique: true, required: true },
	timestamp: { type: Number, default: Date.now() },
	owner: { type: mongoose.mongo.ObjectId, required: true, unique: false },
	productos: {
		type: [
			{
				item: { type: Object },
				quantity: { type: Number },
			},
		],
		sparse: true,
	},
});

module.exports = mongoose.model("Orden", orderSchema, "ordenes");

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	id: { type: Number, unique: true },
	timestamp: { type: Number, default: Date.now() },
	owner: { type: mongoose.mongo.ObjectId, required: true, unique: true },
	isConfirmed: { type: Boolean, default: false },
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

module.exports = mongoose.model("Carrito", cartSchema);

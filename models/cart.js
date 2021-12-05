const mongoose = require("mongoose");
const Producto = require("./product");

const cartSchema = new mongoose.Schema({
	id: { type: Number, unique: true },
	timestamp: { type: Number, default: Date.now() },
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

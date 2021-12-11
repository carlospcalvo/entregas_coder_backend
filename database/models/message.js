const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	author: {
		email: { type: String, required: true, max: 100, sparse: true },
		nombre: { type: String, required: true, max: 100 },
		apellido: { type: String, required: true, max: 100 },
		edad: { type: Number, required: true, min: 10, max: 100 },
		alias: { type: String, required: true, max: 50 },
		avatar: { type: String, default: "", max: 200 },
	},
	text: { type: String, required: true, max: 140 },
	date: { type: String, required: true, max: 140 },
	timestamp: { type: Number, required: true },
});

module.exports = mongoose.model("Message", messageSchema);

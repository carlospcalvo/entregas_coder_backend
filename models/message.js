const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	email: { type: String, required: true, max: 100, sparse: true },
	text: { type: String, required: true, max: 140 },
	date: { type: String, required: true, max: 140 },
	timestamp: { type: Number, required: true },
});

module.exports = mongoose.model("Mensaje", messageSchema);

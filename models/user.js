const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
	email: { type: String, required: true, max: 100 },
	password: { type: String, required: true, max: 100 },
	nombre: { type: String, required: true, max: 100 },
	telefono: { type: String, required: true, max: 20 },
	avatar: { type: String, required: true, max: 100 },
});

module.exports = mongoose.model("Usuario", userSchema);

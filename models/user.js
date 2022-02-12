const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, max: 100 },
	password: { type: String, required: true, max: 100 },
	nombre: { type: String, required: true, max: 100 },
	edad: { type: Number, required: true, min: 16, max: 100 },
	direccion: { type: String, required: true, max: 100 },
	telefono: { type: String, required: true, max: 20 },
	avatar: { type: String, required: true, max: 100 },
});

module.exports = mongoose.model("Usuario", userSchema);

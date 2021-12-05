const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	id: { type: Number, unique: true, auto: true },
	timestamp: { type: Number, required: true },
	codigo: { type: String, required: true, max: 100 },
	nombre: { type: String, required: true, max: 100 },
	descripcion: { type: String, required: true, max: 200 },
	precio: { type: Number, required: true },
	foto: { type: String, required: true, max: 100 },
	stock: { type: Number, required: true },
});

module.exports = mongoose.model("Producto", productSchema);

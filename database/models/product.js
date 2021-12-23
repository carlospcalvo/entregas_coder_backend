const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	id: { type: Number, unique: true, auto: true },
	title: { type: String, required: true, max: 100 },
	price: { type: Number, required: true },
	thumbnail: { type: String, required: true, max: 100 },
});

module.exports = mongoose.model("Producto", productSchema);

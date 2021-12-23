const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, max: 100 },
	password: { type: String, required: true, max: 100 },
});

module.exports = mongoose.model("User", userSchema);

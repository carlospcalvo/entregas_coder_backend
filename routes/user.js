const express = require("express");
const router = express.Router();
require("../auth/index.js");

// Multer config
const fs = require("fs");
const multer = require("multer");
const {
	loginController,
	signUpController,
} = require("../controllers/user.controller");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync("./public/uploads")) {
			fs.mkdirSync("public/uploads", { recursive: true });
		}
		cb(null, "./public/uploads");
	},
	filename: (req, file, cb) => {
		cb(null, `${req.body.email}.${file.mimetype.split("/")[1]}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png"];
	if (allowedFileTypes.includes(file.mimetype)) {
		//accept file
		cb(null, true);
	} else {
		//reject file
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 15,
	},
	fileFilter: fileFilter,
});

// Routes
router.post("/signup", upload.single("avatar"), signUpController);

router.post("/login", loginController);

module.exports = router;

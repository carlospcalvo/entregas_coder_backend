const productMongoDAO = require("./productos/mongodb");
const productFirebaseDAO = require("./productos/firebase");
const productArchivoDAO = require("./productos/archivo");
const productMemoriaDAO = require("./productos/memoria");
const cartMongoDAO = require("./carrito/mongodb");
const cartFirebaseDAO = require("./carrito/firebase");
const cartArchivoDAO = require("./carrito/archivo");
const cartMemoriaDAO = require("./carrito/memoria");
const { getFirestore, collection } = require("firebase/firestore/lite");

console.warn(productMemoriaDAO);

let firebaseSelected = process.argv[2] === "firebase";
let db;
if (firebaseSelected) {
	const { initializeApp } = require("firebase/app");

	const firebaseConfig = {
		apiKey: "AIzaSyB6VV7f7eBVY5AqFLsmU1dMMUSpm87fgo8",
		authDomain: "coder-backend-916d6.firebaseapp.com",
		projectId: "coder-backend-916d6",
		storageBucket: "coder-backend-916d6.appspot.com",
		messagingSenderId: "88022108199",
		appId: "1:88022108199:web:b91e16afbf432da6efe602",
	};
	// Initialize Firebase
	const firebase_app = initializeApp(firebaseConfig);
	db = getFirestore(firebase_app);
}

module.exports = {
	archivo: {
		productos: new productArchivoDAO(),
		carritos: new cartArchivoDAO(),
	},
	mongo: {
		productos: new productMongoDAO(),
		carritos: new cartMongoDAO(),
	},
	firebase: {
		productos: firebaseSelected
			? new productFirebaseDAO(collection(db, "productos"))
			: null,
		carritos: firebaseSelected
			? new cartFirebaseDAO(collection(db, "carritos"))
			: null,
	},
	memoria: {
		productos: new productMemoriaDAO(),
		carritos: new cartMemoriaDAO(),
	},
};

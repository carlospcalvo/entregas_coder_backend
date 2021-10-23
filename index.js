const express = require("express");
const app = express();
const PORT = 8080;
const router = require("./routes/productos");
const { initializeProducts } = require("./controllers/products.controller");

//middleware static
//middleware errores
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/productos", router);

app.listen(PORT, async () => await initializeProducts(PORT)).on(
	"error",
	(error) => console.error("[ERROR]", error.message)
);

const fs = require("fs/promises");
const express = require("express");
const app = express();
const PORT = 8080;
const Contenedor = require("./Contenedor");

let products = [];

app.get("/productos", (req, res) => res.json(products));

app.get("/productoRandom", (req, res) => {
	let random = Math.floor(Math.random() * products.length);
	res.json(products[random]);
});

app.listen(PORT, async () => await initializeProducts());

async function initializeProducts() {
	let dummyData = [
		{
			title: "Macbook Air 2020 M1",
			price: "1000",
			thumbnail: "https://placekitten.com/200/400",
		},
		{
			title: "Macbook Pro 2020 M1",
			price: "1200",
			thumbnail: "https://placekitten.com/200/300",
		},
		{
			title: "Macbook Pro 2019 Intel",
			price: "1100",
			thumbnail: "https://placekitten.com/300/400",
		},
	];

	const fileHandler = new Contenedor("productos.txt");

	try {
		let data = await fileHandler.getAll();
		if (data.length > 0) {
			products = [...data];
			return;
		} else {
			throw new Error("Is this worth it in the name of DRY?");
		}
	} catch {
		products = [...dummyData];
		dummyData.forEach(async (element) => {
			await fileHandler.save(element);
		});
	} finally {
		console.log(`Server running on port ${PORT}`);
	}
}

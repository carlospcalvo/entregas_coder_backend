const axios = require("axios");
const faker = require("faker");
require("dotenv").config();

const uri = `http://localhost:${process.env.PORT || 8080}/api/productos`;

(async () => {
	try {
		console.log("> ### Alta de producto ###");
		let dummyProduct = {
			title: faker.commerce.productName(),
			price: faker.commerce.price(),
			thumbnail: faker.image.imageUrl(),
		};
		const postConfig = {
			method: "POST",
			url: uri,
			data: dummyProduct,
		};
		const postResponse = await axios(postConfig);
		dummyProduct = postResponse.data;
		console.log(
			`>> Resultado: ${postResponse.status} - ${postResponse.statusText}`
		);
		console.log(">>", postResponse.data);
		console.log(
			"---------------------------------------------------------------"
		);

		console.log("> ### Listado de productos ###");
		const getAllConfig = {
			method: "GET",
			url: uri,
		};
		const getAllResponse = await axios(getAllConfig);
		console.log(
			`>> Resultado: ${getAllResponse.status} - ${getAllResponse.statusText}`
		);
		console.log(">>", getAllResponse.data);

		console.log(
			"---------------------------------------------------------------"
		);

		console.log("> ### Modificación de producto ###");
		const putConfig = {
			method: "PUT",
			url: `${uri}/${dummyProduct.id}`,
			data: { ...dummyProduct, price: faker.commerce.price() },
		};
		const putResponse = await axios(putConfig);
		dummyProduct = putResponse.data;
		console.log(
			`>> Resultado: ${putResponse.status} - ${putResponse.statusText}`
		);
		console.log(">> ", putResponse.data);

		console.log(
			"---------------------------------------------------------------"
		);

		console.log("> ### Baja de producto ###");
		const deleteConfig = {
			method: "DELETE",
			url: `${uri}/${dummyProduct.id}`,
		};
		const deleteResponse = await axios(deleteConfig);
		console.log(
			`>> Resultado: ${deleteResponse.status} - ${deleteResponse.statusText}`
		);
		console.log(">> ", deleteResponse.data);
	} catch (error) {
		console.error(error);
	}
})();

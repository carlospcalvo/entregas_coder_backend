const faker = require("faker/locale/es_MX");

/**
 * Returns 5 mocked products
 * @param {Request} req
 * @param {Response} res
 */
const getMockedProducts = async (req, res) => {
	try {
		let products = [];
		for (let i = 0; i < 5; i++) {
			products.push({
				title: faker.commerce.productName(),
				price: parseFloat(faker.commerce.price(1000, 5000)),
				thumbnail: faker.image.imageUrl(50, 50, "tech", true),
			});
		}
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({
			status: 500,
			message: error.message,
		});
	}
};

module.exports = {
	getMockedProducts,
};

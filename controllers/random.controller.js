module.exports = (req, res) => {
	const quantity = req.query.cant || 100_000_000;
	const result = {};

	for (let index = 0; index < quantity; index++) {
		let number = getRandomNumber(1, 1000);

		if (!result[number]) {
			result[number] = 1;
		} else {
			result[number] += 1;
		}
	}

	res.json(result);
};

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

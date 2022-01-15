process.on("message", (params) => {
	const quantity = parseInt(params);
	const result = {};

	for (let index = 0; index < quantity; index++) {
		let number = getRandomNumber(1, 1000);

		if (!result[number]) {
			result[number] = 1;
		} else {
			result[number] += 1;
		}
	}

	let resultA = {};
	let resultB = {};
	let resultC = {};
	let resultD = {};
	let resultE = {};

	for (const key of Object.keys(result)) {
		const number = parseInt(key);
		if (number <= 200) {
			resultA[key] = result[key];
		} else if (number <= 400 && number > 200) {
			resultB[key] = result[key];
		} else if (number <= 600 && number > 400) {
			resultC[key] = result[key];
		} else if (number <= 800 && number > 600) {
			resultD[key] = result[key];
		} else {
			resultE[key] = result[key];
		}
	}

	// Hasta 1500 numeros los pasaba al proceso padre sin problema
	// Para evitar que se cuelgue el proceso padre, se envia de a partes
	if (Object.keys(resultA).length) {
		process.send(resultA);
	}
	if (Object.keys(resultB).length) {
		process.send(resultB);
	}
	if (Object.keys(resultC).length) {
		process.send(resultC);
	}
	if (Object.keys(resultD).length) {
		process.send(resultD);
	}
	if (Object.keys(resultE).length) {
		process.send(resultE);
	}

	process.exit();
});

process.send("ready");

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

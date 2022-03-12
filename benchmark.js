const autocannon = require("autocannon");
const { PassThrough } = require("stream");

function runBenchmark(url) {
	const buffer = [];
	const outputStream = new PassThrough();

	const instance = autocannon({
		url,
		connections: 100,
		duration: 20,
	});

	autocannon.track(instance, { outputStream });

	outputStream.on("data", (data) => buffer.push(data));

	instance.on("done", () => process.stdout.write(Buffer.concat(buffer)));
}

runBenchmark(`http://localhost:8080/info`);

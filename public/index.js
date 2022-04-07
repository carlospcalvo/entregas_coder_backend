window.onload = async () => {
	const infoDiv = document.getElementById("info");
	try {
		const { data } = await axios({
			method: "GET",
			url: `http://localhost:8080/info/data`,
			headers: {
				"Content-type": "application/json;charset=utf-8",
				"Allow-Access-Control-Origin": "*",
			},
		});

		if (data) {
			const {
				entryArgs,
				OS,
				nodeVersion,
				totalReservedMemory,
				execPath,
				processId,
				projectFolder,
				CPUs,
			} = data;
			let argsList = "";

			entryArgs.forEach((entry) => {
				argsList += `<li>${entry}</li>`;
			});

			infoDiv.innerHTML = `
				<div class="row w-100">
					<div class="col card m-2" style="background-color: lightgrey;">
						<div class="card-body text-start">
							<h3 class="text-center">Argumentos de entrada</h3>
							<hr />
							<ol>
								${argsList}
							</ol>
						</div>
					</div>
					<div class="col card m-2" style="background-color: lightgrey;">
						<div class="card-body text-center">
							<h3>Sistema operativo</h3>
							<hr />
							<span>${OS}</span>
						</div>
					</div>
					<div class="col card m-2" style="background-color: lightgrey;">
						<div class="card-body text-center">
							<h3>Versión Node</h3>
							<hr />
							<span>${nodeVersion}</span>
						</div>
					</div>
				</div>
				<div class="row w-100">
					<div class="card m-2" style="background-color: lightgrey; width: 32%;">
						<div class="card-body text-center">
							<h3>Memoria total reservada (rss)</h3>
							<hr />
							<span>${totalReservedMemory} bytes</span>
						</div>
					</div>
					<div class="col card m-2" style="background-color: lightgrey;">
						<div class="card-body text-start">
							<h3 class="text-center">Path de ejecución</h3>
							<hr />
							<span>${execPath}</span>
						</div>
					</div>
					<div class="col card m-2" style="background-color: lightgrey;">
						<div class="card-body text-center">
							<h3 class="text-center">Process id</h3>
							<hr />
							<span>${processId}</span>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col card m-2" style="background-color: lightgrey;">
						<div class="card-body text-start">
							<h3 class="text-center">Carpeta del proyecto</h3>
							<hr />
							<span>${projectFolder}</span>
						</div>
					</div>
					<div class="col card m-2" style="background-color: lightgrey;">
						<div class="card-body text-center">
							<h3>Cantidad de CPUs</h3>
							<hr />
							<span>${CPUs}</span>
						</div>
					</div>
				</div>
			`;
		}
	} catch (error) {
		console.error(error);
	}
};

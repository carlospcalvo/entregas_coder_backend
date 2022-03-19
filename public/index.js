const socket = io("http://localhost:8081");
const sendMessage = () => {
	const email = document.getElementById("email").value;
	const message = document.getElementById("message").value;
	const nombre = document.getElementById("nombre").value;
	const apellido = document.getElementById("apellido").value;
	const alias = document.getElementById("alias").value;
	const avatar = document.getElementById("avatar").value;
	const edad = parseInt(document.getElementById("edad").value);

	if (!email) {
		alert("Email inválido!");
		return;
	}

	if (message.length === 0) {
		alert("No podés enviar un mensaje vacío!");
		return;
	}

	if (!nombre || !apellido) {
		alert("Completá tu nombre y apellido!");
		return;
	}

	if (!edad) {
		alert("Completá tu edad!");
		return;
	}

	if (edad < 10 || edad > 100) {
		alert("La edad debe ser un número entre 10 y 100");
		return;
	}

	if (!alias || !avatar) {
		alert("Completá tu alias y/o avatar!");
		return;
	}

	const messageSent = {
		author: {
			email,
			nombre,
			apellido,
			edad,
			alias,
			avatar,
		},
		text: message,
		// timestamp: Date.now(),
	};

	socket.emit("new-message-to-server", messageSent);

	document.getElementById("message").value = "";
};

const renderMessages = (messages) => {
	if (window.location.pathname === "/") {
		console.log("[renderMessages] messages", messages.length);
		// const { entities, result } = normalizr.denormalize(
		// 	messages,
		// 	messagesSchema
		// );
		let html = "";
		if (messages.length > 0) {
			messages.forEach((message) => {
				html += `
					<p>
						<img src=${message.author.avatar} />
						<span style="color: blue; font-weight: 800;">
							${message.author.alias}
						</span>
						<span style="color:chocolate">
							[${message.date}]:
						</span>
						<span style="color: olivedrab; font-style: italic">
							${message.text}
						</span>
					</p>
				`;
			});

			document.getElementById("messages").innerHTML = html;
		} else {
			const html = `
			<div class="alert alert-warning text-center" role="alert">
				No hay mensajes, escribí algo!
			</div>
		`;
			document.getElementById("messages").innerHTML = html;
		}
	}
};

const renderProducts = async () => {
	if (window.location.pathname === "/") {
		try {
			const { data } = await axios.get(`http://localhost:8081/products`);
			if (data && data.length > 0) {
				const html = data
					.map((item, i) => {
						return `
						<tr>
							<th scope="row">${item.id ?? i + 1}</th>
							<td>${item.title}</td>
							<td>${item.price}</td>
							<td><img src=${item.thumbnail} alt="Foto ${item.title}"></td>
						</tr>
					`;
					})
					.join(" ");
				document.getElementById("products-table").innerHTML = html;
			} else {
				const html = `
				<div class="alert alert-warning" role="alert">
					No hay productos para mostrar
				</div>
			`;
				document.getElementById("products").innerHTML = html;
			}
		} catch (error) {
			console.error(error.message);
			const html = `
				<div class="alert alert-error" role="alert">
					Ha ocurrido un error cargando los productos
				</div>
			`;
			document.getElementById("products").innerHTML = html;
		}
	}
};

window.onload = async () => {
	if (window.location.pathname === "/") {
		const main = document.getElementById("root");

		// try {
		// 	const sessionResponse = await axios({
		// 		method: "GET",
		// 		url: `http://localhost:8081/user/session`,
		// 		headers: {
		// 			"Content-type": "application/json;charset=utf-8",
		// 			"Allow-Access-Control-Origin": "*",
		// 		},
		// 	});
		// 	userName = sessionResponse.data.user;
		// 	if (userName) {
		// 		main.innerHTML = `
		// 			<div class="alert alert-success d-flex justify-content-between align-items-center m-0" style="width: 75vw; role="alert">
		// 				<h6 style="margin: 0">Bienvenido ${userName}!</h6>
		// 				<button class="btn btn-danger" type="button" onclick="handleLogout()" >Logout</button>
		// 			</div>
		// 		`;
		// 	} else {
		// 		main.innerHTML = `
		// 			<div class="mt-3 card" style="width: 100%;" id="login">
		// 				<div class="card-body" id="card-body">
		// 					<a href="/login">
		// 						<button
		// 							class="btn btn-primary"
		// 							type="button"
		// 							id="login-button"
		// 						>
		// 							Ingresar
		// 						</button>
		// 					</a>
		// 				</div>
		// 			</div>
		// 		`;
		// 	}
		// } catch (error) {
		// 	console.error(error);
		// }
	} else if (window.location.pathname === "/info") {
		console.log("Retrieving process info...");
		const infoDiv = document.getElementById("info");
		try {
			const { data } = await axios({
				method: "GET",
				url: `http://localhost:8081/info/data`,
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
				<div class="card m-2" style="background-color: lightgrey;">
					<div class="card-body text-start">
						<h3 class="text-center">Argumentos de entrada</h3>
						<hr />
						<ol>
							${argsList}
						</ol>
					</div>
				</div>
				<div class="card m-2" style="background-color: lightgrey;">
					<div class="card-body text-center">
						<h3>Sistema operativo</h3>
						<hr />
						<span>${OS}</span>
					</div>
				</div>
				<div class="card m-2" style="background-color: lightgrey;">
					<div class="card-body text-center">
						<h3>Versión Node</h3>
						<hr />
						<span>${nodeVersion}</span>
					</div>
				</div>
				<div class="card m-2" style="background-color: lightgrey;">
					<div class="card-body text-center">
						<h3>Memoria total reservada (rss)</h3>
						<hr />
						<span>${totalReservedMemory} bytes</span>
					</div>
				</div>
				<div class="card m-2" style="background-color: lightgrey;">
					<div class="card-body text-start">
						<h3 class="text-center">Path de ejecución</h3>
						<hr />
						<span>${execPath}</span>
					</div>
				</div>
				<div class="card m-2" style="background-color: lightgrey;">
					<div class="card-body text-center">
						<h3 class="text-center">Process id</h3>
						<hr />
						<span>${processId}</span>
					</div>
				</div>
				<div class="card m-2" style="background-color: lightgrey;">
					<div class="card-body text-start">
						<h3 class="text-center">Carpeta del proyecto</h3>
						<hr />
						<span>${projectFolder}</span>
					</div>
				</div>
				<div class="card m-2" style="background-color: lightgrey;">
					<div class="card-body text-center">
						<h3>Cantidad de CPUs</h3>
						<hr />
						<span>${CPUs}</span>
					</div>
				</div>
			`;
			}
		} catch (error) {
			console.error(error);
		}
	}
	// socket.on("products", (products) => renderProducts(products));
	socket.on("all-messages-to-client", (messages) => renderMessages(messages));
	socket.on("new-message-to-client", (messages) => renderMessages(messages));
	console.log(socket);
	renderProducts();
};

function deleteNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.lastChild);
	}
}

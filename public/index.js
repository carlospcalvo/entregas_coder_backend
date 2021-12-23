const socket = io();

const schemaAuthor = new normalizr.schema.Entity(
	"authors",
	{},
	{ idAttribute: "email" }
);

const schemaMessage = new normalizr.schema.Entity(
	"messages",
	{
		author: schemaAuthor,
	},
	{ idAttribute: "timestamp" }
);

const messagesSchema = [schemaMessage];

const addProduct = () => {
	const title = document.getElementById("title").value;
	const price = parseFloat(document.getElementById("price").value);
	const thumbnail = document.getElementById("thumbnail").value;

	if (title.length === 0) {
		alert("El título no puede estar vacío!");
		return;
	}

	if (price.length === 0 || isNaN(price)) {
		alert("Precio inválido!");
		return;
	}

	const product = {
		title,
		price,
		thumbnail,
	};
	socket.emit("new-product", product);
};

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
		email,
		message,
		nombre,
		apellido,
		alias,
		avatar,
		edad,
		timestamp: Date.now(),
	};
	socket.emit("message", messageSent);

	document.getElementById("message").value = "";
};

const renderProducts = async () => {
	if (window.location.pathname === "/") {
		try {
			const { data } = await axios.get(
				"http://localhost:8080/api/productos"
			);
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

const renderMessages = (messages) => {
	if (window.location.pathname === "/") {
		const { entities, result } = normalizr.denormalize(
			messages,
			messagesSchema
		);
		let html = "";
		if (result.length > 0) {
			result.forEach((message_id) => {
				html += `
					<p>
						<img src=${
							entities["authors"][
								entities["messages"][`${message_id}`].author
							].avatar
						} />
						<span style="color: blue; font-weight: 800;">
							${entities["authors"][entities["messages"][`${message_id}`].author].alias}
						</span>
						<span style="color:chocolate">
							[${entities["messages"][`${message_id}`].date}]:
						</span>
						<span style="color: olivedrab; font-style: italic">
							${entities["messages"][`${message_id}`].text}
						</span>
					</p>
				`; //
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

//Session
let userName;

window.onload = async () => {
	if (window.location.pathname === "/") {
		const main = document.getElementById("root");

		try {
			const sessionResponse = await axios({
				method: "GET",
				url: "http://localhost:8080/user/session",
				headers: {
					"Content-type": "application/json;charset=utf-8",
					"Allow-Access-Control-Origin": "*",
				},
			});
			userName = sessionResponse.data.user;
			if (userName) {
				main.innerHTML = `
					<div class="alert alert-success d-flex justify-content-between align-items-center m-0" style="width: 75vw; role="alert">
						<h6 style="margin: 0">Bienvenido ${userName}!</h6>
						<button class="btn btn-danger" type="button" onclick="handleLogout()" >Logout</button>
					</div>
				`;
			} else {
				main.innerHTML = `
					<div class="mt-3 card" style="width: 100%;" id="login">
						<div class="card-body" id="card-body">
							<a href="/login">
								<button
									class="btn btn-primary"
									type="button"
									id="login-button"
								>
									Ingresar
								</button>
							</a>	
						</div>
					</div>
				`;
			}
		} catch (error) {
			console.error(error);
		}
	}
	//socket.on("products", (products) => renderProducts(products));
	socket.on("messages", (messages) => renderMessages(messages));
	renderProducts();
};

const handleLogout = async () => {
	const loginDiv = document.getElementById("root");

	let response = await axios({
		method: "GET",
		url: "http://localhost:8080/user/logout",
		headers: {
			"Content-type": "application/json;charset=utf-8",
			"Allow-Access-Control-Origin": "*",
		},
	});
	console.log(response);
	if (response.status === 200) {
		deleteNodes(loginDiv);
		loginDiv.innerHTML = `
			<div class="alert alert-warning d-flex justify-content-between align-items-center m-0" role="alert">
				<h6 style="margin: 0">Hasta luego ${userName || ""}!</h6>
			</div>	
		`;
	}
};

function deleteNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.lastChild);
	}
}

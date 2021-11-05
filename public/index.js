const socket = io();

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

	if (!email) {
		alert("Email inválido!");
		return;
	}

	if (message.length === 0) {
		alert("No podés enviar un mensaje vacío!");
		return;
	}

	const messageSent = {
		email,
		message,
		timestamp: Date.now(),
	};
	socket.emit("message", messageSent);

	document.getElementById("message").value = "";
};

const renderProducts = (data) => {
	if (data && data.length > 0) {
		const html = data
			.map((item) => {
				return `
					<tr>
						<th scope="row">${item.id}</th>
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
};

const renderMessages = (messages) => {
	if (messages && messages.length > 0) {
		const html = messages
			.map((message) => {
				return `
				<p>
					<span style="color: blue; font-weight: 800;">
						${message.email}
					</span>
					<span style="color:chocolate">
						[${message.date}]:
					</span>
					<span style="color: olivedrab; font-style: italic">
						${message.message}
					</span>
				</p>
			`;
			})
			.join(" ");
		document.getElementById("messages").innerHTML = html;
	} else {
		const html = `
			<div class="alert alert-warning text-center" role="alert">
				No hay mensajes, escribí algo!
			</div>
		`;
		document.getElementById("messages").innerHTML = html;
	}
};

socket.on("products", (products) => renderProducts(products));
socket.on("messages", (messages) => renderMessages(messages));

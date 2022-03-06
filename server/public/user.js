const validateEmail = () => {
	const firstEmail = document.getElementById("registerEmail");
	const secondEmail = document.getElementById("registerConfirmEmail");

	if (firstEmail.value !== secondEmail.value) {
		secondEmail.className += " is-invalid";
		return false;
	}
	secondEmail.className = "form-control";
	return true;
};

const registerUser = async () => {
	const username = document.getElementById("registerEmail").value;
	const password = document.getElementById("registerPassword").value;

	if (validateEmail()) {
		const card = document.getElementById("signup-card-error");
		try {
			const response = await axios({
				method: "POST",
				url: "http://localhost:8080/user/signup",
				headers: {
					"Content-type": "application/json;charset=utf-8",
				},
				data: JSON.stringify({ username, password }),
			});

			if (response.data?.status === "error") {
				deleteNodes(card);
				card.innerHTML = `
					<div class="alert alert-danger d-flex flex-column justify-content-between align-items-center mb-3" role="alert">
						${response.data?.message}
					</div>
				`;
			} else {
				window.location.href = "/login";
			}
		} catch (error) {
			deleteNodes(card);
			console.error(error);
			card.innerHTML = `
			<div class="alert alert-danger d-flex flex-column justify-content-between align-items-center mb-3" role="alert">
				${error}
			</div>
			`;
		}
	}
};

const login = async () => {
	const username = document.getElementById("loginEmail").value;
	const password = document.getElementById("loginPassword").value;
	const card = document.getElementById("login-card-error");
	try {
		let response = await axios({
			method: "POST",
			url: "http://localhost:8080/user/login",
			headers: {
				"Content-type": "application/json;charset=utf-8",
			},
			data: JSON.stringify({ username, password }),
		});

		if (response.data?.status === "error") {
			deleteNodes(card);
			card.innerHTML = `
			<div class="alert alert-danger d-flex flex-column justify-content-between align-items-center mb-3" role="alert">
				${response.data?.message}
			</div>
			`;
		} else {
			window.location.href = "/";
		}
	} catch (error) {
		deleteNodes(card);
		console.error(error);
		card.innerHTML = `
			<div class="alert alert-danger d-flex flex-column justify-content-between align-items-center mb-3" role="alert">
				${error}
			</div>
		`;
	}
};

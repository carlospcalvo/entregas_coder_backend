// @deno-types="https://deno.land/x/servest@v1.3.1/types/react/index.d.ts"
import React from "https://dev.jspm.io/react/index.js";
// @deno-types="https://deno.land/x/servest@v1.3.1/types/react-dom/server/index.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js";
import {
	createApp,
	contentTypeFilter,
} from "https://deno.land/x/servest@v1.3.1/mod.ts";

const colors: string[] = [];

const app = createApp();

app.get("/colors", async (req) => {
	await req.respond({
		status: 200,
		headers: new Headers({
			"content-type": "application/json",
		}),
		body: JSON.stringify(colors),
	});
});

app.post("/form/json", contentTypeFilter("application/json"), async (req) => {
	const { color } = (await req.json()) as { color: string };
	colors.push(color);
	await req.respond({
		status: 201,
		headers: new Headers({
			"content-type": "application/json",
		}),
		body: JSON.stringify({ color }),
	});
});

app.post(
	"/form/urlencoded",
	contentTypeFilter("application/x-www-form-urlencoded"),
	async (req) => {
		const body = await req.formData();
		const color = body.value("color");

		if (color) {
			colors.push(color);
		}

		await req.redirect("/");
	}
);

app.handle("/", async (req) => {
	await req.respond({
		status: 200,
		headers: new Headers({
			"content-type": "text/html; charset=UTF-8",
		}),
		body: ReactDOMServer.renderToString(
			<html>
				<head>
					<meta charSet="utf-8" />
					<link
						href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
						rel="stylesheet"
						integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
						crossOrigin="anonymous"
					></link>
					<title>Entrega Deno</title>
				</head>
				<body>
					<main
						style={{
							minHeight: "100vh",
							minWidth: "100vw",
							backgroundColor: "black",
						}}
					>
						<h1
							style={{
								color: "white",
								textAlign: "center",
								paddingTop: "1rem",
							}}
						>
							Entrega Deno
						</h1>
						<form
							className="mb-3"
							style={{
								maxWidth: "20rem",
								marginLeft: "auto",
								marginRight: "auto",
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
							}}
							method="post"
							target="_self"
							action="/form/urlencoded"
						>
							<label
								htmlFor="colorInput"
								className="form-label"
								style={{ color: "white" }}
							>
								Ingrese un color (en inglés):
							</label>
							<input
								type="text"
								className="form-control"
								id="colorInput"
								name="color"
								placeholder="blue"
							/>
							<input
								className="btn btn-primary mt-2"
								type="submit"
								value="Enviar"
							/>
						</form>
						<section
							style={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							{colors && (
								<ul>
									{colors.map((color) => (
										<li key={color} style={{ color }}>
											{color}
										</li>
									))}
								</ul>
							)}
						</section>
					</main>
				</body>
				<iframe
					name="hiddenFrame"
					width="0"
					height="0"
					style={{ display: "none", border: 0 }}
				></iframe>
			</html>
		),
	});
});

app.listen({ port: 8080 });

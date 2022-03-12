const faker = require("faker");
const expect = require("chai").expect;
const url = `http://localhost:${process.env.PORT || 8080}/api/productos`;
const request = require("supertest")(url);

module.exports = class ProductTests {
	constructor() {
		this.product = {
			title: faker.commerce.productName(),
			price: faker.commerce.price(),
			thumbnail: faker.image.imageUrl(),
		};
	}

	test() {
		// POST endpoints
		describe("Dar de alta un producto: ", () => {
			it("debería crear un producto nuevo", (done) => {
				request
					.post("/")
					.send(this.product)
					.end((err, res) => {
						console.log(res.body);
						this.product = res.body;
						expect(res.status).to.equal(201);
						done();
					});
			});
			it("debería fallar al intentar crear un producto nuevo", (done) => {
				request
					.post("/")
					.send({
						title: "Producto test",
						thumbnail: "http://www.dummyurl.com",
					})
					.end((err, res) => {
						err ? done(err) : done();
						expect(res.status).to.equal(500);
					});
			});
		});

		// GET endpoints
		describe("Listar productos: ", () => {
			it("debería mostrar todos los productos", (done) => {
				request.get("/").end((err, res) => {
					expect(res.status).to.equal(200);
					err ? done(err) : done();
				});
			});

			it(`debería mostrar el producto con id ${this.product.id}`, (done) => {
				request.get(`/${this.product.id}`).end((err, res) => {
					expect(res.status).to.equal(200);
					err ? done(err) : done();
				});
			});
		});

		// PUT endpoint
		describe("Editar un producto: ", (done) => {
			beforeEach(async () => {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			});
			it(`debería editar el producto con id ${this.product.id}`, (done) => {
				request
					.put(`/${this.product.id}`)
					.send({
						id: this.product.id,
						title: "Producto test (editado)",
						price: 5000,
						thumbnail: this.product.thumbnail,
					})
					.end((err, res) => {
						this.product = res.body;
						expect(res.status).to.equal(200);
						err ? done(err) : done();
					});
			});
		});

		// DELETE endpoint

		describe("Eliminar un producto: ", () => {
			beforeEach(async () => {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			});
			it(`debería eliminar el producto con id ${this.product.id}`, (done) => {
				request.get(`/${this.product.id}`).end((err, res) => {
					expect(res.status).to.equal(200);
					request.del(`/${this.product.id}`).end((err, res) => {
						expect(res.status).to.equal(200);
						request.get(`/${this.product.id}`).end((err, res) => {
							expect(res.status).to.equal(404);
							err ? done(err) : done();
						});
					});
				});
			});

			it("debería fallar al tratar eliminar un producto no existente", (done) => {
				request.del(`/5000`).end((err, res) => {
					expect(res.status).to.equal(404);
					err ? done(err) : done();
				});
			});
		});
	}
};

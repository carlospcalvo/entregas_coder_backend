const faker = require("faker");
const expect = require("chai").expect;
const url = `http://localhost:${process.env.PORT || 8080}/api/user`;
const request = require("supertest")(url);

module.exports = class UserTests {
	constructor() {
		this.user = {
			username: faker.internet.userName(),
			password: faker.internet.password(),
		};
	}

	test() {
		// Registro
		describe("Registro de un usuario: ", () => {
			it("debería crear un usuario nuevo", (done) => {
				request
					.post("/signup")
					.send(this.user)
					.end((err, res) => {
						expect(res).to.have.status(201);
						err ? done(err) : done();
					});
			});
		});

		// Login
		describe("Log in de un usuario: ", () => {
			it("debería loguearse un usuario", (done) => {
				request
					.post("/login")
					.send(this.user)
					.end((err, res) => {
						expect(res).to.have.status(302);
						err ? done(err) : done();
					});
			});
		});

		// Logout
		describe("Log out de un usuario: ", () => {
			it("debería desloguearse un usuario", (done) => {
				request.get("/logout").end((err, res) => {
					expect(res).to.have.status(200);
					err ? done(err) : done();
				});
			});
		});
	}
};

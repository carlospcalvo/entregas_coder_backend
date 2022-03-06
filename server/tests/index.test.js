const ProductTests = require("./products.test");
const UserTests = require("./users.test");

const testsProductos = new ProductTests();
const testsUsuarios = new UserTests();

(() => {
	testsProductos.test();
	// testsUsuarios.test();
})();

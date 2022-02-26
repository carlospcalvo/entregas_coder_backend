const DAO = require("./DAO");
const Producto = require("../models/product");
let ProductDAOInstance = null;

class ProductDAO extends DAO {
	constructor() {
		super(Producto);
	}

	static getInstance() {
		if (!ProductDAOInstance) {
			ProductDAOInstance = new ProductDAO();
		}
		return ProductDAOInstance;
	}
}

module.exports = ProductDAO;

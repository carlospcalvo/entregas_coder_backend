import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { Product, ProductDocument } from "./schemas/products.schema";

@Injectable()
export class ProductsRepository {
	constructor(
		@InjectModel(Product.name) private productModel: Model<ProductDocument>
	) {}

	async findOne(productFilterQuery: FilterQuery<Product>): Promise<Product> {
		return this.productModel.findOne(productFilterQuery);
	}

	async find(productsFilterQuery: FilterQuery<Product>): Promise<Product[]> {
		return this.productModel.find(productsFilterQuery);
	}

	async create(product: Product): Promise<Product> {
		const newProduct = new this.productModel(product);
		return newProduct.save();
	}

	async findOneAndUpdate(
		productFilterQuery: FilterQuery<Product>,
		product: Partial<Product>
	): Promise<Product> {
		return this.productModel.findOneAndUpdate(productFilterQuery, product, {
			new: true,
		});
	}

	async findOneAndDelete(
		productFilterQuery: FilterQuery<Product>
	): Promise<Product> {
		return this.productModel.findOneAndDelete(productFilterQuery);
	}
}

import { Injectable } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { ProductsRepository } from "./product.repository";

@Injectable()
export class ProductsService {
	constructor(private readonly productsRepository: ProductsRepository) {}

	async create(newProduct: CreateProductDto) {
		return this.productsRepository.create(newProduct);
	}

	async findAll() {
		return this.productsRepository.find({});
	}

	async findOne(id: number) {
		return this.productsRepository.findOne({ id });
	}

	async update(id: number, updateProductDto: UpdateProductDto) {
		return this.productsRepository.findOneAndUpdate(
			{ id },
			updateProductDto
		);
	}

	async remove(id: number) {
		return this.productsRepository.findOneAndDelete({ id });
	}
}

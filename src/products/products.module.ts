import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { Product, ProductSchema } from "./schemas/products.schema";
import { ProductsRepository } from "./product.repository";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Product.name, schema: ProductSchema },
		]),
	],
	controllers: [ProductsController],
	providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
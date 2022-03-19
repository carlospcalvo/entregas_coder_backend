import { PartialType } from "@nestjs/mapped-types";

export class CreateProductDto {
	readonly id: number;
	readonly title: string;
	readonly price: number;
	readonly thumbnail: string;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}

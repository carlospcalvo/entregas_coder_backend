import { PartialType } from "@nestjs/mapped-types";

export class CreateUserDto {
	readonly username: string;
	readonly password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

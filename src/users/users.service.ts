import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/user.dto";
import { User } from "./../users/schemas/user.schema";
import { UsersRepository } from "./user.repository";

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}
	async create(newUser: CreateUserDto): Promise<User> {
		return this.usersRepository.create(newUser);
	}

	async findAll() {
		return this.usersRepository.find({});
	}

	async findOne(username: string): Promise<User | undefined> {
		return this.usersRepository.findOne({ username });
	}
}

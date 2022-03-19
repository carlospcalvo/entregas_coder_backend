import { CreateUserDto } from "./../users/dto/user.dto";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/schemas/user.schema";
import { compareSync, hashSync, genSaltSync } from "bcrypt";

@Injectable()
export class AuthService {
	logger = new Logger("AuthService");
	constructor(private usersService: UsersService) {}

	async validateUser(username: string, password: string): Promise<User> {
		const user = await this.usersService.findOne(username);

		if (!user) {
			this.logger.log(`El usuario ${username} no existe.`);
			throw new NotFoundException({
				message: `El usuario ${username} no existe.`,
			});
		}

		if (!this.validatePassword(user, password)) {
			this.logger.warn(
				`Contraseña incorrecta para el usuario ${username}.`
			);
			throw new UnauthorizedException({
				message: `Contraseña incorrecta`,
			});
		}

		return user;
	}

	async register(user: CreateUserDto) {
		const userExists = await this.usersService.findOne(user.username);

		if (userExists) {
			this.logger.log(`El usuario ${user.username} ya existe.`);
			throw new BadRequestException({
				message: `El usuario ${user.username} ya existe.`,
			});
		}

		const newUser = {
			username: user.username,
			password: hashSync(user.password, genSaltSync(10)) as string,
		};

		this.logger.debug(`User ${user.username} created!`);
		return this.usersService.create(newUser);
	}

	validatePassword(user, password) {
		return compareSync(password, user.password);
	}
}

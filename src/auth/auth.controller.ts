import { AuthService } from "./auth.service";
import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CreateUserDto } from "src/users/dto/user.dto";

@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}
	@UseGuards(AuthGuard("local"))
	@Post("login")
	async login(@Request() req) {
		return { user: req.user.username };
	}

	@Post("register")
	public async register(@Body() createUserDto: CreateUserDto) {
		const user = await this.authService.register(createUserDto);
		return {
			message: `El usuario "${user.username}" se creó correctamente`,
		};
	}
}

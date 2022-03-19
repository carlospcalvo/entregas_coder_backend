import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UsersModule } from "./../users/users.module";
import { LocalStrategy } from "./local.strategy";
import { AuthController } from "./auth.controller";

@Module({
	imports: [UsersModule, PassportModule.register({ session: true })],
	providers: [AuthService, LocalStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
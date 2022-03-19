import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductsModule } from "./products/products.module";
import { UsersModule } from "./users/users.module";
import { MessagesModule } from "./messages/messages.module";
import { Log4jsModule } from "nestjs-log4js";
import { config } from "./config/logger";
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ServeStaticModule.forRoot({ rootPath: `${process.cwd()}/public` }),
		Log4jsModule.forRoot(config),
		MongooseModule.forRoot(process.env.MONGO_URL),
		ProductsModule,
		UsersModule,
		MessagesModule,
		AuthModule,
	],
})
export class AppModule {}

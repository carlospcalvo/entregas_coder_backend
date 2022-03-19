import { NestFactory } from "@nestjs/core";
import * as session from "express-session";
// import MongoStore from "connect-mongo";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// console.log(MongoStore);
	app.use(
		session({
			// store: MongoStore.create({
			// 	mongoUrl: process.env.MONGO_URL,
			// 	/* mongoOptions: {
			// 		useNewUrlParser: true,
			// 		useUnifiedTopology: true,
			// 	}, */
			// }),
			secret: process.env.SESSION_SECRET || "secret",
			cookie: {
				maxAge: 300_000,
			},
			rolling: true,
			resave: true,
			saveUninitialized: false,
		})
	);
	await app.listen(process.env.PORT || 8080);
}
bootstrap();

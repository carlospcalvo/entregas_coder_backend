import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MessagesService } from "./messages.service";
import { MessagesGateway } from "./messages.gateway";
import { MessagesRepository } from "./messages.repository";
import { Message, MessageSchema } from "./schemas/messages.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Message.name, schema: MessageSchema },
		]),
	],
	providers: [MessagesGateway, MessagesService, MessagesRepository],
})
export class MessagesModule {}

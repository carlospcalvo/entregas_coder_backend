import { Message, MessageDocument } from "./schemas/messages.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";

@Injectable()
export class MessagesRepository {
	constructor(
		@InjectModel(Message.name) private messageModel: Model<MessageDocument>
	) {}

	async find(messagesFilterQuery: FilterQuery<Message>): Promise<Message[]> {
		return this.messageModel.find(messagesFilterQuery);
	}

	async create(message: Message): Promise<Message> {
		const newMessage = new this.messageModel(message);
		return newMessage.save();
	}
}

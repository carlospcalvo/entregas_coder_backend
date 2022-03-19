import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/message.dto";
import { MessagesRepository } from "./messages.repository";
import { Message } from "./schemas/messages.schema";
import { format } from "date-fns";

@Injectable()
export class MessagesService {
	constructor(private readonly messagesRepository: MessagesRepository) {}

	async create(newMessage: CreateMessageDto): Promise<Message> {
		const now = Date.now();

		const data = {
			...newMessage,
			date: format(now, "dd/MM/yyyy HH:mm:ss"),
			timestamp: now,
		};

		return this.messagesRepository.create(data);
	}

	async findAll() {
		return this.messagesRepository.find({});
	}
}

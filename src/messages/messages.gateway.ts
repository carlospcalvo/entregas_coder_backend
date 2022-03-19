import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketServer,
	MessageBody,
	ConnectedSocket,
} from "@nestjs/websockets";
import { Inject, Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { MessagesService } from "./messages.service";
import { Message } from "./schemas/messages.schema";
import { CreateMessageDto } from "./dto/message.dto";

@WebSocketGateway(/* 4000, { namespace: "message" } */)
export class MessagesGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	@Inject()
	messageService: MessagesService;

	@WebSocketServer()
	wss: Server;

	private logger = new Logger("MessageGateway");

	private count = 0;

	async handleDisconnect(): Promise<void> {
		this.count -= 1;
		this.logger.log(`Disconnected: ${this.count} connections`);
	}

	async handleConnection(client: any): Promise<void> {
		this.count += 1;
		this.logger.log(`Connected: ${this.count} connections`);
		const messages: Message[] = await this.messageService.findAll();
		client.emit("all-messages-to-client", messages);
	}

	async afterInit(): Promise<void> {
		this.logger.log("MessageGateway Initialized");
	}

	@SubscribeMessage("new-message-to-server")
	async handleNewMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: CreateMessageDto
	): Promise<void> {
		await this.messageService.create(data);
		const messages = await this.messageService.findAll();
		this.wss.emit("new-message-to-client", messages);
	}
}

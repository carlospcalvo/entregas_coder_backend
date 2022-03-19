import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Author } from "src/interfaces/author/author.interface";

export type MessageDocument = Message & Document;

@Schema()
export class Message {
	@Prop(
		raw({
			email: { type: String, required: true, max: 100, sparse: true },
			nombre: { type: String, required: true, max: 100 },
			apellido: { type: String, required: true, max: 100 },
			edad: { type: Number, required: true, min: 10, max: 100 },
			alias: { type: String, required: true, max: 50 },
			avatar: { type: String, default: "", max: 200 },
		})
	)
	author: Author;

	@Prop()
	text: string;

	@Prop()
	date: string;

	@Prop()
	timestamp: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

import { Author } from "src/interfaces/author/author.interface";

export class CreateMessageDto {
	readonly author: Author;
	readonly text: string;
}

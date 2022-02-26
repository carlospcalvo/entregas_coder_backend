const MessageDAO = require("../DAOs/message");
const MessageDTO = require("../DTOs/message");

module.exports = class MessageRepo {
	constructor() {
		this.dao = MessageDAO.getInstance();
	}

	async getAll() {
		const dtos = await this.dao.getAll();
		return dtos.map((dto) => ({
			author: dto.author,
			text: dto.text,
			date: dto.date,
			timestamp: dto.timestamp,
		}));
	}

	async save(message) {
		const dto = new MessageDTO(message);
		return this.dao.save(dto);
	}
};

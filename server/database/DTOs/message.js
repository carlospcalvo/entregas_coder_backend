module.exports = class MessageDTO {
	constructor(message) {
		this.author = message.author;
		this.text = message.text;
		this.date = message.date;
		this.timestamp = message.timestamp;
	}
};

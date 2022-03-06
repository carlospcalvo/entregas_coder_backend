const { normalize, denormalize, schema } = require("normalizr");

const schemaAuthor = new schema.Entity(
	"authors",
	{},
	{
		idAttribute: "email",
	}
);

const schemaMessage = new schema.Entity(
	"messages",
	{ author: schemaAuthor },
	{ idAttribute: "timestamp" }
);

const messagesSchema = [schemaMessage];

module.exports = {
	normalizeMessages: (messages) => {
		return normalize(messages, messagesSchema);
	},
	denormalizeMessages: (messages) => denormalize(messages, messagesSchema),
};

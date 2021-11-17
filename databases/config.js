module.exports = {
	mysql: {
		client: "mysql",
		connection: {
			host: "127.0.0.1",
			user: "root",
			password: "password",
			database: "coderhouse",
		},
		pool: { min: 0, max: 7 },
	},
	sqlite: {
		client: "sqlite3",
		connection: { filename: "./databases/messages.sqlite" },
		useNullAsDefault: true,
	},
};

export const config = {
	appenders: {
		console: { type: "console" },
		warnings: { type: "file", filename: "logs/warn.log" },
		errors: { type: "file", filename: "logs/error.log" },
		"just-errors": {
			type: "logLevelFilter",
			appender: "errors",
			level: "error",
		},
		"just-warnings": {
			type: "logLevelFilter",
			appender: "warnings",
			level: "warn",
			maxLevel: "warn",
		},
	},
	categories: {
		default: {
			appenders: ["console", "just-warnings", "just-errors"],
			level: "trace",
		},
	},
};

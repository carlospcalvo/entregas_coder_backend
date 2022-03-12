const log4js = require("log4js");

// Log4js config
log4js.configure({
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
});

module.exports = log4js.getLogger("console");

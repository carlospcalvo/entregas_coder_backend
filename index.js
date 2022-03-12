const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const session = require("express-session");
const passport = require("passport");
const mongoStore = require("connect-mongo");
const parseArgs = require("minimist");
const logger = require("./logger");
const configEngine = require("./engine.config");
const MongoConnection = require("./database/connection");
const { socketController } = require("./controllers/socket.controller");
const schema = require("./graphql/schema.js");
const { buildContext } = require("graphql-passport");
require("dotenv").config();

// Mongo
MongoConnection.getInstance();

// Initial config
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = parseArgs(process.argv.slice(2)).PORT || 8080;

// Passport & session
app.use(
	session({
		store: mongoStore.create({
			mongoUrl: process.env.MONGO_URL,
			mongoOptions: {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
		}),
		secret: "passport_auth",
		cookie: {
			maxAge: 300_000,
		},
		rolling: true,
		resave: true,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
	logger.info(`Incoming request: [${req.method}] ${req.originalUrl}`);
	next();
});

// Routes
app.use(
	"/graphql",
	graphqlHTTP((req, res) => ({
		schema,
		graphiql: true,
		context: buildContext({ req, res }),
	}))
);

// Server startup
httpServer
	.listen(PORT, async () => {
		await configEngine(app);
		logger.info(
			`[FORK MODE] Child process (PID ${process.pid}) - Server running on port ${PORT}!`
		);
	})
	.on("error", (error) =>
		logger.error(
			`[ERROR] - [FORK MODE] Child process (PID ${process.pid})`,
			error.message
		)
	);

// Sockets
io.on("connection", socketController);

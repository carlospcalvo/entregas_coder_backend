const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
require("dotenv").config();

passport.use(
	"jwt",
	new JWTStrategy(
		{
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
		},
		async (token, done) => {
			try {
				const user = await User.findOne({
					email: token.user.email,
				}).lean();

				if (!user) {
					return done(null, false);
				}

				return done(null, token.user);
			} catch (error) {
				return done(error, false);
			}
		}
	)
);

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => User.findById(id, done));

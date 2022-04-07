const passport = require("passport");

const verifyToken = passport.authenticate("jwt", {
	session: false,
});

const verifyPrivileges = (req, res, next) =>
	req.user?.role === "admin"
		? next()
		: res.status(403).json({
				message: `Solo usuarios con rol 'admin' pueden usar este endpoint`,
		  });

module.exports = {
	verifyToken,
	verifyPrivileges,
};

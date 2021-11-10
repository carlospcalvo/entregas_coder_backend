const admin = true;

const isAdmin = (req, res, next) => {
	admin
		? next()
		: res.status(403).json({
				error: -1,
				message: `Route ${req.originalUrl} method ${req.method} not authorized.`,
		  });
};

module.exports = isAdmin;

export const adminMiddleware = async (req, res, next) => {
	try {
		if (req.user.role != "admin") {
			throw new Error("You are not admin");
		}
		next();
	} catch (error) {
		res.send(error);
	}
};
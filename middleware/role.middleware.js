export const roleGuard = (...roles) => {
	return async (req, res, next) => {
		try {
			const userRoles = req.user.role;

			console.log("userRoles", userRoles);
			console.log("permission role", roles);

			console.log(roles.includes(userRoles));

			if (!roles.includes(userRoles)) {
				return res.send("Your roles are not allowed to access this route");
			}
			next();
		} catch (error) {
			res.send(error);
		}
	};
};
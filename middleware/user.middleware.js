import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
export const userMiddleware = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			res.status(403).send("wrong authorization type");
			return;
		}

		const [type, token] = req.headers.authorization.split(" ");
		if (type !== "Bearer") {
			res.status(403).send("wrong authorization type");
			return;
		}

		const decode = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);

		const user = await User.findById(decode.sub);

		if (!user) {
			throw new Error("User not found");
		}

		req.user = user;

		next();
	} catch (error) {
		res.send(error);
	}
};
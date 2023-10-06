const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.body.userId = decoded.userId;
		next();
	} catch (error) {
		res.send({ message: error.message, success: false });
	}
};
// const jwt = require("jsonwebtoken");
// module.exports = (req, res, next) => {
// 	const authHeader = req.headers.authorization;
// 	console.log(req.headers.authorization);
// 	if (!authHeader) {
// 		res.status(404).json({
// 			status: "fail",
// 			message: "Unauthorized!",
// 		});
// 	}
// 	const token = authHeader.split(" ")[1];
// 	try {
// 		const user = jwt.verify(token, "JWT_SECRET");
// 		req.user = user;
// 		next();
// 	} catch (error) {
// 		res.status(403).json({
// 			status: "fail",
// 			message: "Unauthorized!",
// 		});
// 	}
// };

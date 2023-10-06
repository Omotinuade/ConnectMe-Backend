const User = require("../models/userModels");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			return res.send({
				success: false,
				message: "User already exists",
			});
		}
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		req.body.password = hashedPassword;
		const newUser = await User.create(req.body);
		await newUser.save();
		return res.send({
			success: true,
			message: "User created",
		});
	} catch (err) {
		return res.send({
			message: err.message,
			success: false,
		});
	}
});

router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.send({
				message: "User does not exist",
				success: false,
			});
		}
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword) {
			return res.send({
				message: "Invalid password",
				success: false,
			});
		}
		const token = jwt.sign(
			{ userId: user._id, firstName: user.name },
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			}
		);
		return res.send({
			message: "Login successful",
			success: true,
			data: token,
		});
	} catch (err) {
		return res.send({
			message: err.message,
			success: false,
		});
	}
});

router.get("/get-current-user", async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.body.userId = decoded.userId;
	} catch (error) {
		return res.send({ message: error.message, success: false });
	}
	try {
		const user = await User.findOne({ _id: req.body.userId });
		return res.send({
			success: true,
			message: "User fetched successfully",
			data: user,
		});
	} catch (error) {
		return res.send({
			message: error.message,
			success: false,
		});
	}
});
router.get("/get-all-users", async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.body.userId = decoded.userId;
	} catch (error) {
		return res.send({ message: error.message, success: false });
	}
	try {
		const allUsers = await User.find({ _id: { $ne: req.body.userId } });
		return res.send({
			success: true,
			message: "Users fetched successfully",
			data: allUsers,
		});
	} catch (error) {
		return res.send({
			success: false,
			message: error.message,
		});
	}
});
module.exports = router;

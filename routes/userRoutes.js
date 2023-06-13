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
		res.send({
			success: true,
			message: "User created",
		});
	} catch (err) {
		res.send({
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
		res.send({
			message: "Login successful",
			success: true,
			data: token,
		});
	} catch (err) {
		res.send({
			message: err.message,
			success: false,
		});
	}
});

router.get("/get-current-user", authMiddleware, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.body.userId });
		res.send({
			success: true,
			message: "User fetched successfully",
			data: user,
		});
	} catch (error) {
		res.send({
			message: error.message,
			success: false,
		});
	}
});

module.exports = router;

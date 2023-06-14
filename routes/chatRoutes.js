const Chat = require("../models/chatModels");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-new-chat", async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.body.userId = decoded.userId;
	} catch (error) {
		return res.send({ message: error.message, success: false });
	}
	try {
		const newChat = new Chat();
		newChat.members = req.body;
		const savedChat = await newChat.save();
		return res.send({
			success: true,
			message: "Chat created successfully",
			data: savedChat,
		});
	} catch (error) {
		return res.send({
			message: "Error creating chat",
			error: error.message,
			success: false,
		});
	}
});

router.get("/get-all-chats", async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.body.userId = decoded.userId;
	} catch (error) {
		return res.send({ message: error.message, success: false });
	}
	try {
		const chats = await Chat.find({
			members: {
				$in: [req.body.userId],
			},
		});
		return res.send({
			success: true,
			message: "Chats fetched successfully",
			data: chats,
		});
	} catch (error) {
		return res.send({
			message: "Error fetching chats",
			error: error.message,
			success: false,
		});
	}
});
module.exports = router;

const Chat = require("../models/chatModels");
const Message = require("../models/messageModels");
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
		const newChat = new Chat({ members: req.body });
		const savedChat = await newChat.save();
		await savedChat.populate("members");
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
		})
			.populate("members")
			.populate("lastMessage")
			.sort({ updatedAt: -1 });
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

router.post("/clear-unread-messages", async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.body.userId = decoded.userId;
	} catch (error) {
		return res.send({ message: error.message, success: false });
	}
	try {
		const chat = await Chat.findById(req.body.chat);
		if (!chat) {
			return res.send({ message: "Chat not found", success: false });
		}
		const updatedChat = await Chat.findByIdAndUpdate(
			req.body.chat,
			{ unreadMessages: 0 },
			{ new: true }
		)
			.populate("members")
			.populate("lastMessage");
		await Message.updateMany(
			{ chat: req.body.chat, read: false },
			{ read: true }
		);
		return res.send({
			message: "Unread messages cleared successfully",
			success: true,
			data: updatedChat,
		});
	} catch (error) {
		return res.send({
			message: "Error clearing unread messages",
			success: false,
			error: error.message,
		});
	}
});
module.exports = router;

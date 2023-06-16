const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Chat = require("../models/chatModels");
const Message = require("../models/messageModels");

router.post("/new-message", async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.body.userId = decoded.userId;
	} catch (error) {
		return res.send({ message: error.message, success: false });
	}
	try {
		const newMessage = new Message({
			chat: req.body.chat,
			sender: req.body.sender,
			text: req.body.text,
		});
		const savedMessage = await newMessage.save();

		await Chat.findOneAndUpdate(
			{ _id: req.body.chat },
			{ lastMessage: savedMessage._id, $inc: { unreadMessages: 1 } }
		);
		return res.send({
			success: true,
			message: "Message sent successfully",
			data: savedMessage,
		});
	} catch (error) {
		return res.send({
			success: false,
			message: "Error sending message",
			error: error.message,
		});
	}
});
router.get("/get-all-messages/:chatId", async (req, res) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.body.userId = decoded.userId;
	} catch (error) {
		return res.send({ message: error.message, success: false });
	}
	try {
		const messages = await Message.find({ chat: req.params.chatId }).sort({
			createdAt: 1,
		});

		return res.send({
			success: true,
			messages: "Messages fetched successfully",
			data: messages,
		});
	} catch (error) {
		return res.send({
			success: false,
			messages: "Error fetching Messages",
			error: error.message,
		});
	}
});

module.exports = router;

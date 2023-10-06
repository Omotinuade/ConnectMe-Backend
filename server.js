const express = require("express");
require("dotenv").config();
const app = express();
const dbConfig = require("./config/dbconfig");
const port = process.env.PORT || 3001;
const usersRoute = require("./routes/userRoutes");
const chatsRoute = require("./routes/chatRoutes");
const messagesRoute = require("./routes/messageRoutes");
app.use(express.json());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	socket.on("join-room", (userId) => {
		socket.join(userId);

		socket.on("send-message", (data) => {
			io.to(data.members[0]).to(data.members[1]).emit("receive-message", data);
		});
	});
});
app.use("/api/users", usersRoute);
app.use("/api/chats", chatsRoute);
app.use("/api/messages", messagesRoute);
app.use("api/test", (req, res) => {
	return res.status(200).json({
		message: "Connectify Successfully running on EC2",
	});
});
server.listen(port, () => console.log(`server okay running on port ${port}`));

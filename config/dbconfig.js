const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;

db.on("connected", () => {
	console.log("Connected to MongoDB successfully");
});
db.on("error", (err) => {
	console.log("Error connecting to MongoDB");
});

module.exports = db;

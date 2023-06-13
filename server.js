const express = require("express");
require("dotenv").config();
const app = express();
const dbConfig = require("./config/dbconfig");
const port = process.env.PORT || 3001;
const usersRoute = require("./routes/userRoutes");

app.use(express.json());

app.use("/api/users", usersRoute);
app.listen(port, () => console.log(`server okay running on port ${port}`));

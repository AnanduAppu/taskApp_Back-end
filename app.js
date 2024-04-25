const express = require("express");
const app = express();
const cookies = require("cookie-parser")
const cors = require("cors")

app.use(express.json())

app.use(cookies());


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


//user area 
const UserAuth = require("./Routes/AuthRoute");
app.use("/user",UserAuth)

//task area 
const UserTask = require("./Routes/TaskRoute");
app.use("/user",UserTask)



module.exports = app;
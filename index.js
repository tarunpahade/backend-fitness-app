const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');

// Enable All CORS Requests
;
//Notification xV790J89vD46plywun_cf4-vpi8ghi7Q04gv-QuQ
const transactionRouter = require("./src/router/transactionRouter");
const taskRouter = require("./src/router/tasksRouter");
const studentRouter = require("./src/router/studentFund");
const parentRouter = require("./src/router/parentFund");
const loginRouter = require("./src/router/login");
const notificationsRouter = require("./src/router/notification");

const server = require("http").createServer(app);
const io = require("socket.io")(server);
require("dotenv").config();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use(cors())
io.on("connection", (socket) => {
  socket.on("newTask", (orderData) => {
    io.emit("newTask", orderData);
  });

  socket.on("TaskSentForApproval", (orderData) => {
    console.log("theb task sent for approval", orderData);
    io.emit("TaskSentForApproval", orderData);
  });
  socket.on("ApproveTask", (orderData) => {
    io.emit("ApproveTask", orderData);
  });
  socket.on("RemindTask", (orderData) => {
    io.emit("RemindTask", orderData);
  });

  socket.on("New Child", (orderData) => {
    io.emit("New Child", orderData);
  });

  socket.on("RequestedForMoney", (orderData) => {
    console.log(orderData);
    io.emit("RequestedForMoney", orderData);
  });
});

const PORT = 3000 || process.env.PORT;

const IP_ADDRESS = "192.168.106.253";
app.use("/transactions", transactionRouter);
app.use("/tasks", taskRouter);
app.use("/studentFund", studentRouter);
app.use("/parentFund", parentRouter);
app.use("/login", loginRouter);
app.use("/notification", notificationsRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});


app.get("/hii", (req, res) => {
  res.send("Hello World");
});
//new port

server.listen(PORT, () => {
  console.log("Server is running on port 3000");
});

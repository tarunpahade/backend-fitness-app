const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const {getDataFromCollection}=require('./src/database/db')

const workoutRouter = require("./src/router/workoutRouter");
const authRouter= require("./src/router/login");

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

const PORT = 3000 || process.env.PORT;

 app.use("/workout", workoutRouter);
 app.use("/login", authRouter);

 app.get("/hii", (req, res) => {
  res.send({status:200,data:'Hii'})

})

app.get("/", async(req, res) => {
const data=await  getDataFromCollection('back')
res.send({status:200,data:data})
});
const IP_ADDRESS ='192.168.183.253'

app.listen(PORT, () => {
  console.log(`Server is running on :${PORT}`);
});
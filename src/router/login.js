const express = require("express");
const router = express.Router();

const { findUser, insertDocument, addChild } = require("../database/db");
const { loginUser } = require("../database/db");
const sid = "ACbf2608b126a238d429463d915859023d";
const auth_token = "4335230463b820cc6d7b6fcbf50237fd";
var twilio = require("twilio")(sid, auth_token);

router.get("/:studentId", async (req, res) => {
  const user = req.params.studentId;
  console.log(user,'this is');
  const pro = await findUser(user);
  console.log(pro);
  res.send({ status: "Ok", data: pro });
});

router.post("/", async (req, res) => {
  const { name, password } = req.body;
  
  console.log(req.body);

  const product = await loginUser(req.body);
  if (!product) {
    res.status(404).send({ status: "Failed", data: "User not found" });
    return;
  }
  try {
    res.send({ status: "Ok", data: product });
  } catch (error) {
    res.status(401).send({ status: "Failed", data: error.message });
  }
});



router.post("/addChild", async (req, res) => {
  // const { name, password } = req.body;
  
  console.log(req.body);
  const child=req.body
 
   const product = await addChild(child)
  if (!product) {
    res.status(404).send({ status: "Failed", data: "User not found" });
    return;
  }
  try {
    res.send({ status: "Ok", data: product });
  } catch (error) {
    res.status(401).send({ status: "Failed", data: error.message });
  }
});


router.post("/sendOtp", async (req, res) => {
  console.log("hiii");
  const {otp,to} = req.body;
  
    const message =await twilio.messages
      .create({
        from: "+12565738101",
        to: to,
        body: `this is testing otp is ${otp}`,
      })
      .then(function (res) {
        console.log("message has sent!");
      })
      .catch(function (err) {
        console.log(err.message);
      });
    res.send({ message });
  
});


router.post("/new-account", async (req, res) => {
  
  const child=req.body
 
   const product = await insertDocument('Login',child)
  if (!product) {
    res.status(404).send({ status: "Failed", data: "User not found" });
    return;
  }
  try {
    res.send({ status: "Ok", data: product });
  } catch (error) {
    res.status(401).send({ status: "Failed", data: error.message });
  }
});

module.exports = router;

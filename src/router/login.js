const express = require("express");
const router = express.Router();

const { findUser, insertDocument, addChild } = require("../database/db");
const { loginUser } = require("../database/db");

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

module.exports = router;

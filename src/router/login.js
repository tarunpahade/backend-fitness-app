const express = require("express");
const router = express.Router();

const { findUser } = require("../database/db");
const { loginUser } = require("../database/db");

router.get("/:studentId", async (req, res) => {
  const user = req.params.studentId;
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

module.exports = router;

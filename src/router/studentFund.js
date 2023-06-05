const express = require("express");
const router = express.Router();
const { getAllstudentFund } = require("../database/studentFund");
const { insertDocument } = require("../database/db");

router.get("/:studentId", async (req, res) => {
  const pro = await getAllstudentFund(req.params.studentId);

  res.send({ status: "Ok", data: pro });
});

router.post("/", async (req, res) => {
  console.log(req.body);

  const fund = req.body;
  const studentFund = await insertDocument("studentFund", fund);

  res.status(201).send({ status: "Ok", data: studentFund });
});
module.exports = router;

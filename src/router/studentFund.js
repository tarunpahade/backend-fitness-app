const express = require("express");
const router = express.Router();
const { getAllstudentFund } = require("../database/studentFund");
const { insertDocument, addMoneyToThePot } = require("../database/db");

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


router.post("/moneyAddedToPot", async (req, res) => {
  console.log(req.body);
 const result=await addMoneyToThePot(req.body)
  console.log(result,'this is result');
if(result === 'Insufficient Balance'){
 
  res.status(402).send({ status: "error", data: "error" });
}else {
  res.status(201).send({ status: "Ok", data: result });

}
});





module.exports = router;

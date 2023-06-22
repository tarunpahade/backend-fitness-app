const express = require("express");
const router = express.Router();
const { getAlltask, uploadImage } = require("../database/tasks");
const { createTask } = require("../database/tasks");

const { taskApproval }=require('../database/tasks');
const { addNewFieldToCollection, sendMoneyandRemoveTask,sendMoneyAndAddTransaction } = require("../database/db");
router.get("/:studentId", async (req, res) => {
  const pro = await getAlltask(req.params.studentId);

  res.send({ status: "Ok", data: pro });
});

router.post("/", async (req, res) => {
  
  const newTask = JSON.stringify(req.body);

  
  const task = await createTask(JSON.parse(newTask))
  res.status(201).send({ status: "Ok", data: task });
});

router.post("/image", async (req, res) => {
  
  const img= req.body.imageUri
  console.log(req.body);
  const task=  await   uploadImage(img,req.body.id) 
//console.log(task);

console.log(task);

  res.status(201).send({ status: "Ok", data: task });

});
//tasks/approved

router.post("/approved", async (req, res) => {
  
  console.log(req.body,req.body.id,req.body.studentId);
 
const result=taskApproval(req.body.id,req.body.studentId)
if(!result){
  console.log('THis is error');
  res.status(201).send({ status: "401", data: 'there is a err' });

}

  res.status(201).send({ status: "Ok", data: result });

});

//the parent sends money to the choosen student amount is the task amount
router.post("/sendMoney", async (req, res) => {
  console.log(req.body);
const result=await sendMoneyandRemoveTask(req.body)

if(!result){
  console.log('THis is error');
  res.status(201).send({ status: "401", data: 'there is a err' });

}else if(result==='Zero Balance'){
  res.status(201).send({ status: "Zero Balance", data: 'there is a err' });
} else{
  res.status(201).send({ status: "Ok", data: result });

}
});

module.exports = router;

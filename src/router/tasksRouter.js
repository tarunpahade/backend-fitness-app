
const express = require("express");
const router = express.Router();
const { getAlltask, uploadImage } = require("../database/tasks");
const { createTask } = require("../database/tasks");

const { taskApproval }=require('../database/tasks');
const {  sendMoneyandRemoveTask, insertDocument, redoTask } = require("../database/db");
router.get("/:studentId", async (req, res) => {
  const pro = await getAlltask(req.params.studentId);

  res.send({ status: "Ok", data: pro });
});
router.post("/redoTask", async (req, res) => {
  const pro = await redoTask(req.body.id);
console.log(pro,'yhis si');
  res.send({ status: "Ok", data: pro });
});

router.post("/", async (req, res) => {
  
  const newTask = JSON.stringify(req.body);

  
  const task = await createTask(JSON.parse(newTask))
  res.status(201).send({ status: "Ok", data: task });
});

router.post("/image", async (req, res) => {
  
  console.log(req.body,'this is body');
const {parentId,amount,childName,name,imageUri,_id} =req.body

console.log(req.imageUri);
  const notifications = {
    userId: JSON.parse(parentId),
    amount: amount,
    childName: childName,
    name: name,
    type: "task sent for approval",
  };
  const inserrtNotification = await insertDocument(
    "Notifications",
    notifications
  );
  console.log(inserrtNotification, "this is inserrtNotification");

  const task=  await   uploadImage(imageUri,_id) 

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

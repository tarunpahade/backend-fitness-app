const express = require("express");
const router = express.Router();
const { getAlltask, uploadImage } = require("../database/tasks");
const { createTask } = require("../database/tasks");

const { taskApproval }=require('../database/tasks');
const { addNewFieldToCollection } = require("../database/db");
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
  
  const task=  await   uploadImage(img,req.body.id) 
//console.log(task);

console.log(task);

  res.status(201).send({ status: "Ok", data: task });

});
//tasks/approved

router.post("/approved", async (req, res) => {
  console.log(req.body)
  const newTask = JSON.stringify(req.body.id);
  console.log(newTask);
  //console.log(img);
const result=taskApproval(JSON.parse(newTask))
if(!result){
  console.log('THis is error');
  res.status(201).send({ status: "401", data: 'there is a err' });

}

  res.status(201).send({ status: "Ok", data: result });

});

module.exports = router;

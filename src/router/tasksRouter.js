const express = require("express");
const router = express.Router();
const { getAlltask, uploadImage } = require("../database/tasks");
const { createTask } = require("../database/tasks");
const { compressImage }= require("../service/imageCompresser")
const { taskApproval }=require('../database/tasks')
router.get("/:studentId", async (req, res) => {
  const pro = await getAlltask(req.params.studentId);

  res.send({ status: "Ok", data: pro });
});

router.post("/", async (req, res) => {
  
  const newTask = JSON.stringify(req.body);

  
  const task = await createTask(JSON.parse(newTask));
console.log(task);
  res.status(201).send({ status: "Ok", data: task });
});

router.post("/image", async (req, res) => {
  
  const img= req.body.imageUri
const imglength=img.length
console.log(imglength);
await compressImage(img,req.body.id)
if(!compressImage){
  console.log('THis is error');
}else{
  console.log('Saved');
}


  res.status(201).send({ status: "Ok", data: 'yoooo' });

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
}

  res.status(201).send({ status: "Ok", data: 'Approved' });

});

module.exports = router;

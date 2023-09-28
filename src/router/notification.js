const express = require("express");
const router = express.Router();
const { sendNotification }=require('../service/expoNotificatin');
const { insertDocument, deleteDocumentById, findDocumentsByFieldValue } = require("../database/db");

//ExponentPushToken[FsxtdCBg4UphosxhU3d1FM]
// ExponentPushToken[tHOMfOAkBN-k20C22Qizya]
const userPushToken = 'ExponentPushToken[LYPsIUJe-AiK2gQ3Wo2PYs]'; // Replace with the actual Expo Push Token of the user
const title = 'New Notification';
const body = 'This is a notification sent to a specific user.';
const data = { anyData: 'optional' };

router.post("/storeNotifications",async(req,res)=>{
const notification =req.body
console.log('notification',notification);
const response = await insertDocument("Notifications",notification );

res.status(201).send({ status: "Ok", data: response });
})
router.delete("/deleteNotification",async(req,res)=>{
  const notificationId=req.body.id
  console.log(notificationId,'LOL');         

const response = await deleteDocumentById("Notifications",notificationId);
console.log(response);
  res.status(201).send({ status: "Ok", data: response });
    
})

router.get("/storedNotifcations/:userId",async(req,res)=>{
   
   const userId=parseFloat(req.params.userId)

  const pro = await findDocumentsByFieldValue("Notifications","userId",userId );

 
res.status(201).send({ status: "Ok", data: pro });
})

router.post("/", async (req, res) => {
  console.log(req.body);
//sendNotification(req.body.token,req.body.title,req.body.body,req.body.data)

sendNotification(userPushToken, title, body, data);
  
  res.status(201).send({ status: "Ok", data: 'Sent Notification' });
});
module.exports = router;

const express = require("express");
const router = express.Router();
const { sendNotification }=require('../service/expoNotificatin')

//ExponentPushToken[FsxtdCBg4UphosxhU3d1FM]
// ExponentPushToken[tHOMfOAkBN-k20C22Qizya]
const userPushToken = 'ExponentPushToken[LYPsIUJe-AiK2gQ3Wo2PYs]'; // Replace with the actual Expo Push Token of the user
const title = 'New Notification';
const body = 'This is a notification sent to a specific user.';
const data = { anyData: 'optional' };


router.post("/", async (req, res) => {
  console.log(req.body);
//sendNotification(req.body.token,req.body.title,req.body.body,req.body.data)

sendNotification(userPushToken, title, body, data);
  
  res.status(201).send({ status: "Ok", data: 'Sent Notification' });
});
module.exports = router;

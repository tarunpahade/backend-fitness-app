const { Expo } = require('expo-server-sdk');

async function sendNotification(userPushToken, title, body, data = {}) {
  // Create a new Expo SDK client
  const expo = new Expo();

  // Prepare the push notification data
  const notification = {
    to: userPushToken,
    title,
    body,
    data,
  };

  // Send the notification
  try {
    const ticketReceipts = await expo.sendPushNotificationsAsync([notification]);
    console.log('Notification sent successfully!');
    // Process the ticketReceipts if needed
  } catch (error) {
    console.error('Error sending notification:', error);
    // Handle the error
  }
}
module.exports={
    sendNotification
}
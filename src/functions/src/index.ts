import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const subscribeToTopic = functions.https.onCall(
  async (data, context) => {
    await admin.messaging().subscribeToTopic(data.token, data.topic);
 
    return `subscribed to ${data.topic}`;
  }
);

export const unsubscribeFromTopic = functions.https.onCall(
  async (data, context) => {
    await admin.messaging().unsubscribeFromTopic(data.token, data.topic);

    return `unsubscribed to ${data.topic}`;
  }
);

export const sendOnFirestoreCreate = functions.firestore
  .document("Log/{logId}")
  .onCreate(async (snapShot) => {
    const log = snapShot.data();
    const notification: admin.messaging.Notification = {
      title: "New User Sign In",
      body: log.headline,
    };

    const payload: admin.messaging.Message = {
      notification,
      webpush: {
        notification: {
          vibrate: [200, 100, 200],
          icon:
            "https://cdn.icon-icons.com/icons2/691/PNG/512/google_firebase_icon-icons.com_61474.png",
          actions: [
            {
              action: "like",
              title: "👍",
            },
            {
              action: "dislike",
              title: "👎",
            },
          ],
        },
      },
      topic: "log",
    };
    return admin.messaging().send(payload);
  });

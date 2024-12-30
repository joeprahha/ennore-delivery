// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0nFmkjxpHf6GLNNDDMuqBTNdT4P6dNEc",
  authDomain: "e-del-push-notification.firebaseapp.com",
  projectId: "e-del-push-notification",
  storageBucket: "e-del-push-notification.firebasestorage.app",
  messagingSenderId: "261371669095",
  appId: "1:261371669095:web:df01218e95306811e202c2"
};

const vapidKey =
  "BBLz6yZGZEXAIhHwTU6YJpxyJWzFOMyWU5_sfuZjWVImQ9rBzWHS9wqZCWNhKlbfAKbn6fJt_z0kahubTUyf6vc";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  try {
    // Request notification permission from the user
    const permission = await Notification.requestPermission();

    // If permission is granted, get the FCM token
    if (permission === "granted") {
      const token = await getToken(messaging, { vapidKey });
      return token;
    } else {
      throw new Error("Notification permission not granted");
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
  }
};

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0nFmkjxpHf6GLNNDDMuqBTNdT4P6dNEc",
  authDomain: "e-del-push-notification.firebaseapp.com",
  projectId: "e-del-push-notification",
  storageBucket: "e-del-push-notification.firebasestorage.app",
  messagingSenderId: "261371669095",
  appId: "1:261371669095:web:df01218e95306811e202c2"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const { title, body, icon, sound } = payload.notification;

  // Show the notification with icon and sound

  if (sound) {
    const audio = new Audio(sound);
    audio.play().catch((error) => {
      console.error("Error playing notification sound:", error);
    });
  }
  self.registration.showNotification(title, {
    body,
    icon: "https://res.cloudinary.com/dq6e1ggmv/image/upload/v1735579876/jtbzy1ax6vcsz7ez89qb.jpg?v=1",
    sound: "/new_order_to_store.mpeg",
    vibrate: [200, 100, 200],
    renotify: true
  });
});

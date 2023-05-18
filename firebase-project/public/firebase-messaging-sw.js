importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in your app's Firebase config object.
firebase.initializeApp({
    apiKey: "AIzaSyCwQbmVRccRvwEQP5dILx7G_ssfHsiWeZc",
    authDomain: "vue3-firebase-82938.firebaseapp.com",
    projectId: "vue3-firebase-82938",
    storageBucket: "vue3-firebase-82938.appspot.com",
    messagingSenderId: "837117170477",
    appId: "1:837117170477:web:acf7ed6d8c7b15640079a4",
    measurementId: "G-T4GWXW3JK5",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-project/public/emoji.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

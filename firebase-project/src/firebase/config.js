import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCwQbmVRccRvwEQP5dILx7G_ssfHsiWeZc",
  authDomain: "vue3-firebase-82938.firebaseapp.com",
  projectId: "vue3-firebase-82938",
  storageBucket: "vue3-firebase-82938.appspot.com",
  messagingSenderId: "837117170477",
  appId: "1:837117170477:web:acf7ed6d8c7b15640079a4",
  measurementId: "G-T4GWXW3JK5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase messaging
const messaging = getMessaging(app);

// Handle received messages
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  // Handle the received message
});

// Get registration token
getToken(messaging, {
  vapidKey:
    "BAKy-Z4yPheHlAZB3rAlLgtniglTwa7v51_bJhqfYI8RQ92mnH1rwZ-vOAzinfe_qEh7HSvJTqSwPqbq75gOaaU",
})
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      console.log("Token:", currentToken);
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token:", err);
  });

// Initialize Firebase auth
const auth = getAuth();

export { auth };

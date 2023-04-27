import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
initializeApp(firebaseConfig);

//init firebase auth
const auth = getAuth();

export { auth };

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import firebase from "firebase";
import store from './store'
import "../src/style.css";

// var firebaseConfig = {
//     apiKey: "",
//     authDomain: "",
//     projectId: "",
//     storageBucket: "",
//     messagingSenderId: "",
//     appId: "",
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);

createApp(App).use(store).use(router).mount('#app')

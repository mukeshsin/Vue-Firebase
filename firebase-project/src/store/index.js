import { createStore } from "vuex";
import { auth } from "../firebase/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

export default createStore({
  state: {
    user: null,
    posts: [],
    signupError: null,
    signErr: null,
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      console.log("user state changed:", state.user);
    },
    setPosts(state, payload) {
      state.posts = payload;
      console.log("post state changed:", state.posts);
    },
  },
  actions: {
    //for signUp form
    async signup(
      { commit },
      {
        email,
        password,
        firstName,
        lastName,
        mobileNumber,
        confirmPassword,
        profilePhoto,
      }
    ) {
      try {
        // Register the user with Firebase Authentication
        const res = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
          confirmPassword,
          firstName,
          lastName,
          mobileNumber,
          profilePhoto
        );

        // Upload the photo to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `users/${res.user.uid}/${profilePhoto.name}`
        );
        await uploadBytes(storageRef, profilePhoto);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Log the download URL to the console
        console.log(downloadURL);

        // Save the download URL in Firestore
        const db = getFirestore();
        const usersRef = doc(db, "users", res.user.uid);
        await updateDoc(usersRef, {
          photoURL: downloadURL,
        });

        commit("setUser", res.user);
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },

    // for loginPage
    async login({ commit }, { email, password }) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        commit("setUser", res.user);
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },

    // Implement Google Sign-In action
    async googleSignin({ commit }, { provider }) {
      try {
        // Sign in with Google using a popup
        const res = await signInWithPopup(auth, provider);

        // Update the user state in Vuex store
        commit("setUser", res.user);
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },

    // Implement Facebook Sign-In action
    async facebookSignin({ commit }, { provider }) {
      try {
        // Sign in with Facebook using a popup
        const res = await signInWithRedirect(auth, provider);

        // Update the user state in Vuex store
        commit("setUser", res.user);
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },

    // Implement Facebook Sign-In action
    async twitterSignin({ commit }, { provider }) {
      try {
        // Sign in with Facebook using a popup
        const res = await signInWithPopup(auth, provider);

        // Update the user state in Vuex store
        commit("setUser", res.user);
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
  },
});

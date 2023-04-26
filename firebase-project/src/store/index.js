import { createStore } from "vuex";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export default createStore({
  state: {
    user: null,
    post: null,
    signupError: null,
    signErr: null,
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      console.log("user state changed:", state.user);
    },
    setPost(state, payload) {
      state.user = payload;
      console.log("post state changed:", state.post);
    },
  },
  actions: {
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
          confirmPassword
        );

        if (res && res.user) {
          const auth = getAuth();
          // Upload the photo to Firebase Storage
          const storage = getStorage();
          const storageRef = ref(
            storage,
            `users/${res.user.uid}/${profilePhoto.name}`
          );
          await uploadBytes(storageRef, profilePhoto);

          // Update the user's detail with update user
          await updateProfile(auth.currentUser, {
            displayName: `${firstName} ${lastName}`,
            phoneNumber: `${mobileNumber}`,
            photoURL: `${profilePhoto}`,
          });

          // Save the user's first name, last name, and photo URL to the database
          const db = getFirestore();
          const userRef = doc(collection(db, "users"), res.user.uid);
          await setDoc(userRef, {
            email,
            firstName,
            lastName,
            mobileNumber,
          });

          commit("setUser", res.user);
        } else {
          throw new Error("Signup unsuccessful");
        }
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
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
    async signInWithGoogle({ commit }) {
      try {
        // Create a new GoogleAuthProvider instance
        const provider = new GoogleAuthProvider();

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
    async signInWithFacebook({ commit }) {
      try {
        // Create a new FacebookAuthProvider instance
        const provider = new FacebookAuthProvider();

        // Get the Firebase auth instance
        const auth = getAuth();

        // Sign in with Facebook using a popup
        const res = await signInWithPopup(auth, provider);

        // Update the user state in Vuex store
        commit("setUser", res.user);
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },

    // Implement Facebook Sign-In action
    async signInWithTwitter({ commit }) {
      try {
        // Create a new FacebookAuthProvider instance
        const provider = new TwitterAuthProvider();

        // Get the Firebase auth instance
        const auth = getAuth();

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
  modules: {},
});

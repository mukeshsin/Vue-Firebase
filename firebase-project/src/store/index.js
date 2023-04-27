import { createStore } from "vuex";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

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
          confirmPassword,
          firstName,
          lastName,
          mobileNumber,
          profilePhoto
        );
        commit("setUser", res.user);
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
        const res = await signInWithPopup(auth, provider);

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

    // create add post page which will add collection in firebase
    async addPost({commit},{title,photo,slug,description}){
      try{

      }catch(error){
       console.log(error);
       throw new Error(error.message);
      
      }
    }

  }
});

import { createStore } from "vuex";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default createStore({
  state: {
    user: null,
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      state.user = payload;
      console.log("user state changed:", state.user);
    },
  },
  actions: {
    async signup({ commit }, { email, password, firstName, lastName }) {
      console.log("signup action");

      try {
        // Register the user with Firebase Authentication
        const res = await createUserWithEmailAndPassword(auth, email, password);

        if (res && res.user) {
          const auth = getAuth();
          updateProfile(auth.currentUser, {
            displayName: `${firstName},${lastName}`,
          });

          // Add data to Firestore
          const db = getFirestore();
          const userRef = doc(db, "users", res.user.uid);
          await setDoc(userRef, {
            firstName: firstName,
            lastName: lastName,
          });

          // Update the user state
          const user = {
            uid: res.user.uid,
            email: res.user.email,
            displayName: `${firstName} ${lastName}`,
          };
          commit("setUser", user);
        } else {
          throw new Error("signup unsuccessfully");
        }
      } catch (error) {
        console.error(error.message);
        throw new Error(error.message);
      }
    },
  },
  modules: {},
});

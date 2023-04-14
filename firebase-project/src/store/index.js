import { createStore } from "vuex";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";

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

          // Update the user's profile with additional information
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
  },
  modules: {},
});

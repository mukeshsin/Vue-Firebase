import { createStore } from "vuex";
//firebase imports
import{auth,db} from '../firebase/config'
import{
  createUserWithEmailAndPassword
} from 'firebase/auth'
import {
  collection,
  doc,
  setDoc
} from 'firebase/firestore'

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
    async signup({ commit }, { email, password ,firstName,lastName }) {
      console.log('signup action')

      try {
        // async code
        const res = await createUserWithEmailAndPassword(auth,email,password)

        if(res && res.user){
          // Update the user's display name
         auth.currentUser.updateProfile({
            displayName: `${firstName} ${lastName}`
          })

          // Save the user's first name and last name to the database
          const userRef = doc(collection(db, 'users'), res.user.uid)
          await setDoc(userRef, {
            firstName,
            lastName
          })
          commit('setUser',res.user)
        } else {
          throw new Error('signup unsuccessfully')
        }
      } catch (error) {
        console.error(error.message)
        throw new Error(error.message)
      }
    },
  },
  modules: {},
});

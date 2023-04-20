<template>
  <div class="form-container">
    <h1 class="form-head">LOGIN FORM</h1>
    <form @submit.prevent="handleLogin">
      <label>Email</label>
      <input
        v-model="email"
        name="email"
        type="email"
        class="form-control"
        placeholder="Email"
      />

      <label>Password</label>
      <input
        v-model="password"
        name="password"
        type="password"
        class="form-control"
        placeholder="Password"
      />

      <div>
        <button type="submit" class="submitBtn">LOGIN</button>
      </div>
      <div v-if="error">{{ error }}</div>

      <!-- Add social login buttons -->
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import firebase from "firebase/app";
import "firebase/auth";

// Import Firebase UI
import * as firebaseui from "firebaseui";

export default {
  name: "login-page",
  setup() {
    const email = ref("");
    const password = ref("");
    const error = ref(null);
    const store = useStore();
    const router = useRouter();

    const handleLogin = async () => {
      try {
        // login the user with Firebase Authentication
        await store.dispatch("login", {
          email: email.value,
          password: password.value,
        });

        router.push("/");
      } catch (err) {
        console.log(err);
        error.value = err.message;
      }
    };

    // Initialize Firebase UI
    const uiConfig = {
      signInFlow: "popup",
      signInSuccessUrl: "http://localhost:8080",
      signInOptions: [
        // List of OAuth providers supported.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: function (authResult) {
          console.log(authResult);
          return true;
        },
        uiShown: function () {
          document.getElementById("loader").style.display = "none";
        },
      },
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);

    return {
      email,
      password,
      error,
      handleLogin,
    };
  },
};
</script>

<style scoped>
.social-link {
  display: flex;
  margin-left: 22px;
}
.fb-link {
  border: none;
  margin-bottom: 7px;
  margin-right: 8px;
  color: white;
  background-color: #507cc0;
  padding: 8px;
  font-size: 14px;
}

.tw-link {
  border: none;
  margin-bottom: 7px;
  padding: 8px;
  color: white;
  background-color: #64ccf1;
  margin-right: 8px;
  font-size: 14px;
}

.Gg-link {
  border: none;
  margin-bottom: 7px;
  padding: 8px;
  color: white;
  background-color: #df4930;
  margin-right: 8px;
  font-size: 13px;
}

.fbicon {
  margin-right: 3px;
  font-size: 20px;
}

.twittericon {
  margin-right: 3px;
  font-size: 20px;
}
.googleicon {
  margin-right: 3px;
  font-size: 20px;
}
</style>

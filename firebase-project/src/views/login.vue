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

      <div class="social-link">
        <button class="fb-link">
          <i class="fa-brands fa-facebook fbicon"></i>Sigin with Facebook
        </button>
        <button class="tw-link">
          <i class="fa-brands fa-twitter twittericon"></i>Sigin with Twitter
        </button>
        <button class="Gg-link">
          <i class="fa-brands fa-google googleicon"></i>Sigin with Google
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import firebase from "firebase";
// import firebaseui from "firebaseui"; // import firebaseui instead of FirebaseAuthUI

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

<template>
  <div class="form-container">
    <h1 class="form-head">LOGIN FORM</h1>
    <form @submit.prevent="handleLogin">
      <label>Email</label>
      <input
        v-model="user.email"
        name="email"
        type="email"
        class="form-control"
        placeholder="Email"
      />

      <label>Password</label>
      <input
        v-model="user.password"
        name="password"
        type="password"
        class="form-control"
        placeholder="Password"
      />

      <div>
        <button type="submit" class="submitBtn">LOGIN</button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="social-link">
        <button class="fb-link" @click="handleFbLogin">
          <i class="fa-brands fa-facebook fbicon"></i>Signin with Facebook
        </button>
        <button class="tw-link" @click="handleTwLogin">
          <i class="fa-brands fa-twitter twittericon"></i>Signin with Twitter
        </button>
        <button class="Gg-link" @click="handleGgLogin">
          <i class="fa-brands fa-google googleicon"></i>Signin with Google
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "login-page",
  setup() {
    const user = reactive({
      email: "",
      password: "",
    });
    const error = ref(null);
    const store = useStore();
    const router = useRouter();

    const handleLogin = async () => {
      try {
        // login the user with Firebase Authentication

        await store.dispatch("login", {
          email: user.email,
          password: user.password,
        });

        router.push("/");
      } catch (err) {
        console.log(err);
        error.value = err.message;
      }
    };

    const handleGgLogin = async () => {
      try {
        await store.dispatch("signInWithGoogle");
        // Google Sign-In successful, perform additional actions if needed
      } catch (error) {
        console.log(error);
        // Handle error
      }
    };

    const handleFbLogin = async () => {
      try {
        await store.dispatch("signInWithFacebook");
        // Facebook Sign-In successful, perform additional actions if needed
      } catch (error) {
        console.log(error);
        // Handle error
      }
    };

    const handleTwLogin = async () => {
      try {
        await store.dispatch("signInWithTwitter");
        // Twitter Sign-In successful, perform additional actions if needed
      } catch (error) {
        console.log(error);
        // Handle error
      }
    };

    return {
      user,
      error,
      handleLogin,
      handleGgLogin,
      handleFbLogin,
      handleTwLogin,
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
  font-size: 11px;
}

.tw-link {
  border: none;
  margin-bottom: 7px;
  padding: 8px;
  color: white;
  background-color: #64ccf1;
  margin-right: 8px;
  font-size: 11px;
}

.Gg-link {
  border: none;
  margin-bottom: 7px;
  padding: 8px;
  color: white;
  background-color: #df4930;
  margin-right: 8px;
  font-size: 11px;
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

.error {
  color: red;
  font-size: 17px;
  display: flex;
  padding: 8px;
}
</style>

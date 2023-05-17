<template>
  <div>
    <div
      class="w-4/5 h-full sm:mx-auto mt-5 sm:w-3/4 2xl:w-2/5 2xl:h-full mx-auto rounded-3 bg-customBg pt-10 rounded-9 shadow-white pb-15 box-border"
    >
      <h1
        class="text-headColor tracking-widest text-base sm:text-lg md:text-2xl"
      >
        LOGIN FORM
      </h1>
      <Form class="w-3/4 mx-auto" @submit="handleLogin">
        <label class="flex text-white mt-3 mb-1 text-lg">Email</label>
        <Field
          class="w-full border-solid outline-none tracking-wider p-2 text-sm md:text-base lg:text-lg"
          v-model="user.email"
          name="email"
          type="email"
          placeholder="Email"
          :rules="validateEmail"
        />
        <ErrorMessage class="flex text-red-500 mt-0.5" name="email" />
        <label class="flex text-white mt-1 mb-1 text-lg">Password</label>
        <Field
          class="w-full border-solid outline-none text-base tracking-wider p-2 text-sm md:text-base lg:text-lg"
          v-model="user.password"
          name="password"
          type="password"
          placeholder="Password"
          :rules="validatePasswordLogin"
        />
        <ErrorMessage class="flex text-red-500 mt-0.5" name="password" />
        <span v-if="isLoading">
          <i class="fa fa-spinner fa-spin text-2xl text-white mt-1"></i>
        </span>

        <div>
          <div v-if="error" class="flex text-red-500 mt-0.5">{{ error }}</div>
          <button
            class="w-full h-45 bg-buttonBg mt-3 mb-3 border-0 tracking-wider p-2 md:text-base lg:text-lg"
          >
            LOGIN
          </button>
        </div>

        <div class="mx-auto md:ml-2 lg:flex md:flex">
          <button
            class="w-48 border-0 mb-2 mr-1 text-white bg-blue-600 p-2 text-xs md:p-0.5 lg:w-full md:w-full lg:p-1.5 2xl:p-2"
            @click="handleFbLogin"
          >
            <i class="fa-brands fa-facebook mr-1 text-base"></i>Signin with
            Facebook
          </button>
          <button
            class="w-48 border-0 mb-2 mr-1 text-white bg-blue-400 p-2 text-xs md:p-0.5 lg:w-full md:w-full lg:p-1.5 2xl:p-2"
            @click="handleTwLogin"
          >
            <i class="fa-brands fa-twitter mr-1 text-base"></i>Signin with
            Twitter
          </button>
          <button
            class="w-48 border-0 mb-2 mr-1 text-white bg-red-700 p-2 text-xs md:p-0.5 lg:w-full md:w-full lg:p-1.5 2xl:p-2"
            @click="handleGgLogin"
          >
            <i class="fa-brands fa-google mr-1 text-base"></i>Signin with Google
          </button>
        </div>
      </Form>
    </div>
    <div class="ajdustToast">
      <successToast v-if="isSubmitted">
        <template v-slot:loginContent>Login Successfully</template>
      </successToast>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { validationErr } from "../composables/validation.js";
import successToast from "../components/successToast.vue";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  getAuth,
} from "firebase/auth";
export default {
  name: "login-page",
  components: {
    Form,
    Field,
    ErrorMessage,
    successToast,
  },
  setup() {
    const user = reactive({
      email: "",
      password: "",
    });
    const error = ref(null);
    const store = useStore();
    const router = useRouter();
    const isLoading = ref(false);
    const isSubmitted = ref(false);
    const handleLogin = async () => {
      try {
        isLoading.value = true;
        // login the user with Firebase Authentication
        await store.dispatch("login", {
          email: user.email,
          password: user.password,
        });
        isSubmitted.value = true;
        isLoading.value = false;
        router.push("/post");
      } catch (err) {
        console.log(err);
        error.value = err.message;
      }
    };
    const handleGgLogin = async () => {
      try {
        // Create a new FacebookAuthProvider instance
        const provider = new GoogleAuthProvider();
        await store.dispatch("googleSignin", { provider });
        // Google Sign-In successful, perform additional actions if needed
      } catch (error) {
        console.log(error);
        // Handle error
      }
    };
    const handleFbLogin = async () => {
      try {
        // Create a new FacebookAuthProvider instance
        const provider = new FacebookAuthProvider();
        // Get the Firebase auth instance
        const auth = getAuth();
        await store.dispatch("facebookSignin", { provider, auth });
        // Facebook Sign-In successful, perform additional actions if needed
      } catch (error) {
        console.log(error);
        // Handle error
      }
    };
    const handleTwLogin = async () => {
      try {
        // Create a new FacebookAuthProvider instance
        const provider = new TwitterAuthProvider();
        // Get the Firebase auth instance
        const auth = getAuth();
        await store.dispatch("twitterSignin", { provider, auth });
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
      ...validationErr(),
      isSubmitted,
      isLoading,
    };
  },
};
</script>

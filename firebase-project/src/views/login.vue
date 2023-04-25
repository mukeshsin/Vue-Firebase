<template>
  <div
    class="w-4/5 h-full sm:mx-auto sm:w-3/4 2xl:w-2/5 2xl:h-full mx-auto rounded-3 bg-customBg pt-10 rounded-9  shadow-white pb-15 box-border">
    <h1 class="text-headColor tracking-widest text-sm sm:text-lg md:text-2xl">
      LOGIN FORM
    </h1>
    <Form class="w-3/4 mx-auto" @submit="handleLogin">
      <label class="flex text-white mt-3 mb-1 text-lg">Email</label>
      <Field
        class="w-full  border-solid  outline-none text-base tracking-wider p-1"
        v-model="user.email"
        name="email"
        type="email"
        placeholder="Email"
        :rules="validateEmail"
      />
      <ErrorMessage class="flex text-red-500 mt-0.5" name="email" />
      <label class="flex text-white mt-1 mb-1 text-lg">Password</label>
      <Field
        class="w-full  border-solid  outline-none text-base tracking-wider p-1"
        v-model="user.password"
        name="password"
        type="password"
        placeholder="Password"
        :rules="validatePassword"
      />
      <ErrorMessage class="flex text-red-500 mt-0.5" name="password" />

      <div>
        <div v-if="error" class="flex text-red-500 mt-0.5">{{ error }}</div>
        <button
          class="w-full h-45 bg-buttonBg mt-3 mb-4 border-0 tracking-wider"
        >
          LOGIN
        </button>
      </div>

      <div class="mx-auto md:ml-2 lg:flex">
        <button
          class="border-0 mb-2 mr-1 text-white bg-blue-600 p-2 text-xs md:p-1 lg:w-full"
          @click="handleFbLogin"
        >
          <i class="fa-brands fa-facebook mr-1 text-base"></i>Signin with
          Facebook
        </button>
        <button
          class="border-0 mb-2 mr-1 text-white bg-blue-400 p-2 text-xs md:p-1 lg:w-full"
          @click="handleTwLogin"
        >
          <i class="fa-brands fa-twitter mr-1 text-base"></i>Signin with Twitter
        </button>
        <button
          class="border-0 mb-2 mr-1 text-white bg-red-700 p-2 text-xs md:p-1 lg:w-full"
          @click="handleGgLogin"
        >
          <i class="fa-brands fa-google mr-1 text-base"></i>Signin with Google
        </button>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { validationErr } from "../composables/validation.js";

export default {
  name: "login-page",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
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
      ...validationErr(),
    };
  },
};
</script>

<style scoped></style>

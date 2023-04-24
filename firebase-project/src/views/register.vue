<template>
  <div class="form-container">
    <h1 class="form-head">REGISTRATION FORM</h1>
    <Form @submit="handleSubmit">
      <div class="fixCss">
        <div class="fixLabel1">
          <label>First name</label>
          <Field
            v-model="user.firstName"
            name="firstName"
            type="firstName"
            class="form-control"
            placeholder="First name"
            :rules="validatefirstName"
          />
          <ErrorMessage class="validateErr" name="firstName" />
        </div>
        <div class="fixLabel2">
          <label>Last name</label>
          <Field
            v-model="user.lastName"
            name="lastName"
            type="lastName"
            class="form-control"
            placeholder="Last name"
            :rules="validatelastName"
          />
          <ErrorMessage class="validateErr" name="lastName" />
        </div>
      </div>

      <label>Mobile Number</label>
      <Field
        v-model="user.mobileNumber"
        name="mobileNumber"
        type="number"
        class="form-control"
        placeholder="Mobile Number"
        :rules="validatemobileNumber"
      />
      <ErrorMessage class="validateErr" name="mobileNumber" />
      <label>Profile Photo</label>
      <Field
        v-model="user.profilePhoto"
        name="profilePhoto"
        type="file"
        class="form-control"
        :rules="validateprofilePhoto"
      />
      <ErrorMessage class="validateErr" name="profilePhoto" />
      <label>Email</label>
      <Field
        v-model="user.email"
        name="email"
        type="email"
        class="form-control"
        placeholder="Email"
        :rules="validateEmail"
      />
      <ErrorMessage class="validateErr" name="email" />
      <label>Password</label>
      <Field
        v-model="user.password"
        name="password"
        type="password"
        class="form-control"
        placeholder="Password"
        :rules="validatePassword"
      />
      <ErrorMessage class="validateErr" name="password" />

      <label>Confirm Password</label>
      <Field
        v-model="user.confirmPassword"
        name="confirmPassword"
        type="password"
        class="form-control"
        placeholder="Confirm Password"
        :rules="validateconfirmPassword"
      />

      <ErrorMessage class="validateErr" name="confirmPassword" />
      <div>
        <button type="submit" class="submitBtn">
          <span v-if="isLoading"
            ><i class="fa fa-spinner fa-spin loaderCss"></i
          ></span>
          REGISTER NOW
        </button>
      </div>
      <div v-if="error">{{ error }}</div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { validationErr } from "../composables/validation.js"

export default {
  name: "register-page",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
     const user = reactive({
      email: "",
      password: "",
      mobileNumber: "",
      firstName: "",
      lastName: "",
      profilePhoto: "",
      confirmPassword: "",
    });

    const error = ref(null);
    const store = useStore();
    const router = useRouter();
    const isLoading = ref(false);

    const validateconfirmPassword = (confirmPassword, password) => {
      //if the field is empty
      if (!confirmPassword) {
        return "This field is required";
      }
      // If passwords do not match
      if (confirmPassword !== user.password) {
        return "Passwords do not match";
      }

      console.log(password);
      console.log(confirmPassword);

      return true;
    };

    const handleSubmit = async () => {
      try {
        // Register the user with Firebase Authentication
        isLoading.value = true;
        await store.dispatch("signup", {
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          mobileNumber: user.mobileNumber,
          profilePhoto: user.profilePhoto,
          confirmPassword: user.confirmPassword,
        });

        // Redirect the user to the login page
        isLoading.value = false;
        router.push("/login");
      } catch (err) {
        console.log(err);
        error.value = err.message;
      }
    };

    return {
      user,
      handleSubmit,
      error,
      validateconfirmPassword,
      ...validationErr(),
    };
  },
};
</script>

<style scoped>
.validateErr {
  color: red;
  font-size: 17px;
  display: flex;
  padding: 8px;
}

.loaderCss {
  font-size: 15px;
}
</style>

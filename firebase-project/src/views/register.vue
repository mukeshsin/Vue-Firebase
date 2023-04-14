<template>
  <div class="form-container">
    <h1 class="form-head">REGISTRATION FORM</h1>
    <Form @submit="handleSubmit">
      <div class="fixCss">
        <div class="fixLabel1">
          <label>First name</label>
          <Field
            v-model="firstName"
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
            v-model="lastName"
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
        v-model="mobileNumber"
        name="mobileNumber"
        type="number"
        class="form-control"
        placeholder="Mobile Number"
        :rules="validatemobileNumber"
      />
      <ErrorMessage class="validateErr" name="mobileNumber" />
      <label>Profile Photo</label>
      <Field
        v-model="profilePhoto"
        name="profilePhoto"
        type="file"
        class="form-control"
        :rules="validateprofilePhoto"
      />
      <ErrorMessage class="validateErr" name="profilePhoto" />
      <label>Email</label>
      <Field
        v-model="email"
        name="email"
        type="email"
        class="form-control"
        placeholder="Email"
        :rules="validateEmail"
      />
      <ErrorMessage class="validateErr" name="email" />
      <label>Password</label>
      <Field
        v-model="password"
        name="password"
        type="password"
        class="form-control"
        placeholder="Password"
        :rules="validatePassword"
      />
      <ErrorMessage class="validateErr" name="password" />

      <label>Confirm Password</label>
      <Field
        v-model="confirmPassword"
        name="confirmPassword"
        type="password"
        class="form-control"
        placeholder="Confirm Password"
        :rules="validateConfirmPassword"
      />
      <ErrorMessage class="validateErr" name="confirmPassword" />
      <div>
        <button type="submit" class="submitBtn">REGISTER NOW</button>
      </div>
      <div v-if="error">{{ error }}</div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "register-page",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const email = ref("");
    const password = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const mobileNumber = ref("");
    const profilePhoto = ref("");
    const confirmPassword = ref("");
    const error = ref(null);
    const store = useStore();
    const router = useRouter();

    const handleSubmit = async () => {
      try {
        // Register the user with Firebase Authentication

        await store.dispatch("signup", {
          email: email.value,
          password: password.value,
          firstName: firstName.value,
          lastName: lastName.value,
          mobileNumber: mobileNumber.value,
          profilePhoto: profilePhoto.value,
          confirmPassword: confirmPassword.value,
        });

        // Redirect the user to the login page
        router.push("/login");
      } catch (err) {
        console.log(err);
        error.value = err.message;
      }
    };

    const validateEmail = (value) => {
      // if the field is empty
      if (!value) {
        return "This field is required";
      }
      // if the field is not a valid email
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!regex.test(value)) {
        return "This field must be a valid email";
      }
      // All is good
      return true;
    };

    const validatefirstName = (value) => {
      // if the field is empty
      if (!value) {
        return "This field is required";
      }
      // if firstName is less than 4 characters
      if (value.length < 4) {
        return "The first name should be at least 4 characters long";
      }
      // All is good
      return true;
    };

    const validatelastName = (value) => {
      // if the field is empty
      if (!value) {
        return "This field is required";
      }
      // if lastName is less than 4 characters
      if (value.length < 4) {
        return "The last name should be at least 4 characters long";
      }
      // All is good
      return true;
    };

    const validatemobileNumber = (value) => {
      if (!value) {
        return "This field is required";
      }
      if (value.length < 10) {
        return "The Mobile Number should be at least 10 digits";
      }
      return true;
    };

    const validateprofilePhoto = (file) => {
      if (!file) {
        return "Please select a picture";
      }
      if (file.size > 1000000) {
        return "This file must be less than or equal to 1MB";
      }
      return true;
    };

    const validatePassword = (value) => {
      // if the field is empty
      if (!value) {
        return "This field is required";
      }
      // if the field is not a valid password
      const regex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+!~\-/?\\[\]{}|])(?=.*[^\s]).{8,20}$/;
      if (!regex.test(value)) {
        return "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and be between 8-20 characters long";
      }
      // All is good
      return true;
    };

    const validateConfirmPassword = (value) => {
      if (!value) {
        return "This field is required";
      }
      //validate for password & confirm password match ya not
      if (value !== password.value) {
        return "Passwords do not match";
      }
      return true;
    };

    return {
      email,
      password,
      firstName,
      lastName,
      mobileNumber,
      profilePhoto,
      confirmPassword,
      handleSubmit,
      error,
      validateEmail,
      validatefirstName,
      validatelastName,
      validatemobileNumber,
      validateprofilePhoto,
      validatePassword,
      validateConfirmPassword,
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
</style>

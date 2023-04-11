<template>
  <div class="form-container">
    <h1 class="form-head">REGISTRATION FORM</h1>
    <Form @submit="onSubmit">
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
        name="mobileNumber"
        type="number"
        class="form-control"
        placeholder="Mobile Number"
        :rules="validatemobileNumber"
      />
      <ErrorMessage class="validateErr" name="mobileNumber" />
      <label>Profile Photo</label>
      <Field
        name="photo"
        type="file"
        class="form-control"
        :rules="validatephoto"
      />
      <ErrorMessage class="validateErr" name="photo" />
      <label>Email</label>
      <Field
        name="email"
        type="email"
        class="form-control"
        placeholder="Email"
        :rules="validateEmail"
      />
      <ErrorMessage class="validateErr" name="email" />
      <label>Password</label>
      <Field
        name="password"
        type="password"
        class="form-control"
        placeholder="Password"
        :rules="validatePassword"
      />
      <ErrorMessage class="validateErr" name="password" />

      <label>Confirm Password</label>
      <Field
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
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  name: "register-page",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {},

  methods: {
    onSubmit(values) {
      console.log(values, null, 2);
    },

    validateEmail(value) {
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
    },
    validatefirstName(value) {
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
    },

    validatelastName(value) {
      if (!value) {
        return "This field is required";
      }
      if (value.length < 4) {
        return "The last name should be at least 4 characters long";
      }
      return true;
    },
    validatemobileNumber(value) {
      if (!value) {
        return "This field is required";
      }
      if (value.length < 10) {
        return "The Mobile Number should be at least 10 digits";
      }
      return true;
    },
    validatephoto(file) {
      if (!file) {
        return "Please select a picture";
      }
      if (file.size > 1000000) {
        return "This file must be less than 1MB";
      }
      return true;
    },
    validatePassword(value) {
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
    },
    validateConfirmPassword(value) {
      if (!value) {
        return "This field is required";
      }
      //validate for password & confirm password match ya not
      if (value !== this.values.password) {
        return "Passwords do not match";
      }
      return true;
    },
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

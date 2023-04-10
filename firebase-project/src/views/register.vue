<template>
  <div class="form-container">
    <h1>Create a User</h1>
    <form @submit.prevent="handleSignup">
      <label>First name</label>
      <input type="text" class="formInput" v-model="firstName" />

      <label class="formLabel">Last name</label>
      <input type="text" class="formInput" v-model="lastName" />

      <label class="formLabel">Mobile No.</label>
      <input type="tel" class="formInput" v-model="mobileNumber" />

      <label class="formLabel">Profile photo</label>
      <input type="fil" class="formInput" v-model="profilePhoto" />
      
      <button type="submit" class="submitBtn">Register</button>
    </form>
  </div>
</template>
<script>
export default {
  name: "registerPage",
  setup() {},
};
</script>
<style scoped></style>

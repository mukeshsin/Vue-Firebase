<template>
  <div class="form-container">
    <h1 class="form-head">ADD POST</h1>
    <form @submit.prevent="handlePost">
      <label>Title</label>


      <label>Photo</label>

         <label>Slug</label>

      <div>
        <button type="submit" class="submitBtn">ADD POST</button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script>
export default {
  name: "post-page",

};
</script>

<style scoped></style>

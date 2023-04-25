<template>
  <div
    class="mx-auto bg-black w-full h-16 mb-5 shadow-md flex items-center justify-between"
  >
    <h1
      class="text-lg md:text-2xl lg:text-3xl text-headColor font-bold tracking-wider ml-4 font-franklin-gothic-medium"
    >
      Firebase
    </h1>
    <div class="router-panel text-white mr-4 flex">
      <button
        @click="$router.push('/register')"
        class="text-navBtn1 bg-navBtn2 border-none mr-2 cursor-pointer text-xs md:text-base lg:text-lg rounded-md p-1 font-bold tracking-widest"
      >
        Register
      </button>
      <button
        @click="$router.push('/login')"
        class="text-navBtn1 bg-navBtn2 border-none mr-2 cursor-pointer text-xs md:text-base lg:text-lg rounded-md p-1 font-bold tracking-widest"
      >
        Login
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped></style>

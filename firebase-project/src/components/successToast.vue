<template>
  <div class="border-none text-black text-xs font-bold font-sans pt-4 bg-gradient-to-r from-red-500 w-3/4 lg:w-2/5 h-16 mx-auto mb-4 md:text-base lg:w-3/4 lg:text-lg xl:text-2xl xl:w-2/5  2xl:text-2xl 2xl:w-2/5">
    <div class="text-center">
      <slot name="content"></slot>
      <slot name="loginContent"></slot>
       <slot name="postContent"></slot>
     
    </div>
  </div>
</template>

<script>

export default {
  name: "successToast",
};
</script>

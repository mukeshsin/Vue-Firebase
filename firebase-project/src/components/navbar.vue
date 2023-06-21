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
        v-if=" !isPostRoute && !isPostListRoute && !isSinglePostRoute"
        class="text-navBtn1 bg-navBtn2 border-none mr-2 cursor-pointer text-xs md:text-base lg:text-lg rounded-md p-1 font-bold tracking-widest hover:bg-navBtnHover"
      >
        Register
      </button>
      <button
        @click="$router.push('/login')"
        v-if="!isLoginPage && !isPostRoute  && !isPostListRoute && !isSinglePostRoute"
        class="text-navBtn1 bg-navBtn2 border-none mr-2 cursor-pointer text-xs md:text-base lg:text-lg rounded-md p-1 font-bold tracking-widest hover:bg-navBtnHover"
      >
        Login
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { computed } from "vue";

export default {
  name: "NavBar",
  setup() {
    const router = useRouter();

    const isLoginPage = computed(() => {
      return router.currentRoute.value.path === "/login";
    });

    const isPostRoute = computed(() => {
      return router.currentRoute.value.path === "/post";
    });

     const isPostListRoute = computed(() => {
      return router.currentRoute.value.path === "/postList";
    });

     const isSinglePostRoute = computed(() => {
      return router.currentRoute.value.name === "single-post";
    });

    return { isLoginPage,isPostRoute,isPostListRoute,isSinglePostRoute };
  },
};
</script>

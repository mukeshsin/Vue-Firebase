<template>
  <div class="mb-0 mt-0 bg-gray-100 min-h-screen box-border">
    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-red-500 mb-4 font-sans">POSTS</h1>
      <ul
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
      >
        <li
          v-for="post in posts"
          :key="post.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <img
            class="h-48 w-full mx-auto object-cover"
            :src="post.photo"
            alt=""
          />
          <div class="p-4">
            <h2
              class="text-xl font-medium text-gray-900 tracking-normal font-medium"
            >
              {{ post.title }}
            </h2>
            <p class="mt-2 mb-3 text-sm text-gray-700 leading-4">
              {{ post.description }}
            </p>
            <p v-if="post.taggedUser" class="mt-2 text-xs text-gray-700">
              <span class="text-gray-600 font-semibold">Tagged User:</span>
              <span class="text-gray-800 leading-normal">{{
                post.taggedUser
              }}</span>
            </p>
            <p v-else class="mt-2 text-sm text-gray-700 tracking-wide" disabled>
              Tagged User: N/A
            </p>
          </div>
        </li>
      </ul>
      <div class="mt-4 flex justify-center">
        <button
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          @click="getPosts(prevPage)"
        >
          Previous Page
        </button>
        <button
          class="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          @click="getPosts(nextPage)"
        >
          Next Page
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { ref } from "vue";
export default {
  name: "post-list",
  setup() {
    const posts = ref([]);
    const getAllPost = async () => {
      const db = getFirestore();
      const postsRef = collection(db, "posts");
      const querySnapshot = await getDocs(postsRef);
      posts.value = [];
      querySnapshot.forEach((doc) => {
        const post = {
          id: doc.id,
          ...doc.data(),
        };
        posts.value.push(post);
      });
    };
    getAllPost();
    return {
      posts,
      getAllPost,
    };
  },
};
</script>

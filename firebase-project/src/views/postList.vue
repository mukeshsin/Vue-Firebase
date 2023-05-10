<template>
  <div class="min-h-screen box-border">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">POSTS</h1>
      <ul
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 "
      >
        <li
          v-for="post in posts"
          :key="post.id"
          class="bg-white rounded-md shadow-md overflow-hidden  "
        >
          <img class="h-48 w-full object-cover" :src="post.photo" alt="" />
          <div class="p-4">
            <h2 class="text-lg font-medium text-gray-900">{{ post.title }}</h2>
            <p class="mt-2 text-sm text-gray-700">{{ post.description }}</p>
          </div>
        </li>
      </ul>
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

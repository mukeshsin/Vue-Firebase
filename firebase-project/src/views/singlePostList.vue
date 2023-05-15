<template>
  <div class="mb-0 mt-0 bg-gray-100 min-h-screen box-border">
    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-grey-500 mb-4 font-sans">POST</h1>
      <div v-if="post" class="bg-white rounded-xl shadow-lg overflow-hidden">
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
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { ref } from "vue";

export default {
  name: "singlePost",
  setup() {
     const post = ref([]);

    const getSinglePost = async () => {
      try {
          const db = getFirestore();
      const postsRef = collection(db, "posts");
      const querySnapshot = await getDocs(postsRef);
      post.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      } catch (error) {
        console.log(error);
      }
    };

    getSinglePost();

    return {
      post,
      getSinglePost,
    };
  },
};
</script>

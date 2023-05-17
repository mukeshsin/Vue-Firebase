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
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "singlePost",
  setup() {
    const post = ref(null);
    const error = ref(null);
    const route = useRoute();

    const getSinglePost = async () => {
      try {
        const postId = route.params.uid;
        if (!postId) {
          throw new Error("Missing required param 'uid'");
        }
        const db = getFirestore();
        const postDocRef = doc(db, "posts", postId);
        const postDocSnapshot = await getDoc(postDocRef);

        if (postDocSnapshot.exists()) {
          post.value = { id: postDocSnapshot.id, ...postDocSnapshot.data() };
          error.value = null;
        } else {
          throw new Error("Post does not exist");
        }
      } catch (error) {
        post.value = null;
        error.value = error.message;
        console.error(error);
      }
     
      console.log("uid:", route.params.uid);
      console.log("post.value:", post.value);
    };
    onMounted(getSinglePost);

    return {
      post,
      error,
    };
  },
};
</script>

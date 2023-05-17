<template>
  <div class="mb-0 mt-0 bg-gray-100 min-h-screen box-border relative">
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <i class="fa fa-spinner fa-spin text-4xl text-grey-500"></i>
    </div>

    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-grey-500 mb-4 font-sans">POSTS</h1>
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
            <button
              v-if="posts.length > 0"
              @click="showPostDetail(post.uid)"
              class="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold text-xs py-1 px-1 rounded"
            >
              View Details <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </li>
      </ul>

      <button
        v-if="showLoadMoreButton"
        @click="loadMorePosts"
        class="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Load More <i class="fa-solid fa-circle-chevron-down"></i>
      </button>
    </div>
  </div>
</template>

<script>
import {
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "post-list",
  setup() {
    const router = useRouter();
    const posts = ref([]);
    const batchSize = 5; // Number of posts to load per batch
    const lastVisiblePost = ref(null);
    const isLoading = ref(false);

    const db = getFirestore();
    const postsRef = collection(db, "posts");

    const getAllPosts = async () => {
      isLoading.value = true;
      const postData = query(postsRef, orderBy("createdAt", "desc"), limit(batchSize));
      const querySnapshot = await getDocs(postData);
      posts.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      lastVisiblePost.value = querySnapshot.docs[querySnapshot.docs.length - 1];
      isLoading.value = false;
    };

    const loadMorePosts = async () => {
      isLoading.value = true;
      if (lastVisiblePost.value) {
        const postData = query(
          postsRef,
          orderBy("createdAt", "desc"),
          startAfter(lastVisiblePost.value),
          limit(batchSize)
        );
        const querySnapshot = await getDocs(postData);
        const newPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        posts.value = [...posts.value, ...newPosts];
        lastVisiblePost.value =
          querySnapshot.docs[querySnapshot.docs.length - 1];
      }
      isLoading.value = false;
    };

    const showPostDetail = (key) => {
      router.push(`/single-post/${key}`);
    };

    const showLoadMoreButton = computed(() => {
      return lastVisiblePost.value !== null;
    });

    getAllPosts();

    return {
      posts,
      loadMorePosts,
      showLoadMoreButton,
      isLoading,
      showPostDetail,
    };
  },
};
</script>

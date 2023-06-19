<template>
  <div class="mb-0 mt-0 bg-gray-100 min-h-screen box-border relative">
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <i class="fa fa-spinner fa-spin text-4xl text-grey-500"></i>
    </div>

    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-end">
        <button
          v-if="showCreateButton"
          @click="goBackPost"
          class="ml-4 bg-blue-500 hover:bg-blue-700 text-white text-md font-bold py-1 px-2 rounded"
        >
          Create Post
        </button>
      </div>
      <h1 class="text-4xl font-bold text-grey-500 mb-3 mt-0 font-sans">
        POSTS
      </h1>

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

            <p
              v-if="post.taggedUser && post.taggedUser.length"
              class="mt-2 text-xs text-gray-700"
            >
              <span class="text-gray-600 font-semibold">Tagged User:</span>
              <span
                class="text-gray-800 leading-normal block"
                v-for="user in post.taggedUser"
                :key="user.email"
                >{{ user.email }}</span
              >
            </p>
            <p v-else class="mt-2 text-sm text-gray-700 tracking-wide" disabled>
              Tagged User: N/A
            </p>
            <button
              v-if="posts.length > 0"
              @click="showPostDetail(post.id)"
              class="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold text-xs py-1 px-1 rounded"
            >
              View Details <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div class="bg-grey-500">
            <i
              class="fa-sharp fa-solid fa-comment text-blue-500 text-lg mr-8"
              @click="handleAddComment(post.id)"
            ></i>
          </div>
          <div class="w-96 ml-10 mt-2 mb-2 flex" v-if="showInput === post.id">
            <input
              class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg border-2"
              name="comment"
              type="text"
              placeholder="Comment"
              v-model="comment.commentTitle"
            />
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded mr-4 ml-2"
              @click="submitComment"
            >
              Submit
            </button>
          </div>
          <div>
            <ul class="mt-2">
              <li v-for="comment in post.comments" :key="comment.id">
                <p class="text-sm text-gray-600">
                  {{ comment.commentTitle }}
                  <span class="ml-2">
                    <i
                      class="fas fa-edit text-blue-500 cursor-pointer"
                      @click="editComment(comment.id)"
                    ></i>
                  </span>
                  <span class="ml-2">
                    <i
                      class="fas fa-trash text-red-500 cursor-pointer"
                      @click="deleteComment(post.id, comment.id)"
                    ></i>
                  </span>
                </p>
              </li>
            </ul>
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
  getDoc,
  getFirestore,
  updateDoc,
  query,
  orderBy,
  doc,
  limit,
  startAfter,
} from "firebase/firestore";
import { ref, computed, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "post-list",
  setup() {
    const router = useRouter();
    const posts = ref([]);
    const batchSize = 5; // Number of posts to load per batch
    const lastVisiblePost = ref(null);
    const isLoading = ref(false);
    const showInput = ref(false);
    const now = new Date();
    const comment = reactive({
      commentTitle: "",
      createdAt: now,
    });

    const db = getFirestore();
    const postsRef = collection(db, "posts");

    const getAllPosts = async () => {
      isLoading.value = true;
      const postData = query(
        postsRef,
        orderBy("createdAt", "desc"),
        limit(batchSize)
      );
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
    onMounted(() => {
      console.log(posts.value);
    });

    const showPostDetail = (key) => {
      router.push(`/post/${key}`);
    };

    const showLoadMoreButton = computed(() => {
      return lastVisiblePost.value !== null;
    });

    getAllPosts();

    const goBackPost = () => {
      router.push("/post");
    };

    const showCreateButton = computed(() => {
      return lastVisiblePost.value !== null;
    });

    const handleAddComment = (postId) => {
      showInput.value = postId;
    };

    const submitComment = async () => {
      const db = getFirestore();
      const postRef = doc(db, "posts", showInput.value);

      try {
        const commentData = {
          commentTitle: comment.commentTitle,
          createdAt: comment.createdAt,
        };

        const postSnap = await getDoc(postRef);
        const postData = postSnap.data();
        const comments = postData.comments || [];

        comments.push(commentData);

        await updateDoc(postRef, {
          comments: comments,
        });

        comment.commentTitle = "";

        // Hide the comment input field
        showInput.value = false;
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };

    const deleteComment = async (postId, commentId) => {
      try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        const postData = postSnap.data();
        const comments = postData.comments || [];

        // Filter out the deleted comment from the local array
        const updatedComments = comments.filter(
          (comment) => comment.id !== commentId
        );

        // Update the comments in Firestore
        await updateDoc(postRef, {
          comments: updatedComments,
        });
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    };

    return {
      posts,
      loadMorePosts,
      showLoadMoreButton,
      showCreateButton,
      isLoading,
      showPostDetail,
      goBackPost,
      handleAddComment,
      showInput,
      submitComment,
      comment,
      deleteComment,
    };
  },
};
</script>

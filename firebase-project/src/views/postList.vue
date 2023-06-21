<template>
  <div class="mb-0 mt-0 bg-gray-100 min-h-screen box-border relative">
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <i class="fa fa-spinner fa-spin text-4xl text-grey-500"></i>
    </div>

    <div class="max-w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
            alt="postimage"
            @click="showPostDetail(post.id)"
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
          </div>
          <div class="bg-grey-500">
            <i
              class="fa-sharp fa-solid fa-comment text-blue-500 text-lg mr-8 p-2"
              @click="handleAddComment(post.id)"
            ></i>
          </div>
          <div class="w-96 mt-2 mb-2 flex" v-if="showInput === post.id">
            <input
              class="w-48 h-8 ml-4 border-solid border-slate-950 outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg border-2 md:ml-10 lg:ml-5 xl:w-72 xl:ml-20"
              name="comment"
              type="text"
              placeholder="Add/Update Comment"
              v-model="comment.commentTitle"
            />
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-4 ml-2 h-8"
              @click="submitComment"
            >
              Submit
            </button>
          </div>

          <div>
            <ul class="mt-2">
              <li v-for="comment in post.comments" :key="comment.id">
                <div v-if="!comment.isEditing">
                  <p
                    class="text-sm text-gray-600 border-2 border-slate-950 w-64 ml-4 mb-2 p-1 md:ml-10 lg:ml-5 xl:ml-24"
                  >
                    {{ comment.commentTitle }}
                    <span class="ml-2">
                      <i
                        class="fas fa-edit text-blue-500 cursor-pointer"
                        @click="editCommentInput(comment)"
                      ></i>
                    </span>
                    <span class="ml-2">
                      <i
                        class="fas fa-trash text-red-500 cursor-pointer"
                        @click="deleteComment(post.id, comment.id)"
                      ></i>
                    </span>
                  </p>
                </div>
                <div v-else>
                  <div class="flex flex-col items-center sm:flex-row md:flex-col">
                    <input
                      class="w-48 h-8  mb-1 border-solid border-slate-950 outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg border-2  xl:w-72 "
                      :value="comment.commentTitle"
                      @input="updateCommentInput(comment, $event.target.value)"
                    />
                    <button
                      class="bg-blue-500  hover:bg-blue-700 text-white font-bold py-1 px-2 rounded   h-8 w-32 mb-1  "
                      @click="saveComment(post.id, comment)"
                    >
                      Save
                    </button>
                    <button
                      class="bg-red-500 hover:bg-red-700 text-white font-bold  mb-2 py-1 px-2 rounded h-8  w-32  "
                      @click="cancelEditComment(comment)"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
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
import { getAuth } from "firebase/auth";

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
    const auth = getAuth();
    const user = auth.currentUser;
    const comment = reactive({
      commentTitle: "",
      userId: user ? user.uid : null,
      createdAt: now,
      updatedAt: now,
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
      // Console log the post.comments data
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
          userId: comment.userId,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
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

        const commentIndex = comments.findIndex(
          (comment) => comment.id === commentId
        );

        if (commentIndex !== -1) {
          comments.splice(commentIndex, 1);

          // Update the comments in Firestore
          await updateDoc(postRef, {
            comments: comments,
          });
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    };

    const editCommentInput = (comment) => {
      comment.isEditing = true;
      comment.originalCommentTitle = comment.commentTitle;
    };

    const updateCommentInput = (comment, value) => {
      comment.commentTitle = value;
    };

    const cancelEditComment = (comment) => {
      comment.isEditing = false;
      comment.commentTitle = comment.originalCommentTitle;
    };

    const saveComment = async (postId, comment) => {
      try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        const postData = postSnap.data();
        const comments = postData.comments || [];

        const commentIndex = comments.findIndex((c) => c.id === comment.id);

        if (commentIndex !== -1) {
          comments[commentIndex].commentTitle = comment.commentTitle;

          // Update the comments in Firestore
          await updateDoc(postRef, {
            comments: comments,
          });

          comment.isEditing = false;
        }
      } catch (error) {
        console.error("Error updating comment:", error);
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
      editCommentInput,
      updateCommentInput,
      cancelEditComment,
      saveComment,
    };
  },
};
</script>

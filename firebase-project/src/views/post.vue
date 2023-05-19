<template>
  <div>
    <div
      class="w-4/5 h-full mb-4 mt-5 sm:mx-auto sm:w-3/4 2xl:w-2/5 2xl:h-full mx-auto rounded-3 bg-customBg pt-10 rounded-9 shadow-white pb-15 box-border"
    >
      <h1
        class="text-headColor tracking-widest text-base sm:text-lg md:text-2xl"
      >
        POST
      </h1>
      <Form class="w-3/4 mx-auto" @submit="handlePost">
        <label class="flex text-white mt-3 mb-1 text-lg">Title</label>
        <Field
          class="w-full border-solid outline-none tracking-wider p-2 text-sm md:text-base lg:text-lg"
          v-model="post.title"
          name="title"
          type="title"
          placeholder="Title"
          :rules="validateTitle"
        />
        <ErrorMessage class="flex text-red-500 mt-0.5" name="title" />
        <label class="flex text-white mt-3 mb-1 text-lg">Photo</label>
        <Field
          class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
          v-model="post.photo"
          name="photo"
          type="file"
          placeholder="Photo"
          :rules="validatePhoto"
        />
        <ErrorMessage class="flex text-red-500 mt-0.5" name="photo" />

        <label class="flex text-white mt-3 mb-1 text-lg">Description</label>
        <Field
          class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
          :name="'description'"
          :type="'textarea'"
          :rules="validateDescription"
          v-slot="{ field }"
        >
          <textarea
            class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
            v-bind="field"
            v-model="post.description"
          ></textarea>
        </Field>

        <ErrorMessage class="flex text-red-500 mt-0.5" name="description" />

        <label class="flex text-white mt-3 mb-1 text-lg">Tagged User</label>
        <div class="flex items-center">
          <input
            class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
            v-model="post.taggedUser"
            name="taggedUser"
            type="text"
            placeholder="Enter a username to search"
            @input="searchTaggedUsers"
            @keyup="getUsers(user)"
          />
        </div>
        <div
          v-if="errorMessage"
          class="flex items-center justify-between px-2 mt-1 bg-red-100 text-red-700"
        >
          {{ errorMessage }}
        </div>
        <ul
          v-if="showList"
          class="mt-1 shadow-md bg-white w-full grid grid-cols-1 grid-rows-auto gap-2"
        >
          <li
            class="text-left border-b border-gray-600 m-1"
            v-for="(user, index) in post.users"
            :key="index"
            :value="user"
            @click.prevent="addTaggedUser(user)"
          >
            {{ user.firstName }}
          </li>
        </ul>

        <div class="flex flex-wrap mt-3">
          <span
            class="bg-gray-300 text-black py-1 px-2 rounded-lg text-lg text-sm mr-2 mb-2"
            v-for="(user, index) in post.taggedUsers"
            :key="index"
          >
            {{ user.firstName }}
            <i
              class="ml-2 fa fa-times cursor-pointer"
              @click.prevent="removeTaggedUser(index)"
            ></i>
          </span>
        </div>

        <label class="flex text-white mt-3 mb-1 text-lg">Comment</label>
        <Field
          class="w-full border-solid outline-none tracking-wider p-2 text-sm md:text-base lg:text-lg"
          v-model="post.comments"
          name="comments"
          type="comments"
          placeholder="comment"
          :rules="validateComment"
          @click.prevent="addComment"
        />
        <ErrorMessage class="flex text-red-500 mt-0.5" name="comments" />
        <span v-if="isLoading">
          <i class="fa fa-spinner fa-spin text-2xl text-white mt-1"></i>
        </span>
        <div>
          <div v-if="error" class="flex text-red-500 mt-0.5">{{ error }}</div>
          <button
            class="w-full h-45 bg-buttonBg mt-3 mb-3 border-0 tracking-wider p-2 md:text-base lg:text-lg mb-6"
          >
            ADD POST
          </button>
        </div>
      </Form>
    </div>
   <div class="ajdustToast">
      <successToast v-if="isSubmitted">
        <template v-slot:postContent>Create Post Successfully</template>
      </successToast>
    </div>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { validationErr } from "../composables/validation.js";
import { getAuth } from "firebase/auth";
import { ref, reactive } from "vue";
import successToast from "../components/successToast.vue"
import { uploadPostPhoto } from "../composables/firebase-storage.js";
import { useRouter } from "vue-router";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
export default {
  name: "post-page",
  components: {
    Form,
    Field,
    ErrorMessage,
    successToast
  },
  setup() {
    const post = reactive({
      title: "",
      photo: "",
      description: "",
      taggedUser: "",
      taggedUsers: [],
      searchedUsers: [],
      users: [],
      comments: [],
    });
    const errorMessage = ref(null);
    const showList = ref(false);
    const error = ref(null);
    const isSubmitted = ref(false);
    const isLoading = ref(false);
    const router = useRouter();
    // Function to generate a unique slug based on the post title
    const generateSlug = (title) => {
      const slug = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      return slug + "-" + Math.floor(Math.random() * 1000);
    };

    const getUsers = async () => {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const userData = query(
          usersRef,
          where("firstName", "==", post.taggedUser)
        );
        const usersSnap = await getDocs(userData);
        const usersData = usersSnap.docs.map((doc) => doc.data());
        post.users = usersData;
      } catch (error) {
        console.log(error);
      }
    };
    const searchTaggedUsers = async () => {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const userData = query(
          usersRef,
          where("firstName", "==", post.taggedUser)
        );
        const snapshot = await getDocs(userData);

        if (snapshot.empty) {
          post.searchedUsers = [];
          errorMessage.value = "User not found";
        } else {
          post.searchedUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          errorMessage.value = "";
        }

        if (post.taggedUser) {
          showList.value = true;
        } else {
          showList.value = false;
        }
      } catch (error) {
        console.error(error);
      }
    };

    const addTaggedUser = async (uid) => {
      try {
        if (uid) {
          if (!post.taggedUsers.includes(uid)) {
            post.taggedUsers.push(uid);
          } else {
            errorMessage.value = "User already tagged";
            return;
          }

          post.taggedUser = "";
          showList.value = false;
        }
      } catch (error) {
        console.error(error);
      }
    };

    const removeTaggedUser = (index) => {
      post.taggedUsers.splice(index, 1);
    };

    const addComment = async (post) => {
      const db = getFirestore();
      const postsRef = collection(db, "posts");
      const postQuery = query(postsRef, where("uid", "==", post.uid));
      const postSnapshot = await getDocs(postQuery);

      if (!postSnapshot.empty) {
        const postDoc = postSnapshot.docs[0];
        const postRef = doc(postsRef, postDoc.id);

        await updateDoc(postRef, {
          commentTitle: post.commentTitle,
        });
      } else {
        console.log("Post not found");
      }
    };

    const handlePost = async () => {
      try {
        (isLoading.value = true), console.log("post", post);
        const db = getFirestore();
        const postsRef = collection(db, "posts");
        const now = new Date();
        const auth = getAuth();
        const user = auth.currentUser;
        if (post.title && post.photo) {
          const downloadURL = await uploadPostPhoto(user, post.photo);
          const slug = generateSlug(post.title);
          const newPostRef = await addDoc(postsRef, {
            title: post.title,
            slug: slug,
            photo: downloadURL,
            description: post.description,
            createdAt: now,
            updatedAt: now,
            updatedBy: user.uid,
            taggedUser: post.taggedUsers,
          });

          const postId = newPostRef.id;

          // Update the post with the generated ID
          await updateDoc(newPostRef, { uid: postId });

          isSubmitted.value = true;
          isLoading.value = false;
          router.push("/postList");
        }
      } catch (err) {
        console.log(err);
        error.value = err.message;
      }
    };

    return {
      ...validationErr(),
      post,
      error,
      handlePost,
      isSubmitted,
      showList,
      getUsers,
      addTaggedUser,
      searchTaggedUsers,
      removeTaggedUser,
      errorMessage,
      isLoading,
      addComment,
    };
  },
};
</script>

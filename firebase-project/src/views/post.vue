<template>
  <div
    class="w-4/5 h-full mb-4 sm:mx-auto sm:w-3/4 2xl:w-2/5 2xl:h-full mx-auto rounded-3 bg-customBg pt-10 rounded-9 shadow-white pb-15 box-border"
  >
    <h1 class="text-headColor tracking-widest text-base sm:text-lg md:text-2xl">
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
      <textarea
        class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
        v-model="post.description"
        name="description"
        type="text"
        :rules="validateDescription"
      />
      <ErrorMessage class="flex text-red-500 mt-0.5" name="description" />

      <label class="flex text-white mt-3 mb-1 text-lg">Tagged Users</label>
      <div class="relative">
        <div class="flex items-center">
          <input
            class="w-full border-solid border-gray-400 outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
            v-model="post.searchTerm"
            name="searchTerm"
            type="text"
            placeholder="Enter a user to search"
            @input="searchTaggedUsers"
          />
        </div>
      </div>
      <div class="relative">
        <select
          class="w-full border-solid border-gray-400 outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
        >
          <option v-for="(user, index) in post.searchedUsers" :key="index">
            {{ user.firstName }}
          </option>
        </select>
      </div>

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

      <!-- <label class="flex text-white mt-3 mb-1 text-lg">Tagged Users</label>
      <div class="flex items-center">
        <select
          class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
          v-model="post.selectedUser"
          @input="searchTaggedUsers"
        >
          <option value="">Select a user</option>
          <option
            v-for="(user, index) in userInfo.users"
            :key="index"
            :value="user"
          >
            {{ user.firstName }}
          </option>
        </select>
      </div>

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
      </div> -->

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
      <template v-slot:postContent>Added Post Successfully</template>
    </successToast>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { validationErr } from "../composables/validation.js";
import { getAuth } from "firebase/auth";
import { ref, reactive } from "vue";
import successToast from "../components/successToast.vue";
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
export default {
  name: "post-page",
  components: {
    Form,
    Field,
    ErrorMessage,
    successToast,
  },
  setup() {
    const post = reactive({
      title: "",
      photo: "",
      description: "",
      taggedUsers: [],
      searchTerm: "",
      searchedUsers: [],
    });

    const userInfo = reactive({
      users: "",
    });
    const showDropdown = ref(false);
    const error = ref(null);
    const isSubmitted = ref(false);
    // Function to generate a unique slug based on the post title
    const generateSlug = (title) => {
      const slug = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      return slug + "-" + Math.floor(Math.random() * 1000);
    };

    const fetchUsers = async () => {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const snapshot = await getDocs(usersRef);
        const users = [];
        snapshot.docs.map((doc) => {
          const user = doc.data();
          user.id = doc.id;
          users.push(user);
        });
        userInfo.users = users;
        console.log(userInfo.users);
      } catch (error) {
        console.log(error);
      }
    };

    const searchTaggedUsers = async () => {
      try {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("firstName", "==", post.searchTerm));
        const snapshot = await getDocs(q);
        post.searchedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (post.searchedUsers.length > 0) {
          post.taggedUsers.push(post.searchedUsers[0]);
          post.searchTerm = "";
          this.showDropdown = true;
        }
      } catch (error) {
        console.error(error);
        // handle error here (show error message to user, etc.)
      }
    };

    const removeTaggedUser = (index) => {
      post.taggedUsers.splice(index, 1);
    };

    const handlePost = async (post) => {
      try {
        const db = getFirestore();
        const postsRef = collection(db, "posts");
        const now = new Date();
        const auth = getAuth();
        const user = auth.currentUser;
        if (post.title && post.photo && post.description) {
          const slug = generateSlug(post.title);
          await addDoc(postsRef, {
            title: post.title,
            slug: slug,
            photo: `${post.photo}`,
            description: post.description,
            createdAt: now,
            updatedAt: now,
            updatedBy: user.uid,
          });
          isSubmitted.value = true;
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
      searchTaggedUsers,
      removeTaggedUser,
      userInfo,
      fetchUsers,
      showDropdown,
    };
  },
};
</script>

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
      <Field
        class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
        v-model="post.description"
        name="description"
        type="textarea"
        :rules="validateDescription"
      />
      <ErrorMessage class="flex text-red-500 mt-0.5" name="description" />
      <label class="flex text-white mt-3 mb-1 text-lg">Tagged Users</label>
      <div class="flex items-center">
        <input
          class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
          v-model="post.taggedUser"
          name="taggedUser"
          type="text"
          placeholder="Enter a username to tag"
        />

        <button
          class="w-16 h-12 bg-buttonBg ml-2 text-white rounded text-slate-600"
          @click.prevent="addTaggedUser(post)"
        >
          ADD
        </button>
      </div>
      <div class="flex flex-wrap mt-3">
        <span
          class="bg-gray-300 text-black py-1 px-2 rounded-lg text-lg text-sm mr-2 mb-2"
          v-for="(user, index) in post.taggedUsers"
          :key="index"
        >
          {{ user }}
          <i
            class="ml-2 fa fa-times cursor-pointer"
            @click.prevent="removeTaggedUser(index)"
          ></i>
        </span>
      </div>

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
import { getFirestore, addDoc, collection } from "firebase/firestore";

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
      taggedUser: "",
      taggedUsers: [],
    });

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

    const addTaggedUser = async (post) => {
      try {
        

        if (post.taggedUser) {
          if (!post.taggedUsers.includes(post.taggedUser)) {
            post.taggedUsers.push(post.taggedUser);
          }
          post.taggedUser = "";
          console.log(post.taggedUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const removeTaggedUser = () => {};

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
      addTaggedUser,
      removeTaggedUser,
    };
  },
};
</script>

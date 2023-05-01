<template>
  <div
    class="w-4/5 h-full sm:mx-auto sm:w-3/4 2xl:w-2/5 2xl:h-full mx-auto rounded-3 bg-customBg pt-10 rounded-9 shadow-white pb-15 box-border"
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
      <label class="flex text-white mt-3 mb-1 text-lg">Slug</label>
      <Field
        class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
        v-model="post.slug"
        name="slug"
        type="text"
        placeholder="Slug"
        :rules="validateSlug"
      />
      <ErrorMessage class="flex text-red-500 mt-0.5" name="slug" />

      <label class="flex text-white mt-3 mb-1 text-lg">Description</label>
      <Field
        class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
        v-model="post.description"
        name="description"
        type="text"
        placeholder="Description"
        :rules="validateDescription"
      />
      <ErrorMessage class="flex text-red-500 mt-0.5" name="description" />
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
      <template v-slot:postContent>Created Post Successfully</template>
    </successToast>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { validationErr } from "../composables/validation.js";
import { useStore } from "vuex";
import { ref, reactive } from "vue";
import successToast from "../components/successToast.vue";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

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
      slug: "",
      description: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: "",
    });
    const error = ref(null);
    const store = useStore();
    const isSubmitted = ref(false);

    const handlePost = async () => {
      try {
        // login the user with Firebase Authentication
        await store.dispatch("addPost", {
          title: post.title,
          photo: post.photo,
          slug: post.slug,
          description: post.description,
        });
        // Save the post collection in firebase collection
        const db = getFirestore();
        if (post.uid) {
          const postRef = doc(collection(db, "users"), post.uid);
          await setDoc(postRef, {
            title: `${post.title}`,
            photo: `${post.photo}`,
            slug: `${post.slug}`,
            description: `${post.description}`,
          });
        }
        isSubmitted.value = true;
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
    };
  },
};
</script>

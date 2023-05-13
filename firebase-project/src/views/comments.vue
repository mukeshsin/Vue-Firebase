<template>
  <div class="bg-gray-200 min-h-screen">
    <div class="max-w-3xl mx-auto py-10">
      <div class="w-full bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-2xl font-bold mb-4">Comment</h1>
        <Form class="w-full" @submit.prevent="addComment">
          <div class="flex flex-col mb-4">
            <label class="flex text-gray-700 font-bold mb-2" for="commentTitle">
              Add Comment:
            </label>
            <Field
              class="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="commentTitle"
              type="text"
              placeholder="Comment Title"
              :rules="validateCommentTitle"
              v-model="comment.commentTitle"
            />
            <ErrorMessage
              class="text-red-500 text-sm mt-1"
              name="commentTitle"
            />
          </div>
          <button
            type="submit"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Add Comment
          </button>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { validationErr } from "../composables/validation.js";
import { reactive } from "vue";

export default {
  name: "CommentBox",
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  setup() {
    const comment = reactive({
      commentTitle: "",
    });

    return {
      comment,

      validationErr,
    };
  },
};
</script>

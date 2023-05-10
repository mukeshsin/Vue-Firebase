<template>
  <div>
    <h1>This is postList</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <h1>{{ post.title }}</h1>
        <div>{{ post.photo }}</div>
        <div>{{ post.description }}</div>
        <div>{{ post.taggedUser }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { ref } from "vue";

export default {
  name: "post-list",

  setup() {
    const db = getFirestore();
    const postsRef = collection(db, "posts");
    const posts = ref([]);

    const getAllPost = async () => {
      const querySnapshot = await getDocs(postsRef);
      querySnapshot.forEach((doc) => {
        const post = {
          id: doc.id,
          ...doc.data(),
        };
        posts.value.push(post);
      });
    };

    getAllPost();

    // Listen for changes to the "posts" collection in real-time
    onSnapshot(postsRef, (querySnapshot) => {
      posts.value = [];
      querySnapshot.forEach((doc) => {
        const post = {
          id: doc.id,
          ...doc.data(),
        };
        posts.value.push(post);
      });
    });

    return {
      posts,
    };
  },
};
</script>

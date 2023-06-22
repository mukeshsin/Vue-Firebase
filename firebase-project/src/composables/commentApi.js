import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, reactive, watchEffect } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const functions = () => {
  const db = getFirestore();
  const now = new Date();
  const auth = getAuth();

  const user = ref(null);

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });

  const comment = reactive({
    commentTitle: "",
    userId: null,

    createdAt: now.toISOString().split("T")[0], // Get the date in 'YYYY-MM-DD' format,
    updatedAt: now.toISOString().split("T")[0], // Get the date in 'YYYY-MM-DD' format
  });

  watchEffect(() => {
    if (user.value) {
      comment.userId = user.value.uid; // Update the userId when user changes
    } else {
      comment.userId = null;
    }
  });

  const showInput = ref(false);

  const handleAddComment = (postId) => {
    showInput.value = postId;
  };

  const submitComment = async () => {
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
    comment,
    editCommentInput,
    updateCommentInput,
    cancelEditComment,
    saveComment,
    deleteComment,
    submitComment,
    handleAddComment,
    showInput,
  };
};

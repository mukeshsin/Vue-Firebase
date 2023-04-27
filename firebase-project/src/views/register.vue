<template>
  <div
    class="w-4/5 h-full sm:mx-auto sm:w-3/4 2xl:w-2/5 2xl:h-full mx-auto rounded-3 bg-customBg pt-10 rounded-9 shadow-white pb-15 box-border mb-3"
  >
    <h1 class="text-headColor tracking-widest text-sm sm:text-lg md:text-2xl">
      REGISTRATION FORM
    </h1>
    <Form class="w-3/4 mx-auto" @submit="handleSubmit">
      <div class="flex">
        <div class="w-1/2 pr-2">
          <label class="flex text-white mt-4 mb-1 text-lg">First name</label>
          <Field
            class="w-full border-solid outline-none text-base tracking-wider p-2 text-sm md:text-base lg:text-lg"
            v-model="user.firstName"
            name="firstName"
            type="firstName"
            placeholder="First name"
            :rules="validateFirstName"
          />
          <ErrorMessage class="flex text-red-500 mt-0.5" name="firstName" />
        </div>
        <div class="w-1/2 pl-2">
          <label class="flex text-white mt-4 mb-1 text-lg">Last name</label>
          <Field
            class="w-full border-solid outline-none tracking-wider p-2 text-sm md:text-base lg:text-lg"
            v-model="user.lastName"
            name="lastName"
            type="lastName"
            placeholder="Last name"
            :rules="validateLastName"
          />
          <ErrorMessage class="flex text-red-500 mt-0.5" name="lastName" />
        </div>
      </div>

      <label class="flex text-white mt-3 mb-1 text-lg">Mobile Number</label>
      <Field
        class="w-full border-solid outline-none tracking-wider p-2 text-sm md:text-base lg:text-lg"
        v-model="user.mobileNumber"
        name="mobileNumber"
        type="number"
        placeholder="Mobile Number"
        :rules="validateMobileNumber"
      />
      <ErrorMessage class="flex text-red-500 mt-0.5" name="mobileNumber" />
      <label class="flex text-white mt-3 mb-1 text-lg">Profile Photo</label>
      <Field
        class="w-full border-solid outline-none tracking-wider bg-white p-2 text-sm md:text-base lg:text-lg"
        v-model="user.profilePhoto"
        name="profilePhoto"
        type="file"
        placeholder="Profile photo"
        :rules="validateProfilePhoto"
      />
      <ErrorMessage class="flex text-red-500 mt-0.5" name="profilePhoto" />
      <label class="flex text-white mt-3 mb-1 text-lg">Email</label>
      <Field
        class="w-full border-solid outline-none tracking-wider p-2 text-sm md:text-base lg:text-lg"
        v-model="user.email"
        name="email"
        type="email"
        placeholder="Email"
        :rules="validateEmail"
      />
      <ErrorMessage class="flex text-red-500 mt-0.5" name="email" />
      <label class="flex text-white mt-3 mb-1 text-lg">Password</label>
      <Field
        class="w-full border-solid outline-none tracking-wider p-2 text-sm md:text-base lg:text-lg"
        v-model="user.password"
        name="password"
        type="password"
        placeholder="Password"
        :rules="validatePassword"
      />
      <ErrorMessage class="flex text-red-500 mt-0.5" name="password" />

      <label class="flex text-white mt-3 mb-1 text-lg">Confirm Password</label>
      <Field
        class="w-full border-solid outline-none text-base tracking-wider p-2 text-sm md:text-base lg:text-lg"
        v-model="user.confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        :rules="validateConfirmPassword"
      />

      <ErrorMessage class="flex text-red-500 mt-0.5" name="confirmPassword" />
      <span v-if="isLoading">
        <i class="fa fa-spinner fa-spin text-lg text-white mt-1"></i>
      </span>
      <div>
        <div v-if="error" class="flex text-red-500 mt-0.5">{{ error }}</div>
        <button
          class="w-full h-45 bg-buttonBg mt-3 mb-6 border-0 tracking-wider p-2 md:text-base lg:text-lg"
        >
          REGISTER NOW
        </button>
      </div>
    </Form>
  </div>
  <div class="ajdustToast">
    <successToast v-if="isSubmitted">
      <template v-slot:content>You have successfully registered</template>
    </successToast>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { reactive, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { validationErr } from "../composables/validation.js";
import successToast from "../components/successToast.vue";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { getStorage, uploadBytes } from "firebase/storage";

export default {
  name: "register-page",
  components: {
    Form,
    Field,
    ErrorMessage,
    successToast,
  },
  setup() {
    const user = reactive({
      email: "",
      password: "",
      mobileNumber: "",
      firstName: "",
      lastName: "",
      profilePhoto: "",
      confirmPassword: "",
    });

    const error = ref(null);
    const store = useStore();
    const router = useRouter();
    const isLoading = ref(false);
    const isSubmitted = ref(false);

    //errors
    const signUpErr = ref("");
    const signupError = computed(() => {
      return store.state.signupError;
    });
    const signErr = computed(() => {
      return store.state.signErr;
    });

    const validateConfirmPassword = (confirmPassword, password) => {
      //if the field is empty
      if (!confirmPassword) {
        return "This field is required";
      }
      // If passwords do not match
      if (confirmPassword !== user.password) {
        return "Passwords do not match";
      }

      console.log(password);
      console.log(confirmPassword);

      return true;
    };

    const handleSubmit = async () => {
      try {
        // Register the user with Firebase Authentication
        signupError.value = "";
        isLoading.value = true;
        const res = await store.dispatch("signup", {
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          mobileNumber: user.mobileNumber,
          profilePhoto: user.profilePhoto,
          confirmPassword: user.confirmPassword,
        });

        if (res && res.user) {
          // check if res and res.user exists
          const auth = getAuth();
          // Upload the photo to Firebase Storage
          const storage = getStorage();
          const storageRef = ref(
            storage,
            `users/${res.user.uid}/${user.profilePhoto.name}`
          );
          console.log(user);
          await uploadBytes(storageRef, user.profilePhoto);

          // Update the user's detail with update user
          await updateProfile(auth.currentUser, {
            displayName: `${user.firstName} ${user.lastName}`,
            phoneNumber: `${user.mobileNumber}`,
            photoURL: `${user.profilePhoto}`,
          });

          // Save the user's first name, last name, and photo URL to the database
          const db = getFirestore();
          const userRef = doc(collection(db, "users"), res.user.uid);
          await setDoc(userRef, {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.mobileNumber,
          });
        } else {
          throw new Error("signup unsuccessfully");
        }

        if (!signupError.value && !signErr.value) {
          isSubmitted.value = true;
          setTimeout(() => {
            router.replace({ path: "/login" });
            isLoading.value = false;
          }, 3000);
        } else {
          isLoading.value = false;
          signupError.value = "Email already exists. Try something else";
        }
      } catch (err) {
        console.log(err);
        error.value = err.message;
      }
    };

    return {
      user,
      handleSubmit,
      error,
      isLoading,
      validateConfirmPassword,
      ...validationErr(),
      signUpErr,
      signErr,
      isSubmitted,
    };
  },
};
</script>

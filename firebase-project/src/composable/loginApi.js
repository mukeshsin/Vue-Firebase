import { reactive } from "vue";
// import { useRouter } from "vue-router";
// import { useStore } from "vuex";

export default function loginApi() {
//   const store = useStore();
//   const router = useRouter();

  const userData = reactive({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    photo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  return userData;
}

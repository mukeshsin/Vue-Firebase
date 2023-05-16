import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/register",
    name: "register-page",
    component: () =>
      import(/* webpackChunkName: "registerPage" */ "../views/register.vue"),
  },
  {
    path: "/login",
    name: "login-page",
    component: () =>
      import(/* webpackChunkName: "loginPage" */ "../views/login.vue"),
  },

  {
    path: "/post",
    name: "post-page",
    component: () =>
      import(/* webpackChunkName: "postPage" */ "../views/post.vue"),
  },

  {
    path: "/postList",
    name: "post-list",
    component: () =>
      import(/* webpackChunkName: "postListPage" */ "../views/postList.vue"),
  },

  {
    path: "/post/:postId",
    name: "singlePost",
    component: () =>
      import(
        /* webpackChunkName: "singlePost" */ "../views/singlePostList.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;

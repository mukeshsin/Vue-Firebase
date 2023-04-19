import { createRouter, createWebHashHistory } from "vue-router";
import homeView from "../views/homeView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/home",
    name: "home-view",
    component: homeView,
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
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;

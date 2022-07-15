import Vue from "vue";
import VueRouter from "vue-router";
import viewDashboard from "@/views/mainContent";
import mainUploader from "../components/mainUploader";
import feed from "../components/feed";
import registration from "../views/registration";
import { auth } from "../firebase.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/upload",
    name: "upload",
    component: mainUploader,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/",
    name: "Dashboard",
    component: viewDashboard,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/feed",
    name: "Feed",
    component: feed,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/about.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/registration",
    name: "registration",
    component: registration,
  },
];

const router = new VueRouter({
  routes,
  mode: "history",
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(route => route.meta.requiresAuth);
  requiresAuth && !auth.currentUser ? next("/registration") : next();
});

export default router;

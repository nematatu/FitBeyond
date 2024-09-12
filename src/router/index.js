import { createRouter, createWebHashHistory } from "vue-router";
import Reservation from "../views/Reservation.vue";
import Login from "../views/Login.vue";
import Confirm from "../views/Confirm.vue";
import Community from "../views/Community.vue";
import Post from "../views/Post.vue";
import RecommendBefore from "../views/RecommendBefore.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Reservation",
      component: Reservation,
      meta: {
        title: "Reservation",
      },
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        title: "Login",
      },
    },
    {
      path: "/confirm",
      name: "Confirm",
      component: Confirm,
      meta: {
        title: "Confirm",
      },
    },
    {
      path: "/community",
      name: "Community",
      component: Community,
      meta: {
        title: "Community",
      },
    },
    {
      path: "/post",
      name: "Post",
      component: Post,
      meta: {
        title: "Post",
      },
    },
    {
      path: "/recommendBefore",
      name: "RecommendBefore",
      component: RecommendBefore,
      meta: {
        title: "RecommendBefore",
      },
    },
  ],
});

const DEFAULT_TITLE = "TITLE";

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE;
});

export default router;

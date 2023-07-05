import {
  createRouter as _createRouter,
  createWebHistory,
  createMemoryHistory,
  RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/home/index.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/pages/about/index.vue"),
  },
  {
    path: "/article/:articleId",
    name: "aboutArticleId",
    component: () => import("@/pages/article/index.vue"),
    meta: {
      diffed: true,
    },
  },
];

export const createRouter = () => {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });
};

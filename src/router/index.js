import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../views/Home.vue")
  },

  {
    path: "/tasks",
    component: () => import("../components/tasks/taskList.vue")
  },

  {
    path: "/createTask",
    component: () => import("../components/tasks/taskForm.vue")
  },


  {
    path: "/updateTask",
    component: () => import("../components/tasks/taskForm.vue")
  },

  {
    path: "/editTask/:id",
    component: () => import("../components/tasks/taskForm.vue")
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
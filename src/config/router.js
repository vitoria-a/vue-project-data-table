import { createRouter, createWebHistory } from 'vue-router';
import ProductManagement from '../pages/ProductManagement';

const routes = [
  {
    path: '/',
    name: 'productManagement',
    component: ProductManagement
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
import { createRouter, createWebHistory } from 'vue-router';
import ProductManagement from '../pages/ProductManagement';
import ProductDetails from '../pages/ProductDetails';

const routes = [
  {
    path: '/',
    name: 'productManagement',
    component: ProductManagement
  },
  {
    path: '/:id/details',
    name: 'productDetails',
    component: ProductDetails,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
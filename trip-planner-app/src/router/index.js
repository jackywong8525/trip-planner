import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '@/auth/AuthService';
import HomeView from '@/views/HomeView.vue';
import TripPlannerMain from '@/views/TripPlannerMain.vue';
import RegisterView from '@/views/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
      // redirect: (to) => {
      //   return AuthService.getCurrentUser() !== undefined ? '/main' : '/';
      // }  
    },
    {
      path: '/home',
      redirect: '/'
    },
    {
      path: '/about',
      name: 'about'
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/main',
      name: 'main',
      component: TripPlannerMain,
      children: [
        { 
          path: 'trips',
          name: 'trips'
        },
        { 
          path: 'settings',
          name: 'settings'
        }
      ],
      meta: {
        requiresAuth: true
      }
    }
  ],
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '@/auth/AuthService';
import HomeView from '@/views/HomeView.vue';
import RegisterView from '@/views/RegisterView.vue';

import TripPlannerAppContainer from '@/views/TripPlannerAppContainer.vue';
import TripPlannerMainView from '@/views/TripPlannerMainView.vue';
import TripPlannerEditView from '@/views/TripPlannerEditView.vue';

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
      component: TripPlannerAppContainer,
      children: [
        {
          path: 'home',
          name: 'main-home',
          component: TripPlannerMainView
        },
        { 
          path: 'owned-trips',
          name: 'main-ownedTrips'
        },
        { 
          path: 'settings',
          name: 'main-settings'
        },
        {
          path: ':tripId',
          name: 'main-edit-trip',
          component: TripPlannerEditView,
          children: [
            {
              path: 'trip-info',
              name: 'tripInfo'
            },
            {
              path: 'trip-checklist',
              name: 'tripChecklist'
            },
            {
              path: 'trip-schedule',
              name: 'tripSchedule'
            }
          ]
        }
      ],
      meta: {
        requiresAuth: true
      }
    }
  ],
});

export default router;

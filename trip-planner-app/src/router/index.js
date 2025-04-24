import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '@/auth/AuthService';
import HomeView from '@/views/HomeView.vue';
import RegisterView from '@/views/RegisterView.vue';

import TripPlannerAppContainer from '@/views/TripPlannerAppContainer.vue';
import TripPlannerMainView from '@/views/TripPlannerMainView.vue';
import TripPlannerEditView from '@/views/TripPlannerEditView.vue';
import TripPlannerEditTripInfoView from '@/views/TripPlannerEditTripInfoView.vue';
import TripPlannerEditTripChecklistView from '@/views/TripPlannerEditTripChecklistView.vue';

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
              name: 'main-edit-trip-info',
              component: TripPlannerEditTripInfoView
            },
            {
              path: 'trip-checklist',
              name: 'main-edit-trip-checklist',
              component: TripPlannerEditTripChecklistView
            },
            {
              path: 'trip-schedule',
              name: 'main-edit-trip-schedule'
            }
          ]
        }
      ],
      meta: {
        requiresAuth: true
      },
    }
  ],
});

export default router;

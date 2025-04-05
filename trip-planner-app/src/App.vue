<template>
  <header class="app-header">
    <NavBar v-if="!loginStatus" />
    <TripPlannerNavBar v-else></TripPlannerNavBar>
  </header>

  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/navbar/NavBar.vue'
import TripPlannerNavBar from './components/navbar/TripPlannerNavBar.vue';
import AuthService from './auth/AuthService';

export default {
  components: {
    NavBar,
    TripPlannerNavBar
  },
  inject: ['$bus'],
  created() {
    this.$bus.$on('login-successful', this.toggleLoginStatus);
    this.$bus.$on('logout-successful', this.toggleLoginStatus);
  },
  data() {
    return {
      loginStatus: AuthService.getCurrentUser() ? true : false
    }
  },
  methods: {
    toggleLoginStatus(loginStatus) {
      this.loginStatus = loginStatus;
    }
  }
}
</script>

<style scoped>
.app-header{
  position: sticky;
  top: 0;
  z-index: 98;
}
</style>

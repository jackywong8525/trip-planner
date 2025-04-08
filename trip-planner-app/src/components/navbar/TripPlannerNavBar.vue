<template>
  <ul class="navbar">
    <li class="navbar-list-item"><img class="navbar-logo" src="/images/logo.png" alt=""></li>
    <li class="navbar-list-item">
      <RouterLink 
        class="navbar-router-link" 
        :to="'/main/home'"
        active-class="active-link"
        >Home
      </RouterLink>
    </li>
    <li class="navbar-list-item">
      <RouterLink 
        class="navbar-router-link" 
        :to="'/main/trips'"
        active-class="active-link"
        >My Trips
      </RouterLink>
    </li>
    <li class="navbar-list-item">
      <RouterLink 
        class="navbar-router-link"
        active-class="active-link" 
        :to="'/main/settings'"
      >Settings</RouterLink>
    </li>
    <li class="navbar-list-item">
      <RouterLink 
        class="navbar-router-link" 
        :to="'/'"
        @click="signOut"
        >Sign Out
      </RouterLink>
    </li>
  </ul>
</template>

<script>
import AuthService from '@/auth/AuthService';

export default {
  inject: ['$bus'],
  methods: {
    signOut() {
      AuthService.logout();

      this.$bus.$emit('logout-successful', false);

      this.$router.push({ path: '/' });
    }
  }
}
</script>

<style scoped>

.navbar {
  /* Box and Size Propeties */
  margin: 0px;
  padding: 0px 10px;

  /* Display */
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;

  /* Additional Styling */
  list-style-type: none;
  
  /* Colors */
  background-color: var(--MAIN-THEME-COLOR);
}

.navbar-logo {
  /* Box and Size Properties */
  width: 45px;
  margin: 0px 10px;

  /* Additional Styling */
  border-radius: 5px;
}

.navbar-router-link {
  /* Display */
  display: flex;
  align-items: center;
  
  /* Text */
  text-decoration: none;
  font-size: var(--FS-CONTENT);
  color: var(--SUPP-FONT-COLOR-LIGHT);

  /* Colors */
  background-color: var(--MAIN-THEME-COLOR);

  /* Box and Size Properties */
  padding: 20px 10px;
}

.active-link {
  background-color: var(--BACKUP-COLOR-LIGHT);
  color: var(--SUPP-FONT-COLOR-DARK)
}

</style>

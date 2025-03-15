import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "@/assets/main.css"
import AuthService from './auth/AuthService'
import $bus from '@/utils/Events.js'

const app = createApp(App);

router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => {
        return record.meta.requiresAuth;
    })

    if(requiresAuth && !AuthService.getCurrentUser()){
        next({path: '/', replace: true});
    }

    else{
        next();
    }
});

app.use(router);

app.provide('$bus', $bus);

app.mount('#app');

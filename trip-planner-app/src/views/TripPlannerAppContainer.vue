<template>

<AlertComponent
    v-if="alertEmitted"
    :alert-type="alert.alertType"
    :message="alert.message"
    :is-visible="alertEmitted"
></AlertComponent>

<RouterView
    :trip="activeTrip" 
    :active-user="activeUser"   
/>

</template>

<script setup>
import { ref, inject, onMounted } from 'vue'; 
import { useRouter } from 'vue-router';
import AlertComponent from '@/components/alert/AlertComponent.vue';
import { API_URL } from '@/utils/backendConnection';
import AuthService from '@/auth/AuthService';

const router = useRouter();
const $bus = inject('$bus');

const activeTrip = ref({});
const alertEmitted = ref(false);
const alert = ref();
const activeUser = ref({});

$bus.$on('switch-page', switchPage);
$bus.$on('emit-alert', showAlert);

onMounted(async () => {
    await getActiveUser();
})

async function getActiveUser() {
    const response = await fetch(API_URL + '/user/get-active-user', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getCurrentUser()}`
        },
        body: JSON.stringify({
            token: AuthService.getCurrentUser()
        })
    });

    const responseObj = await response.json();
    activeUser.value = responseObj.user;
}


function switchPage(pageObject) {

    if(pageObject.name === 'main-home'){
        activeTrip.value = {};
        return router.push({ name: pageObject.name });
    }

    activeTrip.value = pageObject.trip;

    return router.push({
        name: pageObject.name,
        params: {
            tripId: pageObject.trip._id
        }
    });
}

function showAlert(alertObject){
    alert.value = alertObject;
    alertEmitted.value = true;

    let alertTime;

    if(alertTime){
        clearTimeout(alertTime);
    }
    
    alertTime = setTimeout(() => {
        $bus.$emit('hide-alert');

        setTimeout(() => {
            alertEmitted.value = false;
        }, 1000)
    }, 10000);
}
</script>

<style scoped>

</style>
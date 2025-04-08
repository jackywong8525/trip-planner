<template>

<AlertComponent
    v-if="alertEmitted"
    :alert-type="alert.alertType"
    :message="alert.message"
    :is-visible="alertEmitted"
></AlertComponent>

<RouterView
    :trip="activeTrip"    
/>

</template>

<script setup>
import { ref, inject } from 'vue'; 
import { useRouter } from 'vue-router';
import AlertComponent from '@/components/alert/AlertComponent.vue';

const router = useRouter();
const $bus = inject('$bus');

const activeTrip = ref({});
const alertEmitted = ref(false);
const alert = ref();

$bus.$on('switch-page', switchPage);
$bus.$on('emit-alert', showAlert);


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
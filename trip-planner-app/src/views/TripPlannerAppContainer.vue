<template>

<RouterView
    :trip="activeTrip"    
/>

</template>

<script setup>
import { ref, inject } from 'vue'; 
import { useRouter } from 'vue-router';
const router = useRouter();
const $bus = inject('$bus');

const activeTrip = ref({});

$bus.$on('switch-page', switchPage);


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
</script>

<style scoped>

</style>
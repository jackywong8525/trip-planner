<template>
    <ul class="trip-planner-navbar">
        <router-link
            :to="`/main/${props.trip._id}/trip-info`">
            Trip Information
        </router-link>
        <router-link
            :to="`/main/${props.trip._id}/trip-checklist`">
            Trip Checklist
        </router-link>
        <router-link
            :to="`/main/${props.trip._id}/trip-schedule`">
            Trip Schedule
        </router-link>
    </ul>

    <div>{{props.trip.name}}</div>

    <RouterView />
</template>

<script setup>
import { ref, inject } from 'vue';

const $bus = inject('$bus');

const props = defineProps({
    trip: {
        type: Object,
        required: true
    }
});

</script>

<style scoped>

</style>
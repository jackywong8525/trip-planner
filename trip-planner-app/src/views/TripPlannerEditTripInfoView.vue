<template>

<div class="edit-trip-info-container">
    <div class="edit-trip-info-header">
        <div class="edit-trip-info-trip-name">
            {{ props.activeTrip.name }}
        </div>
        <div    
            class="edit-trip-info-trip-created-date">
            created at {{ props.activeTrip.createdAt.slice(0, 10) }}
        </div>
    </div>
    <div class="edit-trip-info-content">
        <div class="edit-trip-info-trip-location-label">
            <img 
                class="edit-trip-info-trip-location-icon"
                src="/icons/location-icon.png">
            Location: 
        </div>
        <div class="edit-trip-info-trip-location-value">
            {{ props.activeTrip.location }}
        </div>
        <div class="edit-trip-info-trip-date-label">
            <img 
                class="edit-trip-info-trip-date-icon"
                src="/icons/calendar-icon.png">
            Date:
        </div>
        <div class="edit-trip-info-trip-date-value">
            {{ props.activeTrip.startDate }} - {{ props.activeTrip.endDate }}
        </div>
        <div class="edit-trip-info-trip-people-label">
            <img 
                class="edit-trip-info-trip-people-icon"
                src="/icons/user-icon.png">
            User: 
        </div>
        <div class="edit-trip-info-trip-people-value">
            {{ tripPeopleString }}
        </div>
    </div>
</div>

</template>

<script setup>

import { ref, onMounted, computed, inject } from 'vue';
import { loadTripPeople } from '@/utils/Trip';
import AuthService from '@/auth/AuthService';

const $bus = inject('$bus');

const activeUser = ref({});
const tripPeople = ref(['you']);
const tripPeopleString = computed(() => {
    return tripPeople.value.join(', ');
})

const props = defineProps({
    activeTrip: {
        type: Object,
        required: true
    }
})

onMounted(async () => {
    await getActiveUser();
    await setTripPeople();
})

async function getActiveUser(){
    activeUser.value = await AuthService.getCurrentUserInfo();
}

async function setTripPeople(){
    const usernames = await loadTripPeople(props.activeTrip, activeUser.value);
    if(usernames.length > 0){
        tripPeople.value.push(...usernames);
    }
}

</script>

<style scoped>

.edit-trip-info-container {
    display: grid;
    grid-template-rows: 1fr 2fr;
    padding: 10px;
}

.edit-trip-info-header,
.edit-trip-info-content {
    margin: 10px;
}

.edit-trip-info-trip-name {
    font-size: 3rem;
    font-weight: 600;
    margin: 10px 20px 0px 20px
}

.edit-trip-info-trip-created-date {
    margin: 0px 20px 10px 20px
}

.edit-trip-info-content {
    display: grid;
    grid-template-columns: 150px 1fr;
    margin: 20px;
}

.edit-trip-info-trip-location-label,
.edit-trip-info-trip-date-label,
.edit-trip-info-trip-people-label {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.edit-trip-info-trip-location-value,
.edit-trip-info-trip-date-value,
.edit-trip-info-trip-people-value {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.edit-trip-info-trip-location-icon,
.edit-trip-info-trip-date-icon,
.edit-trip-info-trip-people-icon {
    width: 30px;
    margin: 10px
}




</style>
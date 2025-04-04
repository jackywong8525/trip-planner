<template>
    <div class="trip-card">
        <div class="trip-card-header"></div>
        <div class="trip-card-content">
            <div class="trip-name">
                {{ props.trip.name }}
            </div>
            <div class="trip-date">
                created at {{ props.trip.createdAt.slice(0, 10) }}
            </div>
            <div 
                class="trip-owner"
                v-if="!props.isOwner">
                by {{ tripOwner.username }}
            </div>
            <br>
            <div class="trip-location">
                <img 
                    src="/icons/location-icon.png"
                    class="trip-location-icon">
                <div class="trip-location-text">{{ props.trip.location }}</div>
            </div>
            <div class="trip-date">
                <img 
                    src="/icons/calendar-icon.png"
                    class="trip-date-icon">
                <div class="trip-date-range">{{ props.trip.startDate }} - {{ props.trip.endDate }}</div>
            </div>
            <div class="trip-people">
                <img 
                    src="/icons/user-icon.png"
                    class="trip-people-icon">
                <div class="trip-people-list">
                    {{ tripPeopleString }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { API_URL } from '@/utils/backendConnection';
import AuthService from '@/auth/AuthService';

// Props
const props = defineProps({
    trip: {
        required: true
    },
    isOwner: {
        type: Boolean,
        required: true
    },
    activeUser: {
        type: Object,
        required: true
    }
});

// Data Variables
const tripOwner = ref();
const tripPeople = ref(['you']);

// Computed Properties
const tripPeopleString = computed(() => {
    return tripPeople.value.length > 2
            ? tripPeople.value.slice(0, 2).join(', ') + ' and ' + (tripPeople.value.length - 2) + ' more'
            : tripPeople.value.join(', ');
});

// For owned trips
async function loadTripPeople() {

    const responses 
        = await Promise.all(props.trip.people.map((personId) => {
                return fetch(API_URL + '/user/find-user-by-userId', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${AuthService.getCurrentUser()}`
                },
                body: JSON.stringify({
                    userId: personId
                })
            });
        }))

    const usernames = await Promise.all(
        responses.map(async (response) => {
            const responseObj = await response.json();
            return responseObj.user.username;
        })
    )

    tripPeople.value.push(...usernames);
    
}

// For shared trips
async function loadTripOwner() {

    if(props.isOwner){
        tripOwner.value = activeUser.value;
        return;
    }

    const response = await fetch(API_URL + '/user/find-user-by-userId', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getCurrentUser()}`
        },
        body: JSON.stringify({
            userId: props.trip.ownerId
        })
    });

    const responseObj = await response.json();

    tripOwner.value = responseObj.user;
}

onMounted(async () => {
    loadTripOwner();
    loadTripPeople();
});


</script>

<style scoped>
.trip-card {
    /* Box and Size Properties */
    min-width: 300px;
    height: 400px;
    margin: 10px 20px;
    
    /* Border */
    border-radius: 5px;
    
    /* Shadow */
    box-shadow: var(--GENERAL-SHADOW);

    /* Display */
    display: grid;
    grid-template-rows: 2fr 1fr;
    flex: 1;

    /* Others */
    cursor: pointer;
}

.trip-card:hover {
    transition: transform 0.1s ease-in-out;
    transform: scale(1.01);
}

.trip-card-header {
    /* Color */
    background-color: var(--SUPP-THEME-COLOR-LIGHT);

    /* Border */
    border-radius: 5px 5px 0px 0px;
}

.trip-card-content {
    padding: 20px 15px;
    color: var(--SUPP-FONT-COLOR-DARK);
}

.trip-name {
    font-weight: bolder;
    font-size: 1.2rem;
}

.trip-date, .trip-people, .trip-location, .trip-owner {
    font-size: 0.9rem;
    display: flex;
    align-items: center;
}

.trip-date-icon, .trip-people-icon, .trip-location-icon {
    width: 20px;
    margin: 5px;
}

.trip-date-range, .trip-people-list, .trip-location-text {
    margin: 5px;
}
</style>


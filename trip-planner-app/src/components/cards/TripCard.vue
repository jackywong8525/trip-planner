<template>
    <div class="trip-card-container">
        <div class="trip-card" :class="{'disabled-card': props.isPending}">
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
        <div 
            class="shared-trip-permission"
            v-if="!props.isOwner && props.isPending">
                <button 
                    class="shared-trip-accept-button"
                    @click.prevent="confirmTripInvitation(true)">
                    <img 
                        src="/icons/tick-icon.png"
                        class="shared-trip-accept-button-icon">
                    Accept
                </button>
                <button
                    class="shared-trip-decline-button"
                    @click.prevent="confirmTripInvitation(false)">
                    <img 
                        src="/icons/cross-icon.png"
                        class="shared-trip-decline-button-icon">
                    Decline
                </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import { API_URL } from '@/utils/backendConnection';
import AuthService from '@/auth/AuthService';
import { AlertType } from '@/utils/AlertType.js';
import { Alert } from '@/utils/Alert';

const $bus = inject('$bus');

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
    },
    isPending: {
        type: Boolean,
        required: false
    }
});

// Data Variables
const tripOwner = ref({});
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
        tripOwner.value = props.activeUser;
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

async function confirmTripInvitation(isAccepted){

    const response = await fetch(API_URL + '/main/trip/confirm-trip-invitation', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getCurrentUser()}`
        },
        body: JSON.stringify({
            userId: props.activeUser.userId,
            tripId: props.trip._id,
            isAccepted: isAccepted
        })
    });

    const responseObj = await response.json();

    if(responseObj.success){
        $bus.$emit('emit-alert', new Alert(
            AlertType.SUCCESS,
            `Invitation for ${props.trip.name} has been ${isAccepted ? 'accepted' : 'declined' }.`
        ));
        $bus.$emit('refresh-shared-trips');
    }

    else{
        $bus.$emit('emit-alert', new Alert(
            AlertType.CAUTION,
            `Invitation for ${props.trip.name} cannot be ${isAccepted ? 'accepted' : 'declined' } due to some reasons. Please try again.`
        ));
    }

}

onMounted(async () => {
    await loadTripOwner();
    await loadTripPeople();
});


</script>

<style scoped>

.trip-card-container {
    position: relative
}

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

.shared-trip-permission {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    position: relative;
    bottom: 50%;
}

.shared-trip-accept-button,
.shared-trip-decline-button {
    /* Box and Size Properties */
    height: var(--BUTTON-HEIGHT);
    width: 150px;
    padding: var(--BUTTON-PADDING);

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    
    /* Border */
    border: var(--BUTTON-BORDER);
    border-radius: var(--BUTTON-BORDER-RADIUS);

    /* Color */
    color: var(--SUPP-FONT-COLOR-LIGHT);

    /* Other */
    cursor: pointer;
}

.shared-trip-accept-button-icon,
.shared-trip-decline-button-icon {
    width: 30px;
}

.shared-trip-accept-button {
    background-color: green;
}

.shared-trip-decline-button {
    background-color: red;
}

.shared-trip-accept-button:hover,
.shared-trip-decline-button:hover {
    filter: var(--BUTTON-HOVER-FILTER);
}

.disabled-card {
    pointer-events: none;
    filter: var(--BUTTON-DISABLED-FILTER);
}


</style>


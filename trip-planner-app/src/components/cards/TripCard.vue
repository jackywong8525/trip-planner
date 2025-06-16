<template>
    <div class="trip-card-container">
        <div class="trip-card" :class="{'disabled-card': props.isPending}">
            <div 
                class="trip-card-header">
                <img 
                    src="/icons/dot-menu-icon.png"
                    class="trip-card-header-menu-button"
                    @click.stop="toggleHeaderMenu">
                    <!-- click.stop: Prevent parent event being triggered -->
                <div
                    class="trip-card-header-menu"
                    v-if="isHeaderMenuOpen">
                        <div class="trip-card-header-menu-option"
                        @click.stop="deleteOwnedTrip">
                            Delete Trip
                        </div>
                </div>
            </div>
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
import { loadTripPeople, deleteTrip } from '@/utils/Trip';

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
const isHeaderMenuOpen = ref(false);

// Computed Properties
const tripPeopleString = computed(() => {
    return tripPeople.value.length > 2
            ? tripPeople.value.slice(0, 2).join(', ') + ' and ' + (tripPeople.value.length - 2) + ' more'
            : tripPeople.value.join(', ');
});

// For owned trips
async function loadTripPeopleList() {

    const usernames = await loadTripPeople(props.trip, props.activeUser);

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

    const user = await AuthService.getCurrentUserInfo();
    

    const response = await fetch(API_URL + '/main/trip/confirm-trip-invitation', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getCurrentUser()}`
        },
        body: JSON.stringify({
            userId: user.userId,
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

function toggleHeaderMenu() {
    isHeaderMenuOpen.value = !isHeaderMenuOpen.value;
}

async function deleteOwnedTrip() {
    const trip = props.trip;
    const responseObj = await deleteTrip(trip);

    if(responseObj.success) {      
        $bus.$emit('emit-alert', new Alert(
            AlertType.SUCCESS,
            `${trip.name} is successfully deleted.`
        ));

        $bus.$emit('refresh-owned-trips');
        toggleHeaderMenu();
        return;
    }


    $bus.$emit('emit-alert', new Alert(
        AlertType.CAUTION,
        responseObj.message ?
            responseObj.message
            : `${trip.name} cannot be deleted. Please try again.`
    ));
    
}

onMounted(async () => {
    await loadTripOwner();
    await loadTripPeopleList();
});


</script>

<style scoped>

.trip-card-container {
    position: relative;
    min-width: 0px;
    min-height: 0px;
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
    grid-template-rows: 5fr 6fr;
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

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
}

.trip-card-header-menu-button {
    color: white;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: 10px;
    padding: 5px;
    width: 30px;

    /* Border */
    border-radius: 5px;

    position: relative;

    transform: rotateZ(90deg);
}

.trip-card-header-menu-button:hover {
    filter: var(--BUTTON-HOVER-FILTER);
    background-color: rgba(0, 0, 0, 0.2);
}

.trip-card-content {
    padding: 20px 15px;
    color: var(--SUPP-FONT-COLOR-DARK);
    box-shadow: var(--GENERAL-SHADOW);
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
    margin: 10px 20px;
    height: 410px;

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
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
}

.shared-trip-permission {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}

.shared-trip-permission:hover {
    opacity: 1;
}

.trip-card-header-menu {

    margin: 0px 10px;

    height: 70px;
    width: 150px;

    padding: 10px 0px;

    border-radius: 10px;
    box-shadow: var(--GENERAL-SHADOW);

    background-color: white;
}

.trip-card-header-menu-option {
    height: 50px;
    padding: 10px;

    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.trip-card-header-menu-option:hover {
    background-color: var(--SUPP-THEME-COLOR-LIGHT);
    color: whitesmoke;
}

</style>


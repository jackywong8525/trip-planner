<template>
    
    <div class="trip-planner-edit-view-header">
        <div class="trip-planner-edit-view-header-placeholder"></div>
        <div class="trip-planner-edit-view-header-trip-name">{{activeTrip.name}}</div>
        <div class="trip-planner-edit-view-header-trip-location">
            <img 
                src="/icons/location-icon.png"
                class="trip-location-icon">
            <div class="trip-location-text">{{ activeTrip.location }}</div>
        </div>
        <div class="trip-planner-edit-view-header-trip-date">
            <img 
                src="/icons/calendar-icon.png"
                class="trip-date-icon">
            <div class="trip-date-range">{{ activeTrip.startDate }} <span class="nowrap">- {{ activeTrip.endDate }}</span></div>
        </div>
    </div>
    
    <ul class="trip-planner-navbar">
        <li class="trip-planner-navbar-item">
            <router-link
                :to="`/main/home`"
                class="trip-planner-navbar-item-router-link home-router-link"
                :active-class="'trip-planner-active-link'">
                <img 
                    class="trip-planner-navbar-item-image"
                    src="/icons/home-icon.png">
            </router-link>
        </li>
        <li class="trip-planner-navbar-item">
            <router-link
                :to="`/main/${$route.params.tripId}/trip-info`"
                class="trip-planner-navbar-item-router-link"
                :active-class="'trip-planner-active-link'">
                <img 
                    class="trip-planner-navbar-item-image"
                    src="/icons/trip-info-icon.png">
                <p class="trip-planner-navbar-item-text">Trip Information</p>
            </router-link>
        </li>
        <li class="trip-planner-navbar-item">
            <router-link
                :to="`/main/${$route.params.tripId}/trip-checklist`"
                class="trip-planner-navbar-item-router-link"
                :active-class="'trip-planner-active-link'">
                <img 
                    class="trip-planner-navbar-item-image"
                    src="/icons/trip-checklist-icon.png">
                <p class="trip-planner-navbar-item-text">Trip Checklist</p>
            </router-link>
        </li>
        <li class="trip-planner-navbar-item">
            <router-link
                :to="`/main/${$route.params.tripId}/trip-schedule`"
                class="trip-planner-navbar-item-router-link"
                :active-class="'trip-planner-active-link'">
                <img 
                    class="trip-planner-navbar-item-image"
                    src="/icons/trip-schedule-icon.png">
                <p class="trip-planner-navbar-item-text">Trip Schedule</p>
            </router-link>
        </li>
    </ul>

    <div class="trip-planner-edit-view-container">
        <RouterView 
            v-if="isMounted"
            :active-trip="activeTrip" />
    </div>
</template>

<script setup>
import AuthService from '@/auth/AuthService';
import { getTripByTripId } from '@/utils/Trip';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const activeTrip = ref({});
const activeUser = ref({});
const isMounted = ref(false);
const route = useRoute();


onMounted(async () => {
    await getActiveTrip();
    await getActiveUser();
    isMounted.value = true;
})

async function getActiveTrip(){

    activeTrip.value = await getTripByTripId(route.params.tripId);
}

async function getActiveUser(){
    activeUser.value = await AuthService.getCurrentUserInfo();
}


</script>

<style scoped>

.trip-planner-navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    /* Additional Styling */
    list-style-type: none;

    height: 50px;
    margin: 10px 10px 0px 10px;
}

.trip-planner-navbar-item-image {
    width: 30px;
    margin: 10px;
}

.trip-planner-navbar-item-router-link {

    display: flex;
    justify-content: center;
    align-items: center;
       
    text-decoration: none;
    color: var(--SUPP-FONT-COLOR-LIGHT);

    border-radius: 10px;
    box-shadow: var(--GENERAL-SHADOW);
    background-color: var(--SUPP-THEME-COLOR-LIGHT);

    height: 50px;
    width: clamp(100px, 25vw, 600px);

}

.home-router-link {
    border-radius: 25px;
    width: 50px;
}


/* Check if the trip-planner-navbar-item (parent class) contains a child with both trip-planner-navbar-item-router-link and trip-planner-active-link classes. Styles specified would applied to the PARENT class. */
/* .trip-planner-navbar-item:has(.trip-planner-navbar-item-router-link.trip-planner-active-link) {
    background-color: var(--SUPP-THEME-COLOR-DARK);
} */


.trip-planner-active-link {
    background-color: var(--SUPP-THEME-COLOR-DARK); 
}

.trip-planner-edit-view-container {
    min-height: 70dvh;
    border-radius: 10px;
    box-shadow: var(--GENERAL-SHADOW);
    margin: 10px;
}


.trip-planner-edit-view-header {
    min-height: 60px;
    border-radius: 10px;
    
    margin: 10px;

    display: grid;
    grid-template-columns: 50px 1fr 150px 275px;
    border: var(--GENERAL-BORDER);
}

.trip-planner-edit-view-header-placeholder {
    background-color: var(--SUPP-THEME-COLOR-DARK);
    border-radius: 10px 0px 0px 10px;
}

.trip-planner-edit-view-header-trip-name {
    font-size: 1.5rem;
    font-weight: 600;

    display: flex;
    align-items: center;

    margin: 10px;
}

.trip-planner-edit-view-header-trip-location,
.trip-planner-edit-view-header-trip-date {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px 10px;
}

.trip-location-icon,
.trip-date-icon {
    width: 30px;
    margin: 10px;
}

.trip-location-text,
.trip-date-range {
    font-size: clamp(0.8rem, 5vw, 0.9rem);
}

@media screen and (max-width: 900px) {

    .trip-planner-navbar-item-text {
        display: none;
    }

    .trip-planner-edit-view-header{
        display: grid;
        grid-template-columns: 50px 1fr 250px;
        grid-template-areas: 
            "placeholder trip-name trip-location"
            "placeholder trip-name trip-date"
        ;
    }

    .trip-planner-edit-view-header-placeholder {
        grid-area: placeholder;
    }

    .trip-planner-edit-view-header-trip-name {
        grid-area: trip-name;
    }

    .trip-planner-edit-view-header-trip-location {
        grid-area: trip-location;
        justify-content: flex-end;
    }

    .trip-planner-edit-view-header-trip-date {
        grid-area: trip-date;
        justify-content: flex-end;
    }

    .trip-location-icon,
    .trip-date-icon {
        width: 20px;
        margin: 5px;
    }
}

@media screen and (max-width: 600px) {

    .trip-planner-edit-view-header{
        display: grid;
        grid-template-columns: 50px 1fr;
        grid-template-areas: 
            "placeholder trip-name"
        ;
    }

    .trip-planner-edit-view-header-trip-location,
    .trip-planner-edit-view-header-trip-date,
    .home-router-link {
        display: none
    }

}


</style>
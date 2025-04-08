<template>

    <div 
        :class="`main-page-container ${showAddTripForm ? 'blur' : ''}`"
        :inert="showAddTripForm"
    >
        <Subheader 
            :subheader-content="'Recommended'">
        </Subheader>

        <div class="recommended-card-button-container">
            <CardButton
                :image-source="'/icons/plus-icon.png'"
                :content="'Add New Trip'"
                @click.prevent="toggleAddTripForm()"
            ></CardButton>

            <CardButton
                :image-source="'/icons/plan-icon.png'"
                :content="'View Your Own Trip'"
            ></CardButton>

            <CardButton
                :image-source="'/icons/settings-icon.png'"
                :content="'Settings'"
            ></CardButton>

        </div>

        <Subheader 
            :subheader-content="'My Trips'">
        </Subheader>

        <div class="owned-trips-container">
            <TripCard
                v-for="(trip, index) in ownedTrips"
                :trip="trip"
                :active-user="activeUser"
                :is-owner="true"
                @click.prevent="showEditTripPage({
                    trip: trip,
                    isOwner: true
                })"
            >
            </TripCard>
        </div>

        <Subheader 
            :subheader-content="'Shared Trips'">
        </Subheader>

        <div class="shared-trips-container">
            <TripCard
                v-for="(tripObj, index) in sharedTrips"
                :trip="tripObj.trip"
                :isPending="tripObj.isPending"
                :active-user="activeUser"
                :is-owner="false"
                @click.prevent="showEditTripPage({
                    trip: tripObj.trip,
                    isPending: tripObj.isPending,
                    isOwner: false
                })"
            >
            </TripCard>
        </div>
    </div>

    <AddTripForm v-if="showAddTripForm"></AddTripForm>
    
</template>

<script setup>
import CardButton from '@/components/cards/CardButton.vue';
import Subheader from '@/components/subheader/Subheader.vue';
import AddTripForm from '@/components/forms/AddTripForm.vue';
import TripCard from '@/components/cards/TripCard.vue';
import AuthService from '@/auth/AuthService';
import { API_URL } from '@/utils/backendConnection';
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const $bus = inject('$bus');

const showAddTripForm = ref(false);
const ownedTrips = ref([]);
const sharedTrips = ref([]);
const activeUser = ref({});

$bus.$on('close-add-trip-form', toggleAddTripForm);
$bus.$on('refresh-owned-trips', getOwnedTrips);
$bus.$on('refresh-shared-trips', getSharedTrips);

onMounted(async () => {
    await getActiveUser();
    await getOwnedTrips();
    await getSharedTrips();
});

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

async function getOwnedTrips() {
    const response = await fetch(API_URL + '/main/trip/get-owned-trips', {
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

    ownedTrips.value = responseObj.trips;
}

async function getSharedTrips() {
    const response = await fetch(API_URL + '/main/trip/get-shared-trips', {
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

    sharedTrips.value = responseObj.trips;
}

function showEditTripPage(tripValidation) {

    if((!tripValidation.isOwner && !tripValidation.isPending) || tripValidation.isOwner){
        $bus.$emit('switch-page', {
            name: 'main-edit-trip-info',
            trip: tripValidation.trip
        });
    }
}

function toggleAddTripForm(){
    showAddTripForm.value = !showAddTripForm.value;
}

</script>

<style>
.main-page-container {
    position: relative;
}

.blur {
    opacity: 10%;
}

.recommended-card-button-container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;
    flex-wrap: wrap;
}

.owned-trips-container, .shared-trips-container {
    min-height: 500px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;

}

</style>
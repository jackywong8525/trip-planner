<template>

    <Alert
        v-if="alertEmitted"
        :alert-type="alert.alertType"
        :message="alert.message"
        :is-visible="alertEmitted"
    ></Alert>

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
            >
            </TripCard>
        </div>

        <Subheader 
            :subheader-content="'Shared Trips'">
        </Subheader>

        <div class="shared-trips-container">
            <TripCard
                v-for="(trip, index) in sharedTrips"
                :trip="trip"
                :active-user="activeUser"
                :is-owner="false"
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
import Alert from '@/components/alert/Alert.vue';
import AuthService from '@/auth/AuthService';
import { API_URL } from '@/utils/backendConnection';
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const $bus = inject('$bus');

const showAddTripForm = ref(false);
const ownedTrips = ref([]);
const sharedTrips = ref([]);
const alertEmitted = ref(false);
const alert = ref();
const activeUser = ref();

$bus.$on('close-add-trip-form', toggleAddTripForm);
$bus.$on('emit-alert', showAlert);
$bus.$on('refresh-owned-trips', getOwnedTrips);

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

function toggleAddTripForm(){
    showAddTripForm.value = !showAddTripForm.value;
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

.owned-trips-container {
    min-height: 500px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;

}

.shared-trips-container {
    min-height: 500px;
}

</style>
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

        <div class="trip-container">
            <TripCard
                v-for="(trip, index) in trips"
                :trip="trip"
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
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const $bus = inject('$bus');

const showAddTripForm = ref(false);
const trips = ref([]);
const alertEmitted = ref(false);
const alert = ref();

$bus.$on('close-add-trip-form', toggleAddTripForm);
$bus.$on('emit-alert', showAlert);

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

.trip-container {
    min-height: 500px;
}

</style>
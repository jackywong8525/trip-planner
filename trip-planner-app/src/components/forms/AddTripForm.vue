<template>
    <div class="add-trip-form-container">
        <div class="add-trip-form-header">
            <span class="add-trip-form-header-text">Add a new trip</span>
            <div
                class="add-trip-form-header-button"
                @click.prevent="closeAddTripForm()"
                >X
            </div>
        </div>
        <form class="add-trip-form">

            <Subheader
                :subheader-content="'Basic Information'"
                class="basic-info-header"
            >
            </Subheader>

            <div class="trip-name-input">
                <span class="add-trip-form-label">Your Trip Name:</span>
                <FormInput
                    :type-of-input="'text'"
                    :input-label="'Trip Name'"
                    :update-event="'trip-name-updated'"
                    :validation="tripNameValidation"
                >
                </FormInput>
            </div>

            <div class="trip-location-input">
                <span class="add-trip-form-label">Location:</span>
                <FormInput
                    :type-of-input="'text'"
                    :input-label="'Location'"
                    :update-event="'location-updated'"
                    :validation="tripLocationValidation"
                >
                </FormInput>
            </div>

            <div class="trip-start-date-input">
                <span class="add-trip-form-label">Start Date:</span>
                <FormInput
                    :type-of-input="'date'"
                    :input-label="'Start Date'"
                    :update-event="'start-date-updated'"
                    :validation="tripStartDateValidation"
                >
                </FormInput>
            </div>

            <div class="trip-end-date-input">
                <span class="add-trip-form-label">End Date:</span>
                <FormInput
                    :type-of-input="'date'"
                    :input-label="'End Date'"
                    :update-event="'end-date-updated'"
                    :validation="tripEndDateValidation"
                >
                </FormInput>
            </div>

            <Subheader
                :subheader-content="'People'"
                class="people-header"
            >
            </Subheader>

            <div class="trip-people-input">
                <span class="add-trip-form-label">Other people that will be in the trip:</span>
                <FormInput
                    :type-of-input="'text'"
                    :input-label="'Username'"
                    :update-event="'username-updated'"
                >
                </FormInput>
                <div 
                    class="people-search-list"
                    v-if="userSearched">
                    <SearchDropDown
                        v-for="(user, index) in filteredUsers"
                        :user="user"
                        :index="index"
                        :clicked-names="people"
                        :update-event="'people-updated'"
                    >
                    </SearchDropDown>
                    <p v-if="!filteredUsers.length">No users found</p>
                </div>
                <div
                    class="people-list">
                    <PersonLabel
                        v-for="(person, index) in people"
                        :text="person.lastName + ' ' + person.firstName"
                        >
                    </PersonLabel>
                </div>
            </div>

            <Subheader
                :subheader-content="'Other Settings'"
                class="other-settings-header"
            >
            </Subheader>

            <div class="share-checklist-input">
                <input type="checkbox" class="share-checklist-checkbox"
                v-model="isChecklistShared">
                <span>Share the checklist to all the people in this trip</span>
            </div>

            <div 
                v-if="!submitStatus && submitAttempted"
                class="submit-msg-section">
                <img 
                    src="/icons/caution-icon.png"
                    class="submit-msg-icon">
                <p class="submit-msg center">{{ submitMessage }}</p>
            </div>

            <div class="submit-button">
                <button 
                    class="add-trip-submit-button"
                    @click.prevent="submitForm"
                    :disabled="submitted"
                    >
                    Submit
                </button>
            </div>

        </form>
    </div>
</template>

<script setup>
import FormInput from './FormInput.vue';
import Subheader from '../subheader/Subheader.vue';
import SearchDropDown from './SearchDropDown.vue';
import PersonLabel from './PersonLabel.vue';
import { ref, inject, computed } from 'vue';
import AuthService from '@/auth/AuthService';
import { InputValidation, alphabets } from '@/utils/inputValidation';
import { API_URL } from '@/utils/backendConnection';

const $bus = inject('$bus');

// Data Variables
const tripName = ref('');
const tripLocation = ref('');
const tripStartDate = ref();
const tripEndDate = ref();
const usernameFilter = ref('');
const filteredUsers = ref([]);
const userSearched = ref(false);
const people = ref([]);
const isChecklistShared = ref(false);
const submitAttempted = ref(false);
const submitStatus = ref(false);
const submitMessage = ref('');
const submitted = ref(false);

// Computed Properties
const tripNameValidation = computed(() =>{
    return [
        new InputValidation((tripName) => {
            return tripName !== '';
        }, 'Trip Name is required.'),
        new InputValidation((tripName) => {
            return tripName.length >= 2 
                    && tripName.length <= 20
                    && alphabets.test(tripName);
        }, 'Trip Name should be in 2 to 20 characters.')
    ];
});

const tripLocationValidation = computed(() => {
    return [
        new InputValidation((location) => {
            return location !== '';
        }, 'Location is required.'),
        new InputValidation((location) => {
            return alphabets.test(location);
        }, 'Location should consist only alphabets.')
    ]
});

const tripStartDateValidation = computed(() => {
    return [
        new InputValidation((startDate) => {
            return startDate !== '';
        }, 'Start Date is required.'),
        new InputValidation((startDate) => {

            const today = new Date().toISOString().slice(0, 10);

            return Number(startDate.slice(0, 4)) >= Number(today.slice(0, 4))
                    && Number(startDate.slice(5, 7)) >= Number(today.slice(5, 7))
                    && Number(startDate.slice(8, 10)) >= Number(today.slice(8, 10));
        }, 'Start Date must be no earlier than today.')
    ]
});

const tripEndDateValidation = computed(() => {
    return [
        new InputValidation((endDate) => {
            return endDate !== '';
        }, 'End Date is required.'),
        new InputValidation((endDate) => {

            return Number(endDate.slice(0, 4)) >= Number(tripStartDate.value.slice(0, 4))
                    && Number(endDate.slice(5, 7)) >= Number(tripStartDate.value.slice(5, 7))
                    && Number(endDate.slice(8, 10)) >= Number(tripStartDate.value.slice(8, 10));
        }, 'End Date must be no earlier than startDate.')
    ]
});

// Event listeners for input values
$bus.$on('trip-name-updated', updateTripName);
$bus.$on('location-updated', updateTripLocation);
$bus.$on('start-date-updated', updateTripStartDate);
$bus.$on('end-date-updated', updateTripEndDate);

$bus.$on('username-updated', updateUsername);
$bus.$on('people-updated', addPeople);
$bus.$on('delete-person-label', deletePeople)

function updateTripName(data) {
    tripName.value = data;
}
function updateTripLocation(data) {
    tripLocation.value = data;
}
function updateTripStartDate(data) {
    console.log(data);
    tripStartDate.value = data;
}
function updateTripEndDate(data) {
    tripEndDate.value = data;
}

function updateUsername(data) {
    usernameFilter.value = data;

    let debounceTimer;

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        updateFilteredUsers();
    }, 300);

    console.log(filteredUsers.value);
}

function addPeople(data) {

    people.value.push(filteredUsers.value[data.index]);
    updateUsername('');
    $bus.$emit('reset-input');
}

function deletePeople(index) {
    people.value.splice(index, 1);
    console.log(people.value);
}

async function updateFilteredUsers() {

    if(usernameFilter.value === ''){
        userSearched.value = false;
        filteredUsers.value = [];
        return;
    }

    const API_URL = "http://localhost:5000";

    const response = await fetch(API_URL + '/main/trip/add-trip/add-people', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getCurrentUser()}`
        },
        body: JSON.stringify({
            username: usernameFilter.value,
            token: AuthService.getCurrentUser()
        })
    });

    const responseObj = await response.json();

    if(responseObj && responseObj.userList) {    
        filteredUsers.value = responseObj.userList;  
    }

    userSearched.value = true;
     
    return;
}

function validateFormInfo() {

    const today = new Date().toISOString().slice(0, 10);

    if(tripName.value === '' || tripLocation.value === '' || tripStartDate.value === '' || tripEndDate.value === '') {
        submitMessage.value = "Trip name, location, start date and end date are required.";
        return false;
    }

    else if(tripName.value.length < 2 || tripName.value.length > 20 || !alphabets.test(tripName.value)){
        submitMessage.value = "Trip name should consist of 2 to 20 alphabets."
        return false;
    }

    else if(!alphabets.test(tripLocation.value)){
        submitMessage.value = 'Location should consist only alphabets.';
        return false;
    }

    else if(Number(tripStartDate.value.slice(0, 4)) < Number(today.slice(0, 4))
                    && Number(tripStartDate.value.slice(5, 7)) < Number(today.slice(5, 7))
                    && Number(tripStartDate.value.slice(8, 10)) < Number(today.slice(8, 10))){

        submitMessage.value = 'Start Date must be no earlier than today.';
        return false;          
    }

    else if(Number(tripStartDate.value.slice(0, 4)) > Number(tripEndDate.value.slice(0, 4))
                    && Number(tripStartDate.value.slice(5, 7)) > Number(tripEndDate.value.slice(5, 7))
                    && Number(tripStartDate.value.slice(8, 10)) > Number(tripEndDate.value.slice(8, 10))){

        submitMessage.value = 'End Date must be no earlier than Start Date.';
        return false;          
    }

    return true;


}

async function submitForm() {

    submitted.value = true;
    submitAttempted.value = true;

    if(!validateFormInfo()){
        submitted.value = false;
        return;
    }

    const response = await fetch(API_URL + '/main/trip/add-trip', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AuthService.getCurrentUser()}`
        },
        body: JSON.stringify({
            name: tripName.value,
            location: tripLocation.value,
            startDate: tripStartDate.value,
            endDate: tripEndDate.value,
            people: people.value.map((person) =>{
                return person.userId;
            }),
            isChecklistShared: isChecklistShared.value,
            token: AuthService.getCurrentUser()
        })
    });

    const responseObj = await response.json();

    submitStatus.value = responseObj.success;
    submitMessage.value = responseObj.message;
    submitted.value = false;

    if(submitStatus.value) {    
        closeAddTripForm();
    }
     
    return;

}

function closeAddTripForm() {
    $bus.$emit('close-add-trip-form', null);
}


</script>

<style scoped>
.add-trip-form-container {
    /* Display */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;

    /* Box and Size Properties */
    height: min(75dvh, 700px);
    width: clamp(300px, 75vw, 800px);

    /* Color */
    background-color: var(--BACKUP-COLOR-LIGHT);

    /* Border */
    border: var(--GENERAL-BORDER);
    border-radius: 10px;

    /* Shadow */
    box-shadow: var(--GENERAL-SHADOW);
}

.add-trip-form-header {
    /* Display */
    display: grid;
    grid-template-columns: 1fr 50px;

    /* Box and Size Properties */
    height: 40px;

    /* Border */
    border-bottom: var(--GENERAL-BORDER);
    border-radius: 10px 10px 0px 0px;

    /* Color */
    background-color: var(--MAIN-THEME-COLOR);

    /* Font */
    color: var(--SUPP-FONT-COLOR-LIGHT);
}

.add-trip-form-header-text,
.add-trip-form-header-button {
    /* Display */
    display: flex;
    align-items: center;

    /* Box and Size Properties */
    padding: 10px;
}

.add-trip-form-header-text {
    justify-content: flex-start;
}

.add-trip-form-header-button {
    justify-content: center;

    /* Border */
    border-left: 1px solid var(--SUPP-BORDER-COLOR);

    /* Transition */
    transition: background-color 0.1s ease-in-out;

    /* Others */
    cursor: pointer;
}

.add-trip-form-header-button:hover {
    /* Color */
    background-color: var(--CAUTIOUS-BUTTON-COLOR);

    /* Border */
    border-radius: 0px 10px 0px 0px;
}

.add-trip-form {
    /* Display */
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 
        "basic-info-header basic-info-header"
        "trip-name-input trip-name-input"
        "trip-location-input trip-location-input"
        "trip-start-date-input trip-end-date-input"
        "people-header people-header"
        "trip-people-input trip-people-input"
        "other-settings-header other-settings-header"
        "share-checklist-input share-checklist-input"
        "submit-msg-section submit-msg-section"
        "submit-button submit-button"
    ;

    column-gap: 10px;

    /* Box and Size Properties */
    padding: 10px;
    margin: 0px 3px;
    height: calc(100% - 40px);

    /* Scroll */
    overflow-y: scroll;
    scrollbar-color: var(--MAIN-THEME-COLOR);
}

.add-trip-form::-webkit-scrollbar{
    width: 5px;
    height: 95%;
    background-color: transparent;
    left: -10px
}

.add-trip-form::-webkit-scrollbar-thumb{
    margin: 0px 10px;
    background-color: var(--SUPP-THEME-COLOR-LIGHT);
    border-radius: 10px;
}

.add-trip-form-label {
    font-size: 0.9rem;
    padding: 5px 0px;
}

.basic-info-header {
    grid-area: basic-info-header;
}

.trip-name-input,
.trip-location-input,
.trip-start-date-input,
.trip-end-date-input,
.trip-people-input,
.share-checklist-input {
    padding: 5px;
}

.trip-name-input {
    grid-area: trip-name-input;
}

.trip-location-input {
    grid-area: trip-location-input;
}

.trip-start-date-input {
    grid-area: trip-start-date-input;
}


.trip-end-date-input {
    grid-area: trip-end-date-input;
}

.people-header {
    grid-area: people-header;
}

.trip-people-input {
    grid-area: trip-people-input;

    position: relative;
}

.other-settings-header {
    grid-area: other-settings-header;
}

.share-checklist-input {
    grid-area: share-checklist-input;
    padding: 5px;
    margin: 0px 5px;
}

.share-checklist-checkbox {
    padding: 5px;
    margin: 0px 5px;
}

.submit-button {
    /* Display */
    grid-area: submit-button;
    display: flex;
    justify-content: center;
    align-items: center;

    /* Box and Size Properties */
    margin: 10px;
}

.add-trip-submit-button {

    /* Border */
    border: var(--BUTTON-BORDER);
    border-radius: var(--BUTTON-BORDER-RADIUS);

    /* Box and Size Properties */
    height: var(--BUTTON-HEIGHT);
    width: 50%;
    padding: var(--BUTTON-PADDING);

    /* Color */
    background-color: var(--SUPP-THEME-COLOR-DARK);
    color: var(--SUPP-FONT-COLOR-LIGHT);

    /* Other */
    cursor: pointer;
}

.add-trip-submit-button:hover {
    /* Additional Styling */
    filter: var(--BUTTON-HOVER-FILTER);
}

.people-search-list {
    /* Display */
    position: absolute;

    /* Box and Size Properties */
    width: calc(100% - 10px);
    max-height: 150px;
    padding: 10px;

    /* Scroll */
    overflow-y: scroll;
    scrollbar-color: var(--MAIN-THEME-COLOR);

    /* Color */
    background-color: white;
    
    /* Border */
    border-radius: 10px;
    
    /* Shadow */
    box-shadow: var(--GENERAL-SHADOW);
}

.people-search-list::-webkit-scrollbar{
    width: 5px;
    height: 95%;
    background-color: transparent;
    left: -10px
}

.people-search-list::-webkit-scrollbar-thumb{
    margin: 0px 10px;
    background-color: var(--SUPP-THEME-COLOR-LIGHT);
    border-radius: 10px;
}

.people-list {
    padding: 10px;

    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}


.submit-msg-section {
    grid-area: submit-msg-section;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    padding: 10px;
}

.submit-msg {
    /* Font */
    font-size: 0.8rem;
    color: var(--CAUTION-FONT-COLOR);
    font-weight: bolder
}

.submit-msg-icon {
    width: 20px;
}


</style>
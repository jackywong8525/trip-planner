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
                >
                </FormInput>
            </div>

            <div class="trip-location-input">
                <span class="add-trip-form-label">Location:</span>
                <FormInput
                    :type-of-input="'text'"
                    :input-label="'Location'"
                    :update-event="'location-updated'"
                >
                </FormInput>
            </div>

            <div class="trip-start-date-input">
                <span class="add-trip-form-label">Start Date:</span>
                <FormInput
                    :type-of-input="'date'"
                    :input-label="'Start Date'"
                    :update-event="'start-date-updated'"
                >
                </FormInput>
            </div>

            <div class="trip-end-date-input">
                <span class="add-trip-form-label">End Date:</span>
                <FormInput
                    :type-of-input="'date'"
                    :input-label="'End Date'"
                    :update-event="'end-date-updated'"
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
                        :name="user.lastName + ' ' + user.firstName"
                        :description="user.username"
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
                        :text="person.name"
                        >
                    </PersonLabel>
                </div>
            </div>

            <Subheader
                :subheader-content="'Other Settings'"
                class="other-settings-header"
            >
            </Subheader>

            <div class="share-schedule-input">
                <input type="checkbox" class="share-schedule-checkbox">
                <span>Share the schedule to all the people in this trip</span>
            </div>

            <div class="share-checklist-input">
                <input type="checkbox" class="share-checklist-checkbox">
                <span>Share the checklist to all the people in this trip</span>
            </div>

            <div class="submit-button">
                <button 
                    class="add-trip-submit-button"
                    @click.prevent="submitForm"
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
import { ref, inject } from 'vue';
import AuthService from '@/auth/AuthService';

const $bus = inject('$bus');

// Data Variables
const tripName = ref('');
const tripLocation = ref('');
const tripStartDate = ref();
const tripEndDate = ref();

const usernameFilter = ref('');
let filteredUsers = ref([]);
let userSearched = ref(false);
let people = ref([]);

$bus.$on('trip-name-updated', updateTripName);
$bus.$on('location-updated', updateTripLocation);
$bus.$on('start-date-updated', updateTripStartDate);
$bus.$on('end-date-updated', updateTripEndDate);

$bus.$on('username-updated', updateUsername);
$bus.$on('people-updated', updatePeople);

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

function updatePeople(data) {
    people.value.push({
        name: data.name,
        username: data.description
    });
    updateUsername('');
    $bus.$emit('reset-input');
}

function closeAddTripForm() {
    $bus.$emit('close-add-trip-form', null);
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
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: usernameFilter.value,
            token: AuthService.getCurrentUser()
        })
    });

    const responseObj = await response.json();

    if(responseObj) {    
        filteredUsers.value = responseObj.userList;  
    }

    userSearched.value = true;
     
    return;
}

function submitForm() {

}



</script>

<style>
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
        "share-schedule-input share-schedule-input"
        "share-checklist-input share-checklist-input"
        ". ."
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
.share-schedule-input,
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

.share-schedule-input {
    grid-area: share-schedule-input;
    padding: 5px;
    margin: 0px 5px;
}

.share-schedule-checkbox {
    padding: 5px;
    margin: 0px 5px;
    
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

</style>
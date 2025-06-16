<template>
    <div 
        class="checklist-item-container"
        :class="{'checklist-item-container-is-editable': isEditable}"   
    >
        <div class="checklist-item-name-container">
            <input 
                class="checklist-item-name-editable"
                :value="props.name"
                placeholder="Item Name"
                @input="updateName($event.target.value)"
                @keydown="toggleEditableByShortcut"
                v-if="isEditable">
            <span 
                class="checklist-item-name"
                v-else
                @click.prevent="toggleEditableByShortcut">
                {{ props.name }}
            </span>
        </div>

        <div class="checklist-item-deadline-container">
            <input 
                class="checklist-item-deadline-editable"
                :value="props.deadline"
                type="date"
                @input="updateDeadline($event.target.value)"
                @keydown="toggleEditableByShortcut"
                v-if="isEditable">
            <span 
                class="checklist-item-deadline"
                v-else
                @click.prevent="toggleEditableByShortcut">
                {{ props.deadline }}
            </span>
        </div>

        <div class="checklist-item-status-container">
            <!-- <select 
                class="checklist-item-status"
                v-model="status"
                type="dropdown"
            >
                <option value="Unpacked">Unpacked</option>
                <option value="Packed">Packed</option>
                <option value="In Transit">In Transit</option>
            </select> -->
            <VSelect
                class="checklist-item-status"
                :value="props.status"
                label="Select"
                :options="['Unpacked', 'Packed', 'Pending']"
                variant="solo-filled"
                @input="updateStatus($event)"
            ></VSelect>
        </div>

        <div class="checklist-item-name-edit-icon-container">
            <i 
                class="pi pi-pencil checklist-item-name-edit-icon" 
                @click.prevent="toggleEditable($event)"
            ></i>
        </div>

        <div class="checklist-item-delete-icon-container">
            <i 
                class="pi pi-trash checklist-item-delete-icon" 
                @click.prevent=""
            ></i>
        </div>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import VSelect from 'vue-select';

const $bus = inject('$bus');

const props = defineProps({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    categoryIndex: {
        type: Number,
        required: true
    }
});

const isEditable = ref(true);
// const inputValue = ref('');
// const deadline = ref('');
// const status = ref('Unpacked');


function updateName(newName) {
    // if(newName === '') return;

    $bus.$emit('update-checklist-item-name', {
        id: props.id,
        name: newName
    });
}

function updateDeadline(newDeadline) {
    if(newDeadline === '') return;

    $bus.$emit('update-checklist-item-deadline', {
        id: props.id,
        deadline: newDeadline
    });
}

function updateStatus(newStatus) {
    if(newStatus === '') return;

    $bus.$emit('update-checklist-item-status', {
        id: props.id,
        status: newStatus
    });
}

function toggleEditableByShortcut(event){


    if(event.key === "Enter"){

        if(event.target.value === '') return;

        isEditable.value = false;
        // $bus.$emit('update-checklist-item', {
        //     id: props.item.id,
        //     name: inputValue.value,
        //     deadline: deadline.value,
        //     status: status.value,
        //     categoryIndex: props.item.categoryIndex
        // });
        return;
    }

    isEditable.value = true;

}

function toggleEditable(event) {

    if(event.target.value === '') return;

    isEditable.value = !isEditable.value;

    if(!isEditable.value){
        // $bus.$emit('update-checklist-item', {
        //     id: props.item.id,
        //     name: inputValue.value,
        //     deadline: deadline.value,
        //     status: status.value,
        //     categoryIndex: props.item.categoryIndex
        // });
    }
}
</script>

<style scoped>
.checklist-item-container {
    width: 100%;
    height: 50px;
    padding: 5px 10px;
    margin: 10px;

    display: grid;
    grid-template-columns: 2fr 1fr 1fr 40px 40px;
    grid-template-areas: "item-name item-deadline item-status item-edit-icon item-delete-icon";

    border-radius: 10px;
    box-shadow: var(--GENERAL-SHADOW);
}

.checklist-item-container-is-editable {
    border: 2px solid var(--MAIN-THEME-COLOR);
}

.checklist-item-name-container {
    grid-area: item-name;
}

.checklist-item-deadline-container {
    grid-area: item-deadline;
}

.cheacklist-item-status-container {
    grid-area: item-status;
}

.checklist-item-name-edit-icon-container {
    grid-area: item-edit-icon;
}

.checklist-item-delete-icon-container {
    grid-area: item-delete-icon;
}

.checklist-item-name-container,
.checklist-item-deadline-container,
.checklist-item-status-container,
.checklist-item-name-edit-icon-container,
.checklist-item-delete-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.checklist-item-name-editable,
.checklist-item-name,
.checklist-item-deadline-editable,
.checklist-item-deadline {

    display: flex;
    justify-content: flex-start;
    align-items: center;

    border: none;
    /* border-radius: 10px; */
    height: 90%;
    width: 100%;
    padding: 0px 5px;
}

.cheacklist-item-status-container {
    flex: 1;
    padding: 0px;
}

.cheacklist-item-status {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 10px;
    background-color: var(--SUPP-THEME-COLOR-DARK);
    color: var(--SUPP-FONT-COLOR-LIGHT);
}

.checklist-item-name-editable:focus,
.checklist-item-deadline-editable:focus {
   outline: none; /*Removes the default outline */
   border-bottom: 2px solid var(--MAIN-THEME-COLOR);
}


.checklist-item-name-edit-icon,
.checklist-item-delete-icon {
    /* width: 24px; */
    font-size: 24px;
    color: var(--SUPP-THEME-COLOR-DARK);
    cursor: var(--BUTTON-HOVER-CURSOR);
}

.checklist-item-name-edit-icon-container:hover,
.checklist-item-delete-icon-container:hover {
    background-color: lightgrey;
    border-radius: 12px;
}



</style>
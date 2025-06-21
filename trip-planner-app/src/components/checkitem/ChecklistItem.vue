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

        <div class="checklist-item-quantity-container">
            <input
                class="checklist-item-quantity-editable"
                min="1"
                type="number"
            >
        </div>

        <div class="checklist-item-deadline-container">
            <i 
                class="pi pi-calendar checklist-item-deadline-icon"
            ></i>
            <input 
                class="checklist-item-deadline-editable"
                :value="props.deadline"
                type="date"
                @input="updateDeadline($event.target.value)">
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
            <!-- <VSelect
                class="checklist-item-status"
                :value="props.status"
                label="Select"
                :options="['Unpacked', 'Packed', 'Pending']"
                variant="solo-filled"
                @input="updateStatus($event)"
            ></VSelect> -->
            <DropdownSelect
                :option-type="ChecklistItemStatus"
                :value="props.status"
                :update-event="'update-checklist-item-status-value'"
            ></DropdownSelect>
        </div>

        <div class="checklist-item-name-edit-icon-container">
            <i 
                class="pi pi-pencil checklist-item-name-edit-icon" 
                @click.prevent="toggleEditable()"
            ></i>
        </div>

        <div class="checklist-item-delete-icon-container">
            <i 
                class="pi pi-trash checklist-item-delete-icon" 
                @click.prevent="deleteChecklistItem"
            ></i>
        </div>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import DropdownSelect from '@/components/select/DropdownSelect.vue'
import { ChecklistItemStatus } from './ChecklistItemStatus';

const $bus = inject('$bus');

$bus.$on('update-checklist-item-status-value', updateStatus)

const props = defineProps({
    itemId: {
        type: String,
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

const isEditable = ref(props.name === '');

function updateName(newName) {

    $bus.$emit('update-checklist-item-name', {
        id: props.itemId,
        name: newName
    });
}

function updateDeadline(newDeadline) {
    if(newDeadline === '') return;

    $bus.$emit('update-checklist-item-deadline', {
        id: props.itemId,
        deadline: newDeadline
    });
}

function updateStatus({value}) {
    if(value === '') return;

    console.log(value)

    $bus.$emit('update-checklist-item-status', {
        id: props.itemId,
        status: value
    });
}

function toggleEditableByShortcut(event){

    if(event.key === "Enter"){

        if(event.target.value === '') return;

        isEditable.value = false;
        return;
    }

    isEditable.value = true;

}

function toggleEditable(event) {

    if(props.name === '') return;

    isEditable.value = !isEditable.value;

}


function deleteChecklistItem() {
    $bus.$emit('delete-checklist-item', props.itemId);
}
</script>

<style scoped>
.checklist-item-container {
    width: 100%;
    height: 50px;
    padding: 5px 10px;
    margin: 10px;

    display: grid;
    grid-template-columns: 1fr 100px 120px 200px 40px 40px;
    grid-template-areas: "item-name item-quantity item-deadline item-status item-edit-icon item-delete-icon";

    border-radius: 10px;
    box-shadow: var(--GENERAL-SHADOW);
}

.checklist-item-container-is-editable {
    border: 2px solid var(--MAIN-THEME-COLOR);
}

.checklist-item-name-container {
    grid-area: item-name;
}

.checklist-item-quantity-container {
    grid-area: item-quantity;
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
.checklist-item-quantity-container,
.checklist-item-deadline-container,
.checklist-item-status-container,
.checklist-item-name-edit-icon-container,
.checklist-item-delete-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 0px 10px;
}

.checklist-item-name-editable,
.checklist-item-name,
.checklist-item-quantity-editable,
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

.checklist-item-quantity-container {
    padding: 0px 15px;
}

.checklist-item-quantity-editable {
    border: 1px solid var(--SUPP-THEME-COLOR-DARK);
    border-radius: 5px;
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
.checklist-item-delete-icon,
.checklist-item-deadline-icon {
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
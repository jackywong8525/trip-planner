<template>
    <div class="checklist-category">
        <div 
            class="checklist-category-container"
            :class="{'checklist-category-container-is-editable': isEditable}">
            <div class="checklist-category-name-container">
                <input 
                    class="checklist-category-name-editable"
                    v-model="inputValue"
                    placeholder="Category"
                    @keydown="toggleEditableByShortcut"
                    v-if="isEditable">
                <span 
                    class="checklist-category-name"
                    v-else
                    @click.prevent="toggleEditableByShortcut">
                    {{ inputValue }}
                </span>
            </div>

            <div class="checklist-category-name-edit-icon-container">
                <i 
                    class="pi pi-pencil checklist-category-name-edit-icon" 
                    @click.prevent="toggleEditable(true)"
                ></i>
            </div>

            <div class="checklist-category-delete-icon-container">
                <i 
                    class="pi pi-trash checklist-category-delete-icon" 
                    @click.prevent=""
                ></i>
            </div>

            <div class="checklist-category-expand-icon-container">
                <i 
                    class="pi pi-angle-down checklist-category-expand-icon" 
                    @click.prevent=""
                ></i>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';

const $bus = inject('$bus');

const isEditable = ref(true);
const inputValue = ref('');

const props = defineProps({
    categoryIndex: {
        type: Number,
        required: true
    }
});

function toggleEditableByShortcut(event){


    if(event.key === "Enter"){

        if(inputValue.value === '') return;

        isEditable.value = false;
        $bus.$emit('update-checklist-category', {
            index: props.categoryIndex,
            name: inputValue.value
        });
        return;
    }

    isEditable.value = true;

}

function toggleEditable() {

    if(inputValue.value === '') return;

    isEditable.value = !isEditable.value;

    if(!isEditable.value){
        $bus.$emit('update-checklist-category', {
            index: props.categoryIndex,
            name: inputValue.value
        });
    }
}
</script>

<style scoped>
.checklist-category{
    width: max(250px, 98%);
}

.checklist-category-container {
    width: 100%;
    height: 50px;
    padding: 5px 10px;
    margin: 10px;

    display: grid;
    grid-template-columns: 1fr 40px 40px 40px;
    grid-template-areas: "category-name category-edit-icon category-delete-icon category-expand-icon";

    border-radius: 10px;
    box-shadow: var(--GENERAL-SHADOW);
}

.checklist-category-container-is-editable {
    border: 2px solid var(--MAIN-THEME-COLOR);
}

.checklist-category-name-container {
    grid-area: category-name;
}

.checklist-category-name-edit-icon-container {
    grid-area: category-edit-icon;
}

.checklist-category-delete-icon-container {
    grid-area: category-delete-icon;
}

.checklist-category-expand-icon-container {
    grid-area: category-expand-icon;
}

.checklist-category-name-container,
.checklist-category-name-edit-icon-container,
.checklist-category-delete-icon-container,
.checklist-category-expand-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.checklist-category-name-editable,
.checklist-category-name {

    display: flex;
    justify-content: flex-start;
    align-items: center;

    border: none;
    /* border-radius: 10px; */
    height: 90%;
    width: 100%;
    padding: 0px 5px;
}

.checklist-category-name-editable:focus {
   outline: none; /*Removes the default outline */
   border-bottom: 2px solid var(--MAIN-THEME-COLOR);
}


.checklist-category-name-edit-icon,
.checklist-category-delete-icon,
.checklist-category-expand-icon {
    /* width: 24px; */
    font-size: 24px;
    color: var(--SUPP-THEME-COLOR-DARK);
    cursor: var(--BUTTON-HOVER-CURSOR);
}

.checklist-category-name-edit-icon-container:hover,
.checklist-category-delete-icon-container:hover,
.checklist-category-expand-icon-container:hover {
    background-color: lightgrey;
    border-radius: 12px;
}



</style>
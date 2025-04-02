<template>
    <button 
        class="dropdown-item" 
        @click.prevent="clickDropdownItem"
        :disabled="dropdownDisabled">
        <img 
            class="dropdown-item-image"
            src="/icons/user-icon.png"    
        >
        <div class="dropdown-item-name">{{ props.user.firstName + ' ' + props.user.lastName }}</div>
        <div class="dropdown-item-description">{{ props.user.username }}</div>
</button>

</template>

<script setup>
import { ref, defineProps, inject, computed } from 'vue';

const $bus = inject('$bus');
const props = defineProps(['user', 'index', 'updateEvent', 'clickedNames']);

function clickDropdownItem() {
    $bus.$emit(props.updateEvent, {
        index: props.index
    });
}

const dropdownDisabled = computed(() => {
    return props.clickedNames.some((object) => {

        if(object.username === props.user.username){
            return true;
        }
    })

    return false;
})
</script>

<style>
.dropdown-item {
    /* Box and Size Properties */
    width: 100%;
    margin: 5px 0px;
    padding: 2px 0px;

    /* Color */
    background-color: white;
    border-radius: 10px;

    /* Display */
    display: grid;
    grid-template-columns: 50px 1fr;
    grid-template-areas: 
        "dropdown-item-image dropdown-item-name"
        "dropdown-item-image dropdown-item-description"
    ;

    border: var(--GENERAL-BORDER);

    /* Others */
    cursor: pointer;
}

.dropdown-item:hover {
    background-color: var(--SUPP-THEME-COLOR-LIGHT);
    color: var(--SUPP-FONT-COLOR-LIGHT)
}

.dropdown-item-image {
    grid-area: dropdown-item-image;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    margin: 10px;
}

.dropdown-item:disabled {
    background-color: lightgrey;
    color: var(--SUPP-FONT-COLOR);
    pointer-events: none;
}

.dropdown-item-name {
    grid-area: dropdown-item-name;
    font-size: 0.9rem;
    text-align: left;
    padding-top: 5px;
    
}

.dropdown-item-description {
    grid-area: dropdown-item-description;
    font-size: 0.7rem;
    text-align: left;
}
</style>
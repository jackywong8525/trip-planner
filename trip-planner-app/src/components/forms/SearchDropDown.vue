<template>
    <div class="dropdown-item">
        <img 
            class="dropdown-item-image"
            src="/icons/user-icon.png"    
        >
        <div class="dropdown-item-name">{{ props.name }}</div>
        <div class="dropdown-item-description">{{ props.description }}</div>
    </div>

</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps(['name',  'description', 'index']);
</script>

<style>
.dropdown-item {
    /* Box and Size Properties */
    height: 50px;
    margin: 5px 0px;

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

.dropdown-item-name {
    grid-area: dropdown-item-name;
}

.dropdown-item-description {
    grid-area: dropdown-item-description;
    font-size: 0.8rem;
}
</style>
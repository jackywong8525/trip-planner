<template>
    <div class="card-button">
        <img 
            :src="props.imageSource"
            class="card-button-image"
        >
        <p class="card-button-content">
            {{ props.content }}
        </p>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

// Props
const props = defineProps(['imageSource', 'content']);



</script>

<style scoped>
.card-button {
    /* Box and Size Properties */
    min-width: 250px;
    height: 200px;
    margin: 10px 20px;

    /* Color */
    background-color: var(--SUPP-THEME-COLOR-DARK);
    
    /* Border */
    border-radius: 5px;
    
    /* Shadow */
    box-shadow: var(--GENERAL-SHADOW);

    /* Display */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;

    /* Others */
    cursor: pointer;
}

.card-button:hover {
    transition: transform 0.1s ease-in-out;
    transform: scale(1.01);
}

@media screen and (max-width: 590px) {
    .card-button {
        /* Box and Size Properties */
        height: 100px;

        /* Display */
        flex-direction: row;
    }
}

.card-button-image {
    /* Box and Size Properties */
    width: 50px;
    height: auto;
    margin: 20px;
}

.card-button-content {
    /* Font */
    font-size: 1.2rem;
    color: var(--SUPP-FONT-COLOR-LIGHT);
}
</style>
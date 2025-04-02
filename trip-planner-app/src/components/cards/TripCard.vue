<template>
    <div class="trip-card">
        <p class="trip-card-content">

        </p>
    </div>
</template>

<script>
import { ref, defineProps } from 'vue';

const props = defineProps['trip'];
</script>

<style scoped>
.trip-card {
    /* Box and Size Properties */
    min-width: 250px;
    height: 400px;
    margin: 10px 20px;

    /* Color */
    background-color: var(--SUPP-THEME-COLOR-LIGHT);
    
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

.trip-card:hover {
    transition: transform 0.1s ease-in-out;
    transform: scale(1.01);
}
</style>


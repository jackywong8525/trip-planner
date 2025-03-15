<template>
    <div class="subheader">
        {{ subheaderContent }}
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps(['subheaderContent']);

</script>

<style>

.subheader {
    /* Display */
    display: flex;
    align-items: center;

    /* Border */
    border-radius: 5px;

    /* Color */
    background-color: var(--SUPP-THEME-COLOR-LIGHT);

    /* Box and Size Properties */
    height: 50px;
    padding: 10px;
    margin: 10px 5px;

    /* Font */
    font-size: 1rem;
    color: var(--SUPP-FONT-COLOR-LIGHT);
}


</style>
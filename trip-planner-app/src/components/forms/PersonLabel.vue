<template>
    <div class="person-label">
        <div class="person-label-content">
            <img 
                class="person-label-image"
                src="/icons/user-icon.png" 
            >
            <p class="person-label-text">{{ text }}</p>
        </div>
        <div 
            class="person-label-cancel-button"
            @click.prevent="deletePersonLabel">X</div>
    </div>
</template>

<script setup>
import { inject } from 'vue';

const $bus = inject('$bus');

const props = defineProps({
    text: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        required: false
    }
})

function deletePersonLabel() {
    $bus.$emit('delete-person-label', props.index);
}
</script>

<style scoped>
.person-label {
    /* Box and Size Properties */
    height: 40px;
    padding: 5px;

    /* Color */
    background-color: white;

    /* Border and Shadow*/
    border-radius: 15px;
    box-shadow: var(--SMALL-ITEM-SHADOW);

    /* Display */
    display: grid;
    grid-template-columns: 1fr 25px;
    flex: 1;

    /* Font */
    text-wrap: nowrap;
}

.person-label-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    flex: 1;
}

.person-label-cancel-button {

    display: flex;
    justify-content: center;
    align-items: center;

    /* Border */
    border-radius: 30px;

    /* Transition */
    transition: background-color 0.1s ease-in-out;

    /* Others */
    cursor: pointer;

}

.person-label-cancel-button:hover {
    /* Color */
    background-color: lightgrey;
}

.person-label-image {
    width: 30px;
    height: 30px;
    border: var(--GENERAL-BORDER);
    border-radius: 15px;
}
</style>
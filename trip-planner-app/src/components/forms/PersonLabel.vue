<template>
    <div class="person-label">
        <img 
            class="person-label-image"
            src="/icons/user-icon.png" 
        >
        <p class="person-label-text">{{ text }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    text: {
        type: String,
        required: true
    }
})
</script>

<style scoped>
.person-label {
    height: 40px;
    padding: 5px;
    max-width: 250px;
    background-color: white;
    border-radius: 15px;

    box-shadow: var(--SMALL-ITEM-SHADOW);

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    flex: 1;

}

.person-label-image {
    width: 30px;
    height: 30px;
    border: var(--GENERAL-BORDER);
    border-radius: 15px;
}
</style>
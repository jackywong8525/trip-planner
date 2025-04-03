<template>
    <div class="alert">

    </div>
</template>

<script setup>

const AlertType = Object.freeze({
    SUCCESS: {
        icon: '',
        color: 'green'
    },
    INFORMATION: {
        icon: '',
        color: 'yellow'
    },
    CAUTION: {
        icon: '',
        color: 'red'
    }
});

const props = defineProps({
    alertType: {
        type: AlertType,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

</script>

<style>

</style>
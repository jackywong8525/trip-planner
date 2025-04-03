<template>
    <Transition name="fade">
        <div 
            class="alert"
            :style="{backgroundColor: props.alertType.color}"
            v-show="isVisible">
            <img 
                :src="props.alertType.icon"
                class="alert-icon">
            <p class="alert-message">{{ props.message }}</p>
        </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';

const $bus = inject('$bus');
const isVisible = ref(false);

onMounted(() => {
    isVisible.value = true;
});

$bus.$on('hide-alert', () => {
    isVisible.value = false;
});

const props = defineProps({
    alertType: {
        type: Object,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

</script>

<style>

@keyframes showAlert {
    0% {
        transform: translate(-50%, -100%);
        opacity: 0;
    }

    100% {
        transform: translateX(-50%);
        opacity: 1;
    }
}

.fade-enter-active {
    animation: showAlert 0.5s ease-in-out;
}

.fade-leave-active {
    animation: showAlert 0.5s ease-in-out reverse;
}

.alert {
    position: absolute;
    left: 50vw;
    top: 80px;
    transform: translateX(-50%);
    z-index: 99;

    display: grid;
    grid-template-columns: 60px 1fr;
    width: 350px;
    height: 60px;

    border-radius: 10px;
} 

.alert-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    margin: 10px;
}

.alert-message {
    display: flex;
    justify-content: center;
    align-items: center;

    color: var(--SUPP-FONT-COLOR-LIGHT);
}


</style>
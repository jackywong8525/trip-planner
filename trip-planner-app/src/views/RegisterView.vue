<template>
    <div class="register-section">
        <RegisterForm 
            :class="'register-section-form'"
        >
        </RegisterForm>
    </div>
</template>

<script>
import RegisterForm from '@/components/forms/RegisterForm.vue';

export default {
    components: {
        RegisterForm
    }
}


</script>

<style scoped>

.register-section {
    /* Display */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;

    /* Box and Size Properties */
    margin: 10px 0px;
    padding: 10px;
    min-height: 85dvh;

    /* Background Image */
    background-image: url('/images/bg-image-home.jpg');
    /* Darken the background image */
    background-color: rgba(76, 76, 76, 0.6);
    background-blend-mode: darken;
    
    background-size: cover;
    background-repeat: no-repeat;

}

.register-section-form {
    /* Display */
    flex: 1;
}
</style>
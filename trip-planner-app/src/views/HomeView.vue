<template>  
    <div class="login-section">
        <h1 
            class="login-section-title center"
        >
            START PLANNING YOUR TRIP!
        </h1>
        <LoginForm 
            class="login-section-form"
        >
        </LoginForm>
    </div>
</template>

<script>
import LoginForm from '@/components/forms/LoginForm.vue';

export default {
    components: {
        LoginForm
    }
}

</script>

<style scoped>

.login-section {
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

    /* Background Image */
    background-image: url('/images/bg-image-home.jpg');
    /* Darken the background image */
    background-color: rgba(76, 76, 76, 0.6);
    background-blend-mode: darken;
    
    background-size: cover;
    background-repeat: no-repeat;

}

.login-section-title {
    /* Font */
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    color: var(--SUPP-FONT-COLOR-LIGHT);

    /* Display */
    flex: 1;

    /* Box and Size Properties */
    min-width: min(50vw, 350px);
    max-width: 600px;
    margin: 5px;
}

.login-section-form {
    /* Display */
    flex: 1;
}

</style>
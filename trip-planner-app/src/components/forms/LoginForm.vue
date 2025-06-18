<template>
    <div class="login-section-container">

        <h2 class="login-section-heading">Login your account</h2>

        <form class="login-form" action="">
            
            <FormInput
                :type-of-input="'text'"
                :input-label="'Username'"
                :update-event="'login-username-updated'"
            >
            </FormInput>

            <FormInput
                :type-of-input="'password'"
                :input-label="'Password'"
                :update-event="'login-password-updated'"
            >
            </FormInput>

            <div 
                v-if="!loginStatus && loginAttempted"
                class="login-msg-section">
                <img 
                    src="/icons/caution-icon.png"
                    class="login-msg-icon">
                <p class="login-msg center">{{ loginMessage }}</p>
            </div>

            <button 
                @click.prevent="login"
                class="login-button"
                :disabled="submitted"
            >
                Login
            </button>
        </form>

        <div class="register-link-section center">
            <span>Haven't have an account yet? Register 
                <a href="/register" class="register-link">Here</a>
            </span>
        </div>
    </div>

</template>

<script>

import FormInput from '@/components/forms/FormInput.vue'
import AuthService from '@/auth/AuthService';
import { alphabetsAndDigits } from '@/utils/inputValidation';

export default {
    components: {
        FormInput
    },
    
    data() {
        return {
            username: '',
            password: '',
            submitted: false,
            loginMessage: '',
            loginStatus: false,
            loginAttempted: false
        }
    },
    inject: ['$bus'],
    created() {
        this.$bus.$on('login-username-updated', this.updateUsername);

        this.$bus.$on('login-password-updated', this.updatePassword);
    },
    methods: {
        updateUsername(username){
            this.username = username;
        },
        updatePassword(password){
            this.password = password;
        },
        toggleSubmitted(submitted){
            this.submitted = submitted;
            this.$bus.$emit('form-submitted', this.submitted);
        },
        async login(){

            this.toggleSubmitted(true);

            if(!this.validateLoginInfo()){
                this.toggleSubmitted(false);
                this.loginAttempted = true;
                return;
            }

            const responseObj = await AuthService.login(this.username, this.password);

            this.loginStatus = responseObj.success;
            this.loginMessage = responseObj.message;

            this.toggleSubmitted(false);

            if(this.loginStatus){
                this.$bus.$emit('login-successful', true);

                this.$router.push({ path: 'main/home' });
            }

            this.loginAttempted = true;
             
        },
        validateLoginInfo(){

            let validationStatus = true;

            if(this.username === ''){
                this.loginMessage = 'Username is required.'
                validationStatus = false;
            }

            else if(this.password === ''){
                this.loginMessage = 'Password is required.'
                validationStatus = false;
            }

            else if(!alphabetsAndDigits.test(this.username)){
                this.loginMessage = 'Username should only contain alphabets and digits.'
                validationStatus = false;
            }

            return validationStatus;
        }
        
    }
}

</script>

<style scoped>

.login-section-container {
    /* Display */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;

    /* Box and Size Properties */
    min-width: 350px;
    max-width: min(60vw, 450px);
    height: clamp(400px, 50dvh, 450px);
    padding: 20px;

    /* COLOR */
    background-color: var(--MAIN-THEME-COLOR);

    /* Border */
    border-radius: 1vw;

    /* Shadow */
    box-shadow: var(--GENERAL-SHADOW)
}

.login-section-heading {
    /* Font */
    font-size: 1.4rem;
    color: var(--MAIN-FONT-COLOR);

    /* Box and Size Properties */
    margin: 10px 0px 0px 0px;
}

.login-form {
    /* Font */
    font-size: 0.8rem;
    color: var(--MAIN-FONT-COLOR);

    /* Display */
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    /* Size and Box Properties */
    min-height: clamp(225px, 30dvh, 250px);
    width: clamp(200px, 25vw, 250px);
}

.register-link-section {
    /* Font */
    font-size: 0.8rem;
    color: var(--SUPP-FONT-COLOR-LIGHT);

    /* Box and Size Properties */
    padding: 10px 0px;
    /* margin: 10px 5px; */
}

.register-link {
    /* Font */
    font-style: var(--LINK-FONT-STYLE);
    color: var(--SUPP-FONT-COLOR);

    /* Additional Styling */
    cursor: var(--LINK-CURSOR);
}

.login-button {
    /* Border */
    border: var(--BUTTON-BORDER);
    border-radius: var(--BUTTON-BORDER-RADIUS);

    /* Box and Size Properties */
    height: var(--BUTTON-HEIGHT);
    padding: var(--BUTTON-PADDING);

    /* Color */
    background-color: var(--DEFAULT-BUTTON-COLOR);
}

.login-button:hover {
    /* Additional Styling */
    filter: var(--BUTTON-HOVER-FILTER);
    cursor: var(--BUTTON-HOVER-CURSOR);
}


.login-msg-section {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    padding: 10px;
}

.login-msg {
    /* Font */
    font-size: 0.8rem;
    color: var(--CAUTION-FONT-COLOR);
    font-weight: bolder
}

.login-msg-icon {
    width: 20px;
}


</style>
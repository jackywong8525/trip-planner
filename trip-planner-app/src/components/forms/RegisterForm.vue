<template>
    <div 
        v-if="!registerStatus" class="register-section-container"
    >

        <h2 class="register-section-heading">Register your account</h2>

        <form class="register-form" action="">
            
            <FormInput
                :type-of-input="'text'"
                :input-label="'Last Name'"
                :update-event="'lname-updated-register'"
                :validation="lastNameValidation"
                class="last-name-input"
            >
            </FormInput>

            <FormInput
                :type-of-input="'text'"
                :input-label="'First Name'"
                :update-event="'fname-updated-register'"
                :validation="firstNameValidation"
                class="first-name-input"
            >
            </FormInput>

            <FormInput
                :type-of-input="'email'"
                :input-label="'Email Address'"
                :update-event="'email-updated-register'"
                :validation="emailValidation"
                class="email-input"
            >
            </FormInput>

            <FormInput
                :type-of-input="'text'"
                :input-label="'Phone Number'"
                :update-event="'phone-updated-register'"
                :validation="phoneNumberValidation"
                class="phone-input"
            >
            </FormInput>

            <FormInput
                :type-of-input="'text'"
                :input-label="'Username'"
                :update-event="'username-updated-register'"
                :validation="usernameValidation"
                class="username-input"
            >
            </FormInput>
            
            <FormInput
                :type-of-input="'password'"
                :input-label="'Password'"
                :update-event="'password-updated-register'"
                :validation="passwordValidation"
                class="password-input"
            >
            </FormInput>

            <div 
                v-if="!registerStatus && registerAttempted"
                class="register-msg-section">
                <img 
                    src="/icons/caution-icon.png"
                    class="register-msg-icon">
                <p class="register-msg center">{{ registerMessage }}</p>
            </div>

            <button 
                @click.prevent="register"
                class="register-button"
                :disabled="submitted"
            >
                Register
            </button>
        </form>
        <div class="login-link-section center">
            <span>Already have an account yet? Login your account
                <a href="/" class="login-link">Here</a>
            </span>
        </div>
    </div>

    <div
        v-if="registerStatus"
        class="register-section-container"
    >
        <img 
            src="../../../public/icons/tick-icon.png"
            class="register-success-icon"
        >

        <p  class="register-success-msg center">
            You have registrated an account successfully!
        </p>

        <div class="login-link-section center">
            <span>Back to home to 
                <a href="/" class="login-link">login</a>
            </span>
        </div>
    </div>
</template>

<script>
import FormInput from './FormInput.vue';
import AuthService from '@/auth/AuthService';
import {InputValidation, alphabets, alphabetsAndDigits, digits, emailPattern} from '@/utils/inputValidation';

export default {
    components: {
        FormInput
    },

    inject: ['$bus'],

    data() {
        return {
            lastName: '',
            firstName: '',
            email: '',
            phoneNumber: '',
            username: '',
            password: '',
            submitted: false,
            registerMessage: '',
            registerStatus: false,
            registerAttempted: false
        }
    },

    created(){

        this.$bus.$on('lname-updated-register', this.updateLastName);
        this.$bus.$on('fname-updated-register', this.updateFirstName);
        this.$bus.$on('email-updated-register', this.updateEmail);
        this.$bus.$on('phone-updated-register', this.updatePhoneNumber);
        this.$bus.$on('username-updated-register', this.updateUsername);
        this.$bus.$on('password-updated-register', this.updatePassword);

    },

    methods: {
        updateLastName(lastName){
            this.lastName = lastName;
        },
        updateFirstName(firstName){
            this.firstName = firstName;
        },
        updateEmail(email){
            this.email = email;
        },
        updatePhoneNumber(phoneNumber){
            this.phoneNumber = phoneNumber;
        },
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
        async register(){

            this.toggleSubmitted(true);

            this.registerAttempted = true;

            if(!this.validateRegisterInfo()){
                this.toggleSubmitted(false);
                this.registerAttempted = true;
                return;
            }

            const user = {
                lastName: this.lastName,
                firstName: this.firstName,
                email: this.email,
                phoneNumber: this.phoneNumber,
                username: this.username,
                password: this.password
            }

            const responseObj = await AuthService.register(user);

            this.registerStatus = responseObj.success;
            this.registerMessage = responseObj.message;

            this.registerAttempted = true;

            this.toggleSubmitted(false);
        },
        validateRegisterInfo() {

            if(this.lastName === ''
                || this.firstName === ''
                || this.email === ''
                || this.phoneNumber === ''
                || this.username === ''
                || this.password === ''
            ){
                this.registerMessage = 'All fields are required.';
                return false;
            }

            else if(!alphabets.test(this.lastName)
                    || !alphabets.test(this.firstName)){

                this.registerMessage = 'Name should not contain digits or special characters.';
                return false;
            }

            else if(!emailPattern.test(this.email)){
                this.registerMessage = 'The email format is not correct. It should be in xxxxxx@xxx.xxx format.';
                return false;
            }

            else if(!digits.test(this.phoneNumber)){
                this.registerMessage = 'The phone number format is not correct. It should be all digits.';
                return false;
            }

            else if(!alphabetsAndDigits.test(this.username)){
                this.registerMessage = 'The username should only contains alphabets and digits.';
                return false;
            }

            else if(this.password.length < 8){
                this.registerMessage = 'The password should be at least 8 characters long.';
                return false;
            }

            return true;
        }
    },

    computed: {
        lastNameValidation() {
            return [
                new InputValidation((lname) => {
                    return lname !== '';
                }, 'Last name is required.'),

                new InputValidation((lname) => {
                    return alphabets.test(lname);
                }, 'Last name should only contain alphabets')
            ]
            
        },

        firstNameValidation() {
            return [
                new InputValidation((fname) => {
                    return fname !== '';
                }, 'First name is required.'),

                new InputValidation((fname) => {
                    return alphabets.test(fname);
                }, 'First name should only contain alphabets')
            ]
        },

        emailValidation() {
            return [
                new InputValidation((email) => {
                    return email !== '';
                }, 'Email is required.'),

                new InputValidation((email) => {
                    return emailPattern.test(email);
                }, 'The email format is not correct. It should be in xxxxxx@xxx.xxx format.')
            ]
        },

        phoneNumberValidation() {
            return [
                new InputValidation((phoneNumber) => {
                    return phoneNumber !== '';
                }
                , 'Phone Number is required.'),

                new InputValidation((phoneNumber) => {
                    return digits.test(phoneNumber);
                }, 
                'The phone number should only contain digits.')
            ]
        },

        usernameValidation() {
            return [
                new InputValidation((username) => {
                    return username !== '';
                }
                , 'Username is required.'),

                new InputValidation((username) => {
                    return alphabetsAndDigits.test(username);
                }, 
                'The username should only contain alphabets and digits.')
            ]
        },

        passwordValidation() {
            return [
                new InputValidation((password) => {
                    return password !== '';
                }
                , 'Password is required.'),

                new InputValidation((password) => {
                    return password.length >= 8 && password.length <= 20;
                }, 
                'The phone number should contain at least 8 digits and at most 20 digits.')
            ]
        }
    }

}
</script>

<style scoped>

.register-section-container {
    /* Display */
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    flex: 1;

    /* Box and Size Properties */
    min-width: 325px;
    max-width: min(60vw, 450px);
    height: auto;
    padding: 10px;

    /* COLOR */
    background-color: var(--MAIN-THEME-COLOR);

    /* Border */
    border-radius: 1vw;

    /* Shadow */
    box-shadow: var(--GENERAL-SHADOW)
}

.register-section-heading {
    /* Font */
    font-size: 1.4rem;
    color: var(--MAIN-FONT-COLOR);

    /* Box and Size Properties */
    margin: 10px;
}

.register-form {
    /* Font */
    font-size: 0.8rem;
    color: var(--MAIN-FONT-COLOR);

    /* Size and Box Properties */
    width: clamp(250px, 50vw, 350px);

    /* Display */
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 5px;
    row-gap: 5px;
    grid-template-areas: 
        "lname fname"
        "email email"
        "phone phone"
        "username username"
        "password password"
        "register-msg-section register-msg-section"
        "register-button register-button"
    ;

    
}

.last-name-input {
    grid-area: lname;
}

.first-name-input {
    grid-area: fname;
}

.email-input {
    grid-area: email;
}

.phone-input {
    grid-area: phone;
}

.username-input {
    grid-area: username;
}

.password-input {
    grid-area: password;
}

.last-name-input,
.first-name-input,
.email-input,
.phone-input,
.username-input,
.password-input {
    min-width: 0;
    min-height: 0;
    /* overflow: hidden; */
}

.login-link-section {
    /* Font */
    font-size: 0.8rem;
    color: var(--SUPP-FONT-COLOR-LIGHT);

    /* Box and Size Properties */
    padding: 10px 0px;
    margin: 10px 5px;
}

.login-link {
    /* Font */
    font-style: var(--LINK-FONT-STYLE);
    color: var(--SUPP-FONT-COLOR);

    /* Additional Styling */
    cursor: var(--LINK-CURSOR);
}

.register-button {

    /* Display */
    grid-area: register-button;

    /* Border */
    border: var(--BUTTON-BORDER);
    border-radius: var(--BUTTON-BORDER-RADIUS);

    /* Box and Size Properties */
    height: var(--BUTTON-HEIGHT);
    padding: var(--BUTTON-PADDING);

    /* Color */
    background-color: var(--DEFAULT-BUTTON-COLOR);
}

.register-button:hover {
    /* Additional Styling */
    filter: var(--BUTTON-HOVER-FILTER);
    cursor: var(--BUTTON-HOVER-CURSOR);
}

.register-success-icon {
    width: 100px;
}

.register-success-msg {
    font-size: 1.4rem;
    color: var(--MAIN-FONT-COLOR);
    font-weight: bolder;
}

.register-msg-section {
    grid-area: register-msg-section;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.register-msg {
    /* Font */
    font-size: 0.8rem;
    color: var(--CAUTION-FONT-COLOR);
    font-weight: bolder
}

.register-msg-icon {
    width: 20px;
}
</style>
<template>
    <div class="form-input-container">
        <input
            :type="typeOfInput"
            :disabled="submitted"
            placeholder="" 
            class="form-input"
            :class="{ 'caution-form-input': showCaution }"
            v-model="inputValue"            
            @input="updateInputValue(inputValue)" 
        />
        <span :class="`input-label ${showCaution ? 'caution-input-label' : ''}`">{{ inputLabel }}</span>
        <div 
            v-if="showCaution"
            class="caution-input-msg">
            {{ inputMessage }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        inputLabel: String,
        typeOfInput: String,
        updateEvent: String,
        validation: Array
    },
    inject: ['$bus'],
    created() {
        this.$bus.$on('form-submitted', this.toggleSubmitted);
        this.$bus.$on(`reset-input-${this.updateEvent}`, this.resetInputValue);
    },
    data() {
        return {
            inputValue: '',
            inputMessage: '',
            submitted: false,
            inputAttempted: false
        }
    },
    methods: {
        updateInputValue(data) {
            this.$bus.$emit(`${this.updateEvent}`, data);
            this.inputAttempted = true;
        },
        toggleSubmitted(submitted){
            this.submitted = submitted;
        },
        resetInputValue(){
            this.inputValue = '';
        }
    },
    computed: {
        validateInputValue() {

            if(!this.validation){ return true; }

            for(let i = 0; i < this.validation.length; i++){
                let inputValidationObj = this.validation[i];

                console.log(inputValidationObj.condition(this.inputValue));

                if(!inputValidationObj.condition(this.inputValue)){ 
                    this.inputMessage = inputValidationObj.message;
                    return false;
                }

            }

            return true;

        },
        showCaution() {
            return !this.validateInputValue && this.inputAttempted; 
        }
    }
}

</script>

<style scoped>
.form-input {
    /* Border */
    border-radius: 5px;

    /* Box and Size Properties */
    max-height: 50px;
    min-width: 0; /* Make it to be 0 so it can be resized based on the parent container */
    padding: 15px 5px;

    /* Additional Styling */
    outline: none;

    /* Display */
    flex: 1;
}

.form-input:focus {
    /* Box and Size Properties */
    border: var(--FORM-INPUT-BORDER);
}

.caution-form-input,
.caution-form-input:focus {
    /* Box and Size Properties */
    border: var(--FORM-INPUT-CAUTION-BORDER);
}

.form-input:focus,
.form-input:not(:focus):not(:placeholder-shown) {
    /* Box and Size Properties */
    padding: 20px 5px 15px 5px;
}

.form-input:focus ~ .input-label, 
.form-input:not(:focus):not(:placeholder-shown) ~ .input-label {
    /* Position */
    left: 5px;    
    top: 2px;

    /* Font */
    font-size: 0.6rem;
    color: var(--MAIN-FONT-COLOR);
}

.form-input:focus ~ .caution-input-label, 
.form-input:not(:focus):not(:placeholder-shown) ~ .caution-input-label {
    color: var(--CAUTION-FONT-COLOR-LIGHT);
}

.input-label {
    /* Position */
    position: absolute;
    left: 5px;
    top: 15px;

    /* Additional Styling (To ensure the label does not interfere the click event) */
    pointer-events: none;

    /* Transition */
    transition: 0.2s ease all;

    /* Font */
    color: grey;
}

.form-input-container {
    position: relative;

    /* Display */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.caution-input-msg {
    color: var(--CAUTION-FONT-COLOR-LIGHT);
}


</style>
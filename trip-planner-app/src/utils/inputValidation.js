class InputValidation {
    condition;
    message;

    constructor(condition, message) {
        this.condition = condition;
        this.message = message;
    }
}

const alphabets = /^[A-Za-z ]+$/;
const alphabetsAndDigits = /^[A-Za-z0-9]+$/;
const digits = /^[0-9]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export {
    InputValidation,
    alphabets,
    alphabetsAndDigits,
    digits,
    emailPattern
}
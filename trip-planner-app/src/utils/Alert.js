class Alert {
    alertType;
    message;

    constructor(alertType, message){
        this.alertType = alertType;
        this.message = message;
    }

    getAlertType(){
        return this.alertType;
    }

    getMessage(){
        return this.message;
    }

    setAlertType(alertType){
        this.alertType = alertType;
    }

    setMessage(message){
        this.message = message;
    }
}

export {
    Alert
}
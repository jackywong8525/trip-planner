import { API_URL } from "@/utils/backendConnection";

class AuthService {
    async login(username, password){
        const response = await fetch(API_URL + '/user/auth/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const responseObj = await response.json();
        
        if(!responseObj){
            return {
                success: false,
                message: 'Error occurred. Please try again.'
            }
        } 

        if(responseObj.success && responseObj.token){
            localStorage.setItem('user', JSON.stringify(responseObj.token));
        }

        return responseObj;
    }

    async register(user){
        const response = await fetch(API_URL + '/user/auth/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const responseObj = await response.json();

        if(!responseObj){
            return {
                success: false,
                message: 'Error occurred. Please try again.'
            }
        } 

        return responseObj;
    }

    logout(){
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();
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
            localStorage.setItem('userToken', JSON.stringify(responseObj.token));
        }

        await this.getCurrentUserInfo();

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
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('userToken'));
    }

    async getCurrentUserInfo() {

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if(userInfo){
            return userInfo;
        }

        const response = await fetch(API_URL + '/user/get-active-user', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.getCurrentUser()}`
            },
            body: JSON.stringify({
                token: this.getCurrentUser()
            })
        });
    
        const responseObj = await response.json();

        localStorage.setItem('userInfo', JSON.stringify(responseObj.user));

        return responseObj.user;
    }
}

export default new AuthService();
export const storage = {
    
    getToken(){
        let token = localStorage.getItem('token')
                    ? localStorage.getItem('token')
                    : ''
        return token;
    },

    setToken(token){
        localStorage.setItem('token', token ? token : '');
    },

    removeToken(){
        localStorage.removeItem('token');
    },


    getUserId(){
        let token = localStorage.getItem('userId')
                    ? localStorage.getItem('userId')
                    : ''
        return token;
    },

    setUserId(userId){
        localStorage.setItem('userId', userId ? userId : '');
    },

  
    getEmployeeId() {
        let token = localStorage.getItem('employeeId')
                    ? localStorage.getItem('employeeId')
                    : ''
        return token; 
    },

    removeUserId(){
        localStorage.removeItem('userId');
    }
}
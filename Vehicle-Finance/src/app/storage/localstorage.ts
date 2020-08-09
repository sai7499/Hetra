export const storage = {

    getToken() {
        let userId = localStorage.getItem('token')
            ? localStorage.getItem('token')
            : '';
        return userId;
    },

    setToken(token) {
        localStorage.setItem('token', token ? token : '');
    },

    removeToken() {
        localStorage.removeItem('token');
    },


    getUserId() {
        let token = localStorage.getItem('userId')
            ? localStorage.getItem('userId')
            : ''
        return token;
    },

    setUserId(userId) {
        localStorage.setItem('userId', userId ? userId : '');
    },


    getEmployeeId() {
        let token = localStorage.getItem('employeeId')
            ? localStorage.getItem('employeeId')
            : ''
        return token;
    },

    removeUserId() {
        localStorage.removeItem('userId');
    },

    checkToken() {
        if (localStorage.getItem('token')) {
            return true
        }
        else {
            return false
        }
    },

    getRoleType() {
        let role = localStorage.getItem('role')
            ? localStorage.getItem('role')
            : ''
        return role;
    },

    removeRoleType() {
        localStorage.removeItem('role');
    }

}
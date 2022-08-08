import jwtDecode from "jwt-decode";
import httpServ from './httpService';

const apiEndPoint = "/auth";
const tokenKey = "token";

export const loginUser = async (user) => {
    const {data: jwt} = await ( httpServ.post(apiEndPoint, user) );
    localStorage.setItem(tokenKey, jwt);
}

export const loginWithJwt = (jwt) => {
    localStorage.setItem(tokenKey, jwt);
}

export const logOut = () => {
    localStorage.removeItem(tokenKey);
}

export const getCurrentUser = () => {
    try {
        const jwt = localStorage.getItem(tokenKey);
        const user = jwtDecode(jwt);
        return user;
    } catch (error) {
        return null;
    }
}

export const getJwt = () => {
    return localStorage.getItem(tokenKey);
}

export const registerUser = async (user) => {  
    const response = await httpServ.post("/users", user);
    const jwt = response.headers["x-auth-token"];
    localStorage.setItem(tokenKey, jwt);
}

httpServ.setJwt(getJwt());

const authService = {
    registerUser, loginUser, loginWithJwt, logOut, getCurrentUser, getJwt
}
export default authService;

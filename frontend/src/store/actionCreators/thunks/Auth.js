import axios from "axios";
import { setUser } from "../authActions";
import { defaultAuthState } from "../../reducers/authReducer";
import { setNotification } from "../notificationActions";
import { NOTIFICATION_TYPE } from "../../actionTypes";

const BASE_URL = process.env.REACT_APP_API_ADDRESS;

export const loginThunk = (user) => {
    return async function(dispatch) {
        try {
            const response = await axios.post(`${BASE_URL}/login`, user, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true});
            console.log(response.data);
            dispatch(setUser(response.data));

            const notification = {
                type: NOTIFICATION_TYPE.success,
                message: `Logged in as ${response.data.email}`,
            }
            dispatch(setNotification(notification));
        } catch (e) {
            console.log(e);
        }
    }
};

export const registerThunk = (user) => {
    return async function(dispatch) {
        try {
            const response = await axios.post(`${BASE_URL}/register`, user, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log(response.data);
            dispatch(setUser(response.data));

            const notification = {
                type: NOTIFICATION_TYPE.success,
                message: `New user registered with email ${response.data.email}`,
            }
            dispatch(setNotification(notification));

        } catch (e) {
            console.log(e);
        }
    }
}

export const logoutThunk = () => {
    return async function(dispatch) {
        try {
            await axios.get(`${BASE_URL}/logout`, {withCredentials: true});
            dispatch(setUser(defaultAuthState));
            
            const notification = {
                type: NOTIFICATION_TYPE.success,
                message: "User has logged out!",
            }
            dispatch(setNotification(notification));

            console.log("User logged out");
        } catch (e) {
            console.log(e);
        }
    }
}

export const statusThunk = () => {
    return async function(dispatch) {
        try {
            const response = await axios.get(`${BASE_URL}/authstatus`, {withCredentials: true});
            dispatch(setUser(response.data));
        } catch (e) {
            console.log(e);
            dispatch(setUser(defaultAuthState));
        }
    }
}
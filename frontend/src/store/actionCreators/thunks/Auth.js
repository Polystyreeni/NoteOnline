import axios from "axios";
import { setUser } from "../authActions";
import { defaultAuthState } from "../../reducers/authReducer";
import { setNotification } from "../notificationActions";
import { APP_STATE_TYPE, NOTIFICATION_TYPE } from "../../actionTypes";
import { generateMessage } from "../../../utility/notificationUtils";
import { clearActiveNote } from "../activeNoteActions";
import { clearNotes } from "../noteActions";
import { setAppState } from "../appStateActions";

const BASE_URL = process.env.REACT_APP_API_ADDRESS;

export const loginThunk = (user) => {
    return async function(dispatch) {
        dispatch(setAppState(APP_STATE_TYPE.loading));
        try {
            const response = await axios.post(`${BASE_URL}/login`, user, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true});

            dispatch(setUser(response.data));

            const notification = generateMessage(NOTIFICATION_TYPE.success, `Logged in as ${response.data.email}`);
            dispatch(setNotification(notification));
            dispatch(setAppState(APP_STATE_TYPE.active));

        } catch (e) {
            const notification = generateMessage(NOTIFICATION_TYPE.error, `Failed to log in! Check your credentials.`);
            dispatch(setNotification(notification));
            dispatch(setAppState(APP_STATE_TYPE.active));
        }
    }
};

export const registerThunk = (user) => {
    return async function(dispatch) {
        dispatch(setAppState(APP_STATE_TYPE.loading));
        try {
            const response = await axios.post(`${BASE_URL}/register`, user, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            dispatch(setUser(response.data));
            const notification = generateMessage(NOTIFICATION_TYPE.success, `New user registered with email: ${response.data.email}! Please login.`);
            dispatch(setNotification(notification));
            
        } catch (e) {
            const notification = generateMessage(NOTIFICATION_TYPE.error, `Failed to create an account!`);
            dispatch(setNotification(notification));
            dispatch(setAppState(APP_STATE_TYPE.active));
        }
    }
};

export const logoutThunk = (sessionToken) => {
    return async function(dispatch) {
        try {
            await axios.post(`${BASE_URL}/logout`, {}, {
                headers: { "X-CSRF-TOKEN": sessionToken },
                withCredentials: true
            });
            dispatch(setUser(defaultAuthState));
            
            const notification = {
                type: NOTIFICATION_TYPE.success,
                message: "User has logged out!",
            }

            // Clear all notes from state
            dispatch(setNotification(notification));
            dispatch(clearNotes());
            dispatch(clearActiveNote());

            console.log("User logged out");
        } catch (e) {
            console.log(e);
        }
    }
};

export const statusThunk = () => {
    return async function(dispatch) {
        try {
            const response = await axios.get(`${BASE_URL}/authstatus`, {withCredentials: true});
            dispatch(setUser(response.data));
            dispatch(clearNotes());
            dispatch(clearActiveNote());
        } catch (e) {
            dispatch(setUser(defaultAuthState));
            dispatch(clearNotes());
            dispatch(clearActiveNote());
        }
    }
};
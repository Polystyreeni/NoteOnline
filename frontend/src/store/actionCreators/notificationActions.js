import { SET_NOTIFICATION } from "../actionTypes";

export const setNotification = (notification) => ({
    type: SET_NOTIFICATION,
    payload: notification,
});
import { LOGOUT_USER, SET_USER } from "../actionTypes";

export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

export const logoutUser = () => ({
    type: LOGOUT_USER,
});
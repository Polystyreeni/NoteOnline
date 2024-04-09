import { SET_APP_STATE } from "../actionTypes";

export const setAppState = (state) => ({
    type: SET_APP_STATE,
    payload: state,
});
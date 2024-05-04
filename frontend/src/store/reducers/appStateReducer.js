import { APP_STATE_TYPE, SET_APP_STATE } from "../actionTypes";

const defaultState = APP_STATE_TYPE.active;

const appStateReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_APP_STATE:
            return action.payload;
        default:
            return state;
    }
};

export default appStateReducer;
import { AUTH_ROLE_TYPE, LOGOUT_USER, SET_USER } from "../actionTypes";

export const defaultAuthState = {
    roles: [AUTH_ROLE_TYPE.unregistered],
};

const authReducer = (state = defaultAuthState, action) => {
    switch (action.type) {
        case SET_USER: {
            return action.payload;
        }
        case LOGOUT_USER: {
            return state;
        }
        default:
            return state;
    }
};

export default authReducer;